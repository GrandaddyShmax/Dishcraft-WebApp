//[Import]
const { Schema, model } = require("mongoose"); //db 

module.exports = (schemas) => {
    const ingredients = new Schema({
      _id: Schema.Types.ObjectId,
      categoryName: String,
      ingredients: [String],
    });

//[Registers in database]
schemas.ingredients = model("Ingredients", ingredients, "ingredient");
};