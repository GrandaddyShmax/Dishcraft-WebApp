//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
  const adminSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: String,
  });

  //[Registers in database]
  schemas.AdminList = model("AdminList", adminSchema, "adminList");
};