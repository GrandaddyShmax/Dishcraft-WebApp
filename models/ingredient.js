/*[ Import ]*/
const connection = require("../IngredAPI/connection");

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
        console.log(this);
    }
}

/*[ External access ]*/
module.exports = { Ingredient };