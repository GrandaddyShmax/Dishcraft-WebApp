//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
  const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: String,
    email: String,
    password: String,
    avatar: String,
    role: Number,
    banned: Boolean,
  });

  //[Registers in database]
  schemas.User = model("User", userSchema, "user");
};