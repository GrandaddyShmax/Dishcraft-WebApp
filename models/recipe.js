/*[ Import ]*/
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { Junior } = require("./user");
const { Category } = require("./category");
const { offloadFields } = require("../utils");

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
        rating: this.rating || 0,
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

  //get all/filtered recipes from db
  static async fetchRecipes(filter, sort) {
    let recipes = [];
    let recipesArr;
    if (filter) {
      //address filter
    } else recipesArr = await schemas.Recipe.find({});
    for await (const recipe of recipesArr) {
      const user = new Junior(null, recipe.userID);
      await user.fetchUser();
      var tempRecipe = offloadFields(
        ["id", "recipeName", "recipeImages", "rating", "aiMade", "ingredients", "instructions", "badges", "color", "uploadDate"],
        null,
        recipe
      );
      tempRecipe.user = user;
      if (filter) {
        //address additonal filter?
      }
      recipes.push(tempRecipe);
    }
    if (sort) {
      //address sort
    }
    return recipes || [];
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
