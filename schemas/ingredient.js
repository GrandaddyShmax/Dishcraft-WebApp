//[Import]
const { Schema, model } = require("mongoose"); //db 

module.exports = (schemas) => {
    const category = new Schema({
      _id: Schema.Types.ObjectId,
      categoryName: String,
      ingredient: [String],
    });

//[Registers in database]
schemas.ingredients = model("Category", category, "category");
};