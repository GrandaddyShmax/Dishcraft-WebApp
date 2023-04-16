/*[ Import ]*/
const schemas = require("../schemas/paths");

//Example class to show how classes work in NodeJS, this one checks for user login

/*[ Handle accounts database ]*/
class User {
  constructor(details) {
    this.id = details.id;
    this.userName = details.userName;
    this.email = details.email;
    this.password = details.password;
  }

  async register() {
    
  }

  /*[ Handling data ]*/
  //Verify account (userName&password) exists in database:
  async verify() {
    let account = await schemas.User.findOne({ userName: this.userName, password: this.password });
    if (account)
    {
        if(account.banned)
        {
            return { successful: false, message: "banned" };
        }
        return {
            successful: true,
            user: {
            id: account.id,
            userName: this.userName,
            role: account.role,
            },
        }; //succeseful login
    }
    return { successful: false, message: "not found" }; //couldn't login
  }
  //Example static class, can be accessed without creating an object of the class
  static async staticFunc() {
   
  }
}

class Admin extends User {
    constructor(details){
        super(details);
    }
}

class Junior extends User {
    constructor(details){
        super(details);
    }
}

class Expert extends User {
    constructor(details){
        super(details);
    }
}

/*[ External access ]*/
module.exports = {User, Admin, Junior, Expert};