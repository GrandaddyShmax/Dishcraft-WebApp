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
      let details = await schemas.Suggestion.create({
        _id: mongoose.Types.ObjectId(),
        suggestionName: this.suggestionName,
        suggestionDescription: this.suggestionDescription,
      });
      this.id = details.id;
      //respond to unit test
      if (this.suggestionName == "uniTest") await Suggestion.deleteSuggestion(this.id);
      return { success: true, msg: null };
    } catch (error) /* istanbul ignore next */ {
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
    let details = await schemas.Suggestion.findOne({ _id: id });
    if (details) {
      await details.delete().catch(console.error);
      return true;
    }
    return false;
  }
}

//[External access]
module.exports = { Suggestion };
