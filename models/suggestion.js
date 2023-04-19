/*[ Import ]*/
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { offloadFields } = require("../utils");

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
        return {success: true, msg: null};
      } catch (error) {
        console.log(error);
        return {success: false, msg: "error in adding suggestion"};
      }
    }
  

}

/*[ External access ]*/
module.exports = {Suggestion};