/*[ Import ]*/
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { schemas } = require("../schemas/paths");
const { capitalize, offloadFields } = require("../utils");
const saltRounds = 10;

/*[ Handle base class database ]*/
class User {
  constructor(details, id) {
    this.id = details ? details.id : id;
    this.userName = details ? details.userName : null;
    this.email = details ? details.email : null;
    this.password = details ? details.password : null;
    this.passwordRep = details ? details.passwordRep : null;
    this.avatar = details ? details.avatar : null;
    this.role = details ? details.role : null;
    if (details)
      offloadFields(["id", "userName", "recipeImages", "email", "password", "passwordRep", "avatar", "role", "banned"], this, details);
    else this.id = id;
  }

  /*[ Creating data ]*/
  async register() {
    try {
      //check username validity
      let account = await schemas.User.findOne({ userName: this.userName });
      if (account) return { successful: false, error: "username", message: "This username is already in use" };
      if (this.userName.length < 3) return { successful: false, error: "username", message: "Username too short" };

      //check email validity
      account = await schemas.User.findOne({ email: this.email });
      if (account) return { successful: false, error: "email", message: "This mail is already in use" };
      
      //check password validity
      if (this.password.length < 6) return { successful: false, error: "password", message: "Password too short" };
      if (this.password !== this.passwordRep) return { successful: false, error: "password", message: "Passwords don't match" };

      let role = "junior";
      let isAdmin = await schemas.AdminList.findOne({ email: this.email });
      if(isAdmin) role = "admin";

      await schemas.User.create({
        _id: mongoose.Types.ObjectId(),
        userName: this.userName,
        email: this.email,
        password: await bcrypt.hash(this.password, saltRounds),
        role: role,
        banned: false,
      });
      return { successful: true, message: "success" };
    } catch (
      verror // "var + error = verror"
    ) {
      console.log(verror);
      return { successful: false, message: "error" };
    }
  }

  /*[ Modifying data ]*/
  async upgradeUser() {
    try {
      //await schemas.User.updateOne({ userName: this.userName }, { role: "expert" });
      await schemas.User.updateOne({ _id: this.id }, { role: "expert" });
      return true;
    } catch {
      return false;
    }
  }

  /*[ Handling data ]*/
  //fetch user from db
  async fetchUser() {
    let details = await schemas.User.findOne({ _id: this.id });
    if (details) {
      if (details) offloadFields(["userName", "recipeImages", "email", "password", "avatar", "role", "banned"], this, details);
      /*this.id = details.id;
      this.userName = details.userName;
      this.email = details.email;
      this.password = details.password;
      this.avatar = details.avatar;
      this.role = details.role;*/
      return true;
    }
    return false;
  }
  //verify account (userName&password) exists in database:
  async verify() {
    let account = await schemas.User.findOne({ userName: this.userName });
    let result = await bcrypt.compare(this.password, account.password);
      
    if (result) {
      if (account.banned) return { successful: false, message: "User is banned" };
      return {
        successful: true,
        user: {
          id: account.id,
          userName: this.userName,
          avatar: this.avatar,
          role: account.role,
        },
      }; //succeseful login
    }
    return { successful: false, message: "User not found" }; //couldn't login
  }
}

/*[ Handle Admin class database ]*/
class Admin extends User {
  constructor(details, id) {
    super(details, id);
  }
}

/*[ Handle Junior class database ]*/
class Junior extends User {
  constructor(details, id) {
    super(details, id);
  }
  //get all Junior Cook users from db
  static async fetchUsers() {
    let accounts = await schemas.User.find({ role: "junior" });
    return accounts || [];
  }
}

/*[ Handle Expert class database ]*/
class Expert extends User {
  constructor(details, id) {
    super(details, id);
  }
  //get all Expert Cook users from db
  static async fetchUsers() {
    let accounts = await schemas.User.find({ role: "expert" });
    return accounts || [];
  }
  //get all Junior&Expert Cook users from db
  static async fetchAllUsers(pretty) {
    let accounts = [...(await Junior.fetchUsers()), ...(await this.fetchUsers())];
    if (pretty) accounts.forEach((user) => (user.role = capitalize(user.role)));
    return accounts.sort((a, b) => {
      if (a.userName < b.userName) return -1;
      if (a.userName > b.userName) return 1;
      return 0;
    });
  }
}

/*[ External access ]*/
module.exports = { User, Admin, Junior, Expert };
