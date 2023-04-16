//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
  const recipeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userID: String,
    recipeName: String,
    recipeImages: [String],
    rating: Number,
    aiMade: Boolean,
    ingredients: String,
    instructions: String,
    badges: [String],
  });

  //[Registers in database]
  schemas.Recipe = model("Recipe", recipeSchema, "recipe");
};

