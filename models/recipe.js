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

//----------------------------------

/*[ Handle accounts database ]*/
class Example {
  constructor(details, payment) {
    this.id = details.id;
    this.username = details.username;
    this.password = details.password;
    this.IDnumber = payment ? payment.IDnumber : details.IDnumber;
    this.fullName = payment ? payment.fullName : details.fullName;
    this.cardNumber = payment ? payment.cardNumber : details.cardNumber;
  }

  /*[ Modify database ]*/
  //Modify single account in database:
  async modify() {
    try {
      await schemas.Example.updateOne(
        { _id: this.id },
        {
          IDnumber: this.IDnumber,
          fullName: this.fullName,
          cardNumber: this.cardNumber,
        }
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /*[ Handling data ]*/
  //Verify account (username&password) exists in database:
  async verify() {
    let account = await schemas.Example.findOne({
      username: this.username,
      password: this.password,
    });
    if (account)
      return {
        successful: true,
        user: {
          id: account.id,
          username: this.username,
          permissions: account.permissions,
          IDnumber: account.IDnumber,
          fullName: account.fullName,
          cardNumber: account.cardNumber,
        },
      }; //succeseful login
    return { successful: false, message: "text" }; //couldn't login
  }
  //Example static class, can be accessed without creating an object of the class
  static async staticFunc() {}
}

/*[ External access ]*/
module.exports = Example;
