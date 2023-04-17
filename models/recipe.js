/*[ Import ]*/
const schemas = require("../schemas/paths");
const mongoose = require("mongoose");

//Example class to show how classes work in NodeJS, this one checks for user login

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
    this.color=tempV.color;
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
        color:this.color,
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
}

/*[ External access ]*/
module.exports = Recipe;
