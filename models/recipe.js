//[Import]
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { Junior } = require("./user");
const { Category } = require("./category");
const { offloadFields, capitalize } = require("../utils");

//Recipe class
class Recipe {
  constructor(tempV, id) {
    if (tempV)
      offloadFields(
        [
          "id",
          "userID",
          "user",
          "recipeName",
          "recipeImages",
          "rating",
          "rating1",
          "rating2",
          "rating3",
          "rating4",
          "rating5",
          "ratingFancy",
          "report",
          "userRating",
          "aiMade",
          "ingredients",
          "instructions",
          "badges",
          "color",
          "uploadDate",
          "nutritions",
        ],
        this,
        tempV
      );
    else this.id = id;
  }

  //adds a recipe to the recipes schema
  async addRecipe() {
    try {
      const date = new Date();
      await schemas.Recipe.create({
        _id: mongoose.Types.ObjectId(),
        userID: this.userID || "6441a06e827a79b1666eb356",
        recipeName: this.recipeName,
        recipeImages: this.recipeImages,
        fullRating: {
          rating1: [],
          rating2: [],
          rating3: [],
          rating4: [],
          rating5: [],
        },
        report: [],
        aiMade: this.aiMade || false,
        ingredients: this.ingredients,
        instructions: this.instructions,
        badges: this.badge || [],
        color: this.color,
        uploadDate: date,
        nutritions: this.nutritions,
      });
      return { success: true, msg: null };
    } catch (error) {
      console.log(error);
      return { success: false, msg: "Invalid recipe" };
    }
  }

