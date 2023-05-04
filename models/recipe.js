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
          "recipeName",
          "recipeImages",
          "rating",
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
        rating: this.rating,
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
  //fetch recipe from db
  async fetchRecipe() {
    let details = await schemas.Recipe.findOne({ _id: this.id });
    const user = new Junior(null, details.userID);
    await user.fetchUser();
    this.user = user;
    if (details) {
      offloadFields(
        ["recipeName", "recipeImages", "rating", "aiMade", "instructions", "badges", "color", "uploadDate", "nutritions"],
        this,
        details
      );
      this.ingredients = Recipe.parseIngredients(details.ingredients);
      this.allergies = await Category.findCategory(details.ingredients, "allergy", true);
      return true;
    }
    return false;
  }

  //get a specific array of recipes by ids array
  static async fetchRecipesFromArray(array) {
    let result = await schemas.Recipe.find({ _id: { $in: array } });
    for (const recipe of result) {
      const user = new Junior(null, recipe.userID);
      recipe.user = await user.fetchUser();
    }
    return result;
  }

  //get all/filtered recipes from db
  static async fetchRecipes(search) {
    var term, filter, sort;
    if (search) ({ term, filter, sort } = search);
    if (filter) filter = await this.fetchFilter(filter);
    let recipes = [];
    let recipesArr = await schemas.Recipe.find({});
    for await (const recipe of recipesArr) {
      const user = new Junior(null, recipe.userID);
      await user.fetchUser();
      //search term:
      if (this.checkTerm(term, recipe, user)) continue;
      var tempRecipe = offloadFields(
        [
          "id",
          "recipeName",
          "recipeImages",
          "rating",
          "aiMade",
          "ingredients",
          "instructions",
          "badges",
          "color",
          "uploadDate",
          "nutritions",
        ],
        null,
        recipe
      );
      tempRecipe.user = user;
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
      let result = filter.includes(name) || filter.includes(name + "s");
      if (result) return true;
    }
    return false;
  }
  //sort by nutritional value:
  static checkSort(sort, recipes) {
    if (!sort) return recipes;
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
}

/*[ External access ]*/
module.exports = { Recipe };
