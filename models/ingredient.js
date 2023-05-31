//[Import]
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const connection = require("../API/ingred");
const { offloadFields } = require("../utils");

//[units convertion to grams]//
const unitsTable = {
  grams: 1,
  cups: 201.6,
  deciliters: 100,
  galons: 3753.46,
  kilograms: 1000,
  liters: 1000,
  mililiters: 1,
  ounces: 28.34952,
  pints: 403.2,
  pounds: 453.5924,
  quarts: 11339.80925,
  tablespoon: 15,
  teaspoon: 4.92892,
};

//Ingredient class
class Ingredient {
  constructor(data) {
    this.id = data._id;
    this.name = data.name;
    this.healthLabels = data.healthLabels;
    this.calories = data.calories;
    this.totalWeight = data.totalWeight;
    this.energy = data.energy;
    this.fattyAcids = data.fattyAcids;
    this.sodium = data.sodium;
    this.sugar = data.sugar;
    this.protein = data.protein;
  }

  static async checkIngredient(ingredient) {
    // check ingredient in the db
    if (await Ingredient.checkIngredientDB(ingredient)) {
      return true;
    }
    // check ingredient in the API
    if (await connection.checkIgredientAPI(ingredient)) {
      return true;
    }
    return false;
  }

  static async updateRecContainsIngred(ingredName, check) {
    let recipesArr = await schemas.Recipe.find({});
    for (const recipe of recipesArr) {
      for (const ingred of recipe.ingredients) {
        if (ingred.name === ingredName) {
          const nutritions = await Ingredient.calcRecipeNutVal(recipe.ingredients, check);
          let details = await schemas.Recipe.findOne({ _id: recipe._id });
          if (details) await details.updateOne({ nutritions: nutritions }).catch(console.error);
        }
      }
    }
  }

  static async calcRecipeNutVal(ingredArr, check) {
    var { energy = 0, fattyAcids = 0, sodium = 0, sugar = 0, protein = 0 } = {};

    for (let ingred of ingredArr) {
      if (check && !(await Ingredient.checkIngredient(ingred.name))) continue;
      let ingredient = await Ingredient.fetchIngredient(ingred.name);

      if (!ingredient) {
        ingredient = new Ingredient(await connection.getData(ingred.name));
      }
      const unit = ingred.unit.toLowerCase();
      const amount = parseFloat(ingred.amount);
      let valueByUnit;

      if (unit === "pieces") {
        valueByUnit = ingredient.totalWeight;
      } else {
        valueByUnit = unitsTable[unit];
      }
      const calcByUnitAndAmount = (valueByUnit / ingredient.totalWeight) * amount;
      energy += ingredient.energy * calcByUnitAndAmount;
      fattyAcids += ingredient.fattyAcids * calcByUnitAndAmount;
      sodium += ingredient.sodium * calcByUnitAndAmount;
      sugar += ingredient.sugar * calcByUnitAndAmount;
      protein += ingredient.protein * calcByUnitAndAmount;
    } return {
      energy: energy.toFixed(2),
      fattyAcids: fattyAcids.toFixed(2),
      sodium: sodium.toFixed(2),
      sugar: sugar.toFixed(2),
      protein: protein.toFixed(2),
    };
  }

  //get all the ingredients from db
  static async fetchAllIngredients() {
    let ingredients = await schemas.Ingredient.find({});
    return ingredients || [];
  }

  //fetch ingredient from db
  static async fetchIngredient(inputName) {
    let details = await schemas.Ingredient.findOne({ name: inputName });
    if (details) {
      return new Ingredient(details);
    }
    return null;
  }

  static async checkIngredientDB(inputName) {
    let details = await schemas.Ingredient.findOne({ name: inputName });
    if (details) {
      return true;
    }
    return false;
  }

  async addIngredient() {
    try {
      let details = await schemas.Ingredient.create({
        _id: mongoose.Types.ObjectId(),
        name: this.name,
        totalWeight: this.totalWeight,
        energy: this.energy,
        fattyAcids: this.fattyAcids,
        sodium: this.sodium,
        sugar: this.sugar,
        protein: this.protein,
      });
      this.id = details.id;
      //respond to unit test
      if (this.name == "uniTest") await this.deleteIngredient();
      return { success: true, msg: null };
    } catch (error) /* istanbul ignore next */ {
      console.log(error);
      return { success: false, msg: "error in adding ingredient" };
    }
  }

  async updateIngredient(update) {
    try {
      let details = await schemas.Ingredient.findOne({ _id: this.id });
      if (details)
        await details.updateOne(
          { _id: this.id },
          {
            name: update.name,
            energy: update.energy,
            fattyAcids: update.fattyAcids,
            sodium: update.sodium,
            sugar: update.sugar,
            protein: update.protein,
            totalWeight: update.totalWeight,
          }
        );
      return true;
    } catch /* istanbul ignore next */ {
      return false;
    }
  }

  async deleteIngredient() {
    let details = await schemas.Ingredient.findOne({ _id: this.id });
    if (details) {
      await details.delete().catch(console.error);
      return true;
    }
    return false;
  }
}

//[External access]
module.exports = { Ingredient };
