/*[ Import ]*/
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");

//Suggestion obj
class Suggestion {
    constructor(tempV) {
      offloadFields(
        [
          "id",
          "suggestionName",
          "suggestionDescription",
        ],
        this,
        tempV
      );
    }
    async addSuggestion() {
      try {
        await schemas.Suggestion.create({
          _id: mongoose.Types.ObjectId(),
          suggestionName: this.suggestionName,
          suggestionDescription: this.suggestionDescription,
        });
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  

}