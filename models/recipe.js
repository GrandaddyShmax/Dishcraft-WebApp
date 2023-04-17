/*[ Import ]*/
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { Junior } = require("./user");

//Recipe class
class Recipe {
  constructor(tempV) {
    this.id = tempV.id;
    this.userID = tempV.userID;
    this.recipeName = tempV.recipeName;
    this.recipeImages = tempV.recipeImages;
    this.rating = tempV.rating;
    this.aiMade = tempV.aiMade;
    this.ingredients = tempV.ingredients;
    this.instructions = tempV.instructions;
    this.badge = tempV.badge;
    this.color = tempV.color;
  }

  //adds a recipe to the recipes schema
  async addRecipe() {
    try {
      await schemas.Recipe.create({
        _id: mongoose.Types.ObjectId(),
        userID: this.userID,
        recipeName: this.recipeName,
        recipeImages: this.recipeImages,
        rating: this.rating,
        aiMade: this.aiMade,
        ingredients: this.ingredients,
        instructions: this.instructions,
        badges: this.badge,
        color: this.color,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  //deletes a recipe by its id
  async delRecipe() {
    try {
      await schemas.Recipe.deleteOne({ id: this.id });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /*[ Handling data ]*/
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
      const tempRecipe = {
        user: user,
        recipeName: recipe.recipeName,
        recipeImages: recipe.recipeImages,
        rating: recipe.rating,
        aiMade: recipe.aiMade,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        badges: recipe.badge,
        color: recipe.color,
      };
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
}

/*[ External access ]*/
module.exports = { Recipe };