  //deletes a recipe by its id
  async delRecipe() {
    try {
      await schemas.Recipe.deleteOne({ _id: this.id });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /*[ Handling data ]*/
  //fetch single recipe from db
  async fetchRecipe(userID) {
    let details = await schemas.Recipe.findOne({ _id: this.id });
    const user = new Junior(null, details.userID);
    await user.fetchUser();
    this.user = user;
    if (details) {
      offloadFields(
        ["recipeName", "report", "aiMade", "instructions", "badges", "color", "uploadDate", "nutritions"],
        this,
        details
      );
      offloadFields(["rating1", "rating2", "rating3", "rating4", "rating5"], this, details.fullRating);
      this.userRating = null;
      if (userID) {
        //check logged in user's vote
        if (this.rating1.includes(userID)) this.userRating = "1";
        else if (this.rating2.includes(userID)) this.userRating = "2";
        else if (this.rating3.includes(userID)) this.userRating = "3";
        else if (this.rating4.includes(userID)) this.userRating = "4";
        else if (this.rating5.includes(userID)) this.userRating = "5";
      }
      this.refreshRating(details.fullRating);
      this.recipeImages = Recipe.parseImages(details.recipeImages, true);
      this.ingredients = Recipe.parseIngredients(details.ingredients);
      this.allergies = await Category.findCategory(details.ingredients, "allergy", true);
      return true;
    }
    return false;
  }

  //get all/filtered recipes from db
  static async fetchRecipes(search, bookmarks) {
    var term, filter, sort;
    if (search) ({ term, filter, sort } = search);
    if (filter) filter = await this.fetchFilter(filter);
    let recipes = [];
    let recipesArr;
    if (bookmarks) recipesArr = await schemas.Recipe.find({ _id: bookmarks });
    else recipesArr = await schemas.Recipe.find({});
    for (const recipe of recipesArr) {
      const user = new Junior(null, recipe.userID);
      await user.fetchUser();
      //search term:
      if (this.checkTerm(term, recipe, user)) continue;
      var tempRecipe = offloadFields(
        ["id", "recipeName", "report", "aiMade", "ingredients", "instructions", "badges", "color", "uploadDate", "nutritions"],
        null,
        recipe
      );
      var rating = Recipe.updateRatingNum(recipe.fullRating);
      tempRecipe.rating = {
        avg: rating.avg,
        total: rating.total,
        star: rating.star,
      };
      tempRecipe.user = user;
      tempRecipe.recipeImages = this.parseImages(recipe.recipeImages);
      //category filters:
      if (this.checkFilter(filter, tempRecipe)) continue;
      recipes.push(tempRecipe);
    }
    //sort by nutritional value:
    recipes = this.checkSort(sort, recipes);
    return recipes || [];
  }
  //search term:
  static checkTerm(term, recipe, user) {
    if (!term) return false;
    term = term.toLowerCase();
    if (
      //check recipe names
      !recipe.recipeName.toLowerCase().includes(term) &&
      //check usernames
      !user.userName.toLowerCase().includes(term) &&
      //check ingredients (check plural&singular)
      !recipe.ingredients.some((ing) => {
        let name = ing.name.toLowerCase();
        if (name.charAt(name.length - 1) == "s") name = name.slice(0 - 1);
        return name === term || name + "s" === term;
      })
    )
      return true;
    return false;
  }
  static async fetchFilter(filter) {
    if (!filter) return null;
    let badIngs = [];
    let categories = await Category.findCategoryByName(filter, true);
    if (categories.length == 0) return null; //failsafe
    categories.forEach((category) => badIngs.push(...category.ingredients));
    badIngs = Array.from(new Set(badIngs)); //remove duplicates
    if (badIngs.length == 0) return null;
    return badIngs;
  }
  //category filters:
  static checkFilter(filter, recipe) {
    if (!filter) return false;
    for (const ing of recipe.ingredients) {
      let name = ing.name.toLowerCase();
      if (name.charAt(name.length - 1) == "s") name = name.slice(0 - 1);
      /* jshint -W083 */
      let result = filter.some((cat) => {
        return cat.includes(name) || cat.includes(name + "s") || name.includes(cat) || (name + "s").includes(cat);
      });
      if (result) return true;
    }
    return false;
  }
  //sort by nutritional value:
  static checkSort(sort, recipes) {
    if (!sort)
      return recipes.sort((a, b) => {
        if (a.uploadDate > b.uploadDate) return 1;
        if (a.uploadDate < b.uploadDate) return -1;
        return 0;
      });
    const { category, dir } = sort;
    const sign = dir == "descend" ? -1 : 1;
    return recipes.sort((a, b) => {
      const aCat = a.nutritions[category] || -1;
      const bCat = b.nutritions[category] || -1;
      if (aCat < bCat) return sign;
      if (aCat > bCat) return sign * -1;
      return 0;
    });
  }
  //parse ingredients into text
  static parseIngredients(ingredients) {
    var ings = [];
    for (const ing of ingredients) {
      ings.push(`${ing.amount} ${ing.unit} ${ing.name}`);
    }
    return ings.join("\n");
  }
  //parse images data into urls
  static parseImages(recipeImages, multiple) {
    if (!recipeImages) return [];
    if (multiple) return recipeImages.map((img) => this.parseImage(img));
    return [this.parseImage(recipeImages[0])];
  }
  static parseImage(img) {
    if (!img) return null;
    if (img.contentType && img.data) return `data:image/${img.contentType};base64,${img.data.toString("base64")}`;
    if ("url" in img) return img.url ? img.url : null;
    return img;
  }

  static updateRatingNum(rating) {
    if (!rating.rating1) rating.rating1 = [];
    if (!rating.rating2) rating.rating2 = [];
    if (!rating.rating3) rating.rating3 = [];
    if (!rating.rating4) rating.rating4 = [];
    if (!rating.rating5) rating.rating5 = [];
    const total =
      rating.rating1.length + rating.rating2.length + rating.rating3.length + rating.rating4.length + rating.rating5.length;
    if (total == 0) return { avg: "0.00", total: 0, star: 0 };
    const avg =
      (rating.rating1.length * 1 +
        rating.rating2.length * 2 +
        rating.rating3.length * 3 +
        rating.rating4.length * 4 +
        rating.rating5.length * 5) /
      total;
    let star = 0;
    if (avg >= 1 && avg < 2) star = 1;
    else if (avg >= 2 && avg < 3) star = 2;
    else if (avg >= 3 && avg < 4) star = 3;
    else if (avg >= 4 && avg < 5) star = 4;
    else if (avg >= 5) star = 5;
    return { avg: avg.toFixed(2), total: total, star: star };
  }
  async reportFunc(userID) {
    if (!this.report.includes(userID)) {
      this.report.push(userID);

      try {
        await schemas.Recipe.updateOne({ _id: this.id }, { report: this.report });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
  async voteRating(userID, num) {
    //remove previous vote
    this.rating1 = this.rating1.filter((item) => item !== userID);

    this.rating2 = this.rating2.filter((x) => x !== userID);

    this.rating3 = this.rating3.filter((x) => x !== userID);

    this.rating4 = this.rating4.filter((x) => x !== userID);

    this.rating5 = this.rating5.filter((x) => x !== userID);

    //place in new vote
    if (num == 1) {
      this.rating1.push(userID);
    } else if (num == 2) {
      this.rating2.push(userID);
    } else if (num == 3) {
      this.rating3.push(userID);
    } else if (num == 4) {
      this.rating4.push(userID);
    } else if (num == 5) {
      this.rating5.push(userID);
    }
    this.userRating = num;
    const newRating = {
      rating1: this.rating1,
      rating2: this.rating2,
      rating3: this.rating3,
      rating4: this.rating4,
      rating5: this.rating5,
    };
    try {
      await schemas.Recipe.updateOne({ _id: this.id }, { fullRating: newRating });
      this.refreshRating(newRating);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  refreshRating(fullRating) {
    var rating = Recipe.updateRatingNum(fullRating);
    this.rating = {
      avg: rating.avg,
      total: rating.total,
      star: rating.star,
    };
    const parseFancy = (rating) => (rating.length / (this.rating.total || 1)) * 100;
    this.ratingFancy = [
      parseFancy(this.rating1),
      parseFancy(this.rating2),
      parseFancy(this.rating3),
      parseFancy(this.rating4),
      parseFancy(this.rating5),
    ];
  }
}
/*[ External access ]*/
module.exports = { Recipe };
