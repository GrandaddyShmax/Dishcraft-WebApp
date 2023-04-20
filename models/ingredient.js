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
    constructor(data) {
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

    async printIngridient() {
        //console.log(this);
        //console.log();
    }

    static async calcRecipeNutVal(ingredArr) {
        var {energy = 0, fattyAcids = 0, sodium = 0, sugar = 0, protein = 0} = {};
        let calcPerGrams = (unit, amount) => unitsTable[unit] * amount;
        
        for (let ingred of ingredArr) {
            const ingredient = new Ingredient(await connection.getData(ingred.name));
            const valueByUnit = calcPerGrams(ingred.unit, ingred.amount);
            energy += (valueByUnit * ingredient.energy) / 1000;
            fattyAcids += (valueByUnit * ingredient.fattyAcids);
            sodium += (valueByUnit * ingredient.sodium);
            sugar += (valueByUnit * ingredient.sugar);
            protein += (valueByUnit * ingredient.protein);
        }
        return {energy: energy.toFixed(2), 
            fattyAcids: fattyAcids.toFixed(2),  
            sudium: sodium.toFixed(2), 
            sugar: sugar.toFixed(2), 
            protein: protein.toFixed(2)
        };
    }
}

/*[ External access ]*/
module.exports = { Ingredient };