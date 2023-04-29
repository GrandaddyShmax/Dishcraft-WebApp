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
    this._id = data._id;
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

  static async calcRecipeNutVal(ingredArr, check) {
    var { energy = 0, fattyAcids = 0, sodium = 0, sugar = 0, protein = 0 } = {};
    let calcPerGrams = (unit, amount) => unitsTable[unit] * amount;

    for (let ingred of ingredArr) {
      if (check && !(await connection.checkIgredient(ingred.name))) continue;
      const ingredient = new Ingredient(await connection.getData(ingred.name));
      const unit = ingred.unit.toLowerCase();
      const amount = parseFloat(ingred.amount);
      let valueByUnit;

      if (unit === "pieces") {
        valueByUnit = ingredient.totalWeight * amount;
      } else {
        valueByUnit = calcPerGrams(ingred.unit.toLowerCase(), parseFloat(ingred.amount));
      }
      energy += (valueByUnit * ingredient.energy) / 1000;
      fattyAcids += (valueByUnit * ingredient.fattyAcids) / 1000;
      sodium += (valueByUnit * ingredient.sodium) / 1000;
      sugar += (valueByUnit * ingredient.sugar) / 1000;
      protein += (valueByUnit * ingredient.protein) / 1000;
    }
    return {
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

  async addIngredient() {
    try {
      await schemas.Ingredient.create({
        _id: mongoose.Types.ObjectId(),
        name: this.name,
        totalWeight: this.totalWeight,
        energy: this.energy,
        fattyAcids: this.fattyAcids,
        sodium: this.sodium,
        sugar: this.sugar,
        protein: this.protein
      });
      return { success: true, msg: null };
    } catch (error) {
      console.log(error);
      return { success: false, msg: "error in adding ingredient" };
    }
  }

  async updateIngredient(update) {
    try {
      await schemas.Ingredient.updateOne({ _id: this._id }, 
        {
          name: update.name, 
          energy: update.energy,
          fattyAcids: update.fattyAcids,
          sodium: update.sodium,
          sugar: update.sugar,
          protein: update.protein,
          totalWeight: update.totalWeight
        });
      return true;
    } catch {
      return false;
    }
  }

  async deleteIngredient() {
    try {
      await schemas.Ingredient.deleteOne({ _id: this._id });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

/*[ External access ]*/
module.exports = { Ingredient };
