//[Import]
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { schemas } = require("../schemas/paths");
const { capitalize, offloadFields } = require("../utils");
const saltRounds = 10;
const roles = { junior: 1, expert: 2, admin: 3 };

//[advised nutrional daily]//
const nutAvgVals = {
  energy: { min: 1500, max: 3600 },
  fattyAcids: { min: 0.5, max: 13 },
  sodium: { min: 0.1, max: 2.3 },
  sugar: { min: 3, max: 36 },
  protein: { min: 0.8, max: 1.6 },
};
//[nutritional units]//
const nutUnits = ["energy", "fattyAcids", "sodium", "sugar", "protein"];
//[unit's format]//
const unitFormat = { energy: "Energy", fattyAcids: "Fatty acids", sodium: "Sodium", sugar: "Sugar", protein: "Protein" };

/*[ Handle base class database ]*/
class User {
  constructor(details, id) {
    if (details)
      offloadFields(
        ["id", "userName", "recipeImages", "email", "password", "passwordRep", "avatar", "role", "banned", "latest", "bookmarks"],
        this,
        details
      );
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

      let isAdmin = await schemas.AdminList.findOne({ email: this.email });
      let role = isAdmin ? roles.admin : roles.junior;

      await schemas.User.create({
        _id: mongoose.Types.ObjectId(),
        userName: this.userName,
        email: this.email,
        password: await bcrypt.hash(this.password, saltRounds),
        role: role,
        banned: false,
        latest: [],
        bookmarks: [],
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
      await schemas.User.updateOne({ _id: this.id }, { role: roles.expert });
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
      offloadFields(
        ["userName", "recipeImages", "email", "password", "avatar", "role", "banned", "latest", "bookmarks"],
        this,
        details
      );
      return true;
    }
    return false;
  }
  //verify account (userName&password) exists in database:
  async verify() {
    let account = await schemas.User.findOne({ userName: this.userName });
    if (!account) return { successful: false, message: "User not found" };
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
          latest: account.latest,
          bookmarks: account.bookmarks,
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
    let accounts = await schemas.User.find({ role: roles.junior });
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
    let accounts = await schemas.User.find({ role: roles.expert });
    return accounts || [];
  }
  //get all Junior&Expert Cook users from db
  static async fetchAllUsers() {
    let accounts = [...(await Junior.fetchUsers()), ...(await this.fetchUsers())];
    for await (const account of accounts) {
      const recipes = await schemas.Recipe.find({ userID: account.id });
      account.recipeCount = recipes.length;
    }
    return accounts.sort((a, b) => {
      if (a.userName < b.userName) return -1;
      if (a.userName > b.userName) return 1;
      return 0;
    });
  }
  //update latest recipes nutritional value
  async updateLatest(nutritions) {
    const today = new Date(Date.now());
    const dateIsToday = (recipe) => {
      const date = new Date(recipe.date);
      return date.getFullYear === today.getFullYear && date.getMonth === today.getMonth && date.getDate === today.getDate;
    };
    const filtered = this.latest.filter((recipe) => dateIsToday(recipe));
    nutritions.date = today;
    filtered.push(nutritions);
    try {
      await schemas.User.updateOne({ _id: this.id }, { latest: filtered });
      return true;
    } catch {
      return false;
    }
  }
  // find the warnings according to the latest searches
  checkWarnings() {
    const lowWarning = "Insufficient consumption of ";
    const highWarning = "Excessive consumption of ";
    let enter = "";
    let low = "",
      high = "",
      flagMin = true;

    if (this.latest.length < 3) {
      flagMin = false;
    }
    const nutAvg = this.calcNutSum();
    let index = 0;

    for (const unit of nutUnits) {
      if (flagMin && nutAvgVals[unit].min > nutAvg[index]) {
        if (low === "") {
          low += lowWarning;
        } else {
          low += ", ";
        }
        low += unitFormat[unit];
      }
      if (nutAvgVals[unit].max < nutAvg[index]) {
        if (high === "") {
          high += highWarning;
        } else {
          high += ", ";
        }
        high += unitFormat[unit];
      }
      index++;
    }
    if (low !== "" && high !== "") enter = " and ";
    return low + enter + high;
  }
  // calculate accumulative nutritional average value from the latest searches
  calcNutSum() {
    let nutSum = [0, 0, 0, 0, 0];
    for (const nutritions of this.latest) {
      nutSum = [
        (nutSum[0] += parseFloat(nutritions.energy)),
        (nutSum[1] += parseFloat(nutritions.fattyAcids)),
        (nutSum[2] += parseFloat(nutritions.sodium)),
        (nutSum[3] += parseFloat(nutritions.sugar)),
        (nutSum[4] += parseFloat(nutritions.protein)),
      ];
    }
    return nutSum;
  }

  async bookmark(recipe) {
    let filtered = this.bookmarks;
    filtered.push(recipe);
    return await this.updateBookmarks(filtered);
  }

  async unBookmark(recipe) {
    const filtered = this.bookmarks.filter((item) => item !== recipe);
    return await this.updateBookmarks(filtered);
  }

  async updateBookmarks(filtered) {
    try {
      await schemas.User.updateOne({ _id: this.id }, { bookmarks: filtered });
      return { success: true, bookmarks: filtered };
    } catch {
      return { success: false, bookmarks: this.bookmarks };
    }
  }
}
/*[ External access ]*/
module.exports = { User, Admin, Junior, Expert };
