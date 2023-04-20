//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
  const aiAccessSchema = new Schema({
    _id: Schema.Types.ObjectId,
    accessToken: String,
  });

  //[Registers in database]
  schemas.AIAccess = model("AIAccess", aiAccessSchema, "aiAccess");
};