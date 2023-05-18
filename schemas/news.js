//[Import]
const { Schema, model } = require("mongoose"); //db 

module.exports = (schemas) => {
    const news = new Schema({
      _id: Schema.Types.ObjectId,
      userId: String,
      title: String,
      description: String
    });

//[Registers in database]
schemas.News = model("News", news, "news");
};