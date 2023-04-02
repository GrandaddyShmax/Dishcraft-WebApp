//[Import]
const { Schema, model } = require("mongoose"); //database access

//[Template for storing data in database]
module.exports = (schemas) => {
  const exampleSchema = new Schema({
    _id: Schema.Types.ObjectId,
    stringField: String,
    numberField: Number,
    booleanField: Boolean,
    dateField: Date,
    //etc...
    notRequiredStringField: { type: String, required: false },
  });

  //[Registers in database]
  schemas.Example = model("Example", exampleSchema, "example");
};
