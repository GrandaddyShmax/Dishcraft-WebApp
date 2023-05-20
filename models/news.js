//[Import]
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { capitalize, offloadFields } = require("../utils");
const { User } = require("./user");

class News {
    constructor(details, id) {
      if (details) {
        offloadFields(["id", "userId", "title", "description"], this, details);
      }
      else this.id = id;
    }

    async addNews() {
        try {
          let details = await schemas.News.create({
            _id: mongoose.Types.ObjectId(),
            userId: this.userId,
            title: this.title,
            description: this.description
          });
          this.id = details.id;
          return { success: true, msg: null };
        } catch (error) {
            console.log(error);
            return { success: false, msg: "error in adding news" };
        }
    }

    async deleteNews() {
        let details = await schemas.News.findOne({ _id: this.id });
        if (details) {
            await details.delete().catch(console.error);
            return true;
        }
        return false;
    }

    //get all the categories from db
    static async fetchAllNews() {
        let oldNews = await schemas.News.find({}), news = [];
        for (const item of oldNews) {
            const user = new User(null, item.userId);
            await user.fetchUser();
            item.user = user;
            news.unshift(item);
        }
        return news || [];
    }
}

/*[ External access ]*/
module.exports = { News };