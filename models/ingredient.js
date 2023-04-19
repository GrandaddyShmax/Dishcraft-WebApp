/*[ Import ]*/
const connection = require("../IngredAPI/connection");

//[units convertion to grams]//
const unitsTable = {
    "grams": 1,
    "cups": 201.6,
    "deciliters": 100,
    "galons": 3753.46,
    "kilograms": 1000,
    "liters": 1000,
    "mililiters": 1,
    "ounces": 28.34952,
    "pints": 403.2,
    "pounds": 453.5924,
    "quarts": 11339.80925,
    "tablespoon": 15,
    "teaspoon": 4.92892
};
  

//Ingredient class
class Ingredient {
    constructor(name, data) {
        this.name = name;
        this.healthLabels = data.healthLabels;
        this.calories = data.calories;
        this.totalWeight = data.totalWeight;
        this.energy = data.energy;
        this.fattyAcids = data.fattyAcids;
        this.sodium = data.sodium;
        this.sugar = data.sugar;
        this.protein = data.protein;
    }

    async printIngridient() {
        //console.log(this);
        //console.log();
    }

    static calcPerGrams(unit, amount) {
        return unitsTable[unit] * amount;
    }
}

/*[ External access ]*/
module.exports = { Ingredient };