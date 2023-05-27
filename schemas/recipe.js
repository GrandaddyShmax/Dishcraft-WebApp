//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
  const recipeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userID: String,
    recipeName: String,
    recipeImages: [{ data: Buffer, contentType: String, url: String }],
    rating: Number,
    fullRating: {
      rating1: [String],
      rating2: [String],
      rating3: [String],
      rating4: [String],
      rating5: [String],
    },
    report: [String],
    aiMade: Boolean,
    display: Boolean,
    ingredients: [{ amount: Number, unit: String, name: String }],
    instructions: String,
    color: String,
    uploadDate: Date,
    nutritions: { energy: Number, fattyAcids: Number, sodium: Number, sugar: Number, protein: Number },
    categories: { spicy: Boolean, sweet: Boolean, salad: Boolean, meat: Boolean, soup: Boolean, dairy: Boolean, 
                  pastry: Boolean, fish: Boolean, grill: Boolean },
    badgesUsers: [String],
    badgesCount: [Number],
    hideRating: Boolean
  });

  //[Registers in database]
  schemas.Recipe = model("Recipe", recipeSchema, "recipe");
};
