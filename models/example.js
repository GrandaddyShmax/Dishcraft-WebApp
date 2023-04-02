/*[ Import ]*/
const schemas = require("../schemas/paths");

//Example class to show how classes work in NodeJS, this one checks for user login

/*[ Handle accounts database ]*/
class Example {
  constructor(details, payment) {
    this.id = details.id;
    this.username = details.username;
    this.password = details.password;
    this.IDnumber = payment ? payment.IDnumber : details.IDnumber;
    this.fullName = payment ? payment.fullName : details.fullName;
    this.cardNumber = payment ? payment.cardNumber : details.cardNumber;
  }

  /*[ Modify database ]*/
  //Modify single account in database:
  async modify() {
    try {
      await schemas.Example.updateOne(
        { _id: this.id },
        { IDnumber: this.IDnumber, fullName: this.fullName, cardNumber: this.cardNumber }
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /*[ Handling data ]*/
  //Verify account (username&password) exists in database:
  async verify() {
    let account = await schemas.Example.findOne({ username: this.username, password: this.password });
    if (account)
      return {
        successful: true,
        user: {
          id: account.id,
          username: this.username,
          permissions: account.permissions,
          IDnumber: account.IDnumber,
          fullName: account.fullName,
          cardNumber: account.cardNumber,
        },
      }; //succeseful login
    return { successful: false, message: "text" }; //couldn't login
  }
  //Example static class, can be accessed without creating an object of the class
  static async staticFunc() {
   
  }
}

/*[ External access ]*/
module.exports = Example;
