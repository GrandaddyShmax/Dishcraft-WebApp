//[Import]
const { Schema, model } = require("mongoose"); //db 

module.exports = (schemas) => {
    const ingredient = new Schema({
      _id: Schema.Types.ObjectId,
      name: String,
      totalWeight: Number,
      energy: Number,
      fattyAcids: Number,
      sodium: Number,
      sugar: Number,
      protein: Number
    });

//[Registers in database]
schemas.Ingredient = model("Ingredient", ingredient, "ingredient");
};