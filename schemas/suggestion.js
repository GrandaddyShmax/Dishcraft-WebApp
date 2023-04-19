//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
    const suggestionSchema = new Schema({
      _id: Schema.Types.ObjectId,
      suggestionName: String,
      suggestionDescription: String,
    });
  
    //[Registers in database]
    schemas.Suggestion = model("Suggestion", suggestionSchema, "suggestion");
  };