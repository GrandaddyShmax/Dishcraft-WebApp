//[Import]
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { offloadFields } = require("../utils");

//Suggestion obj
class Suggestion {
  constructor(tempV) {
    offloadFields(["id", "suggestionName", "suggestionDescription"], this, tempV);
  }

  async addSuggestion() {
    try {
      await schemas.Suggestion.create({
        _id: mongoose.Types.ObjectId(),
        suggestionName: this.suggestionName,
        suggestionDescription: this.suggestionDescription,
      });
      //respond to unit test
      if (this.suggestionName == "uniTest") await schemas.Suggestion.deleteOne({ suggestionName: this.suggestionName });
      return { success: true, msg: null };
    } catch (error) {
      console.log(error);
      return { success: false, msg: "error in adding suggestion" };
    }
  }

  //get all the suggestions from db
  static async fetchAllSuggestions() {
    let suggestions = await schemas.Suggestion.find({});
    return suggestions || [];
  }

  //delete a suggestion
  static async deleteSuggestion(id) {
    try {
      await schemas.Suggestion.deleteOne({ _id: id });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

/*[ External access ]*/
module.exports = { Suggestion };
