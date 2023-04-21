//[Import]
const { Schema, model } = require("mongoose"); //db 

module.exports = (schemas) => {
    const category = new Schema({
      _id: Schema.Types.ObjectId,
      categoryName: String,
      categoryType: String,
      ingredient: [String],
    });

//[Registers in database]
schemas.Category = model("Category", category, "category");
};