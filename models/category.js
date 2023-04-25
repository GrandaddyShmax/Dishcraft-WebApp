//[Import]
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { capitalize, offloadFields } = require("../utils");

class Category {
  constructor(details, id) {
    if (details) offloadFields(["id", "categoryName", "categoryType", "ingredients"], this, details);
    else this.id = id;
  }

  //find category for ingredients and return text or object
  static async findCategory(ingredients, type, text) {
    var alg = [];
    for (const ing of ingredients) {
      let categories = await schemas.Category.find({ ingredients: ing.name.toLowerCase(), categoryType: type });
      if (categories && categories.length > 0) for (const category of categories) alg.push(category.categoryName);
    }
    if (text) return alg.length > 0 ? alg.join(", ") + "." : "None.";
    return alg;
  }

  async addIngredToCategory(ingredient) {
    try {
      await this.fetchCategory();
      this.ingredients.push(ingredient);
      await schemas.Category.updateOne({ _id: this.id }, { ingredients: this.ingredients });
      return true;
    } catch {
      return false;
    }
  }

  async deleteIngredFromCategory(index) {
    try {
      await this.fetchCategory();
      this.ingredients.splice(index, 1);
      await schemas.Category.updateOne({ _id: this.id }, { ingredients: this.ingredients });
      return true;
    } catch {
      return false;
    }
  }

  //get all the categories from db
  static async fetchAllCategories() {
    let categories = await schemas.Category.find({});
    return categories || [];
  }

  //fetch category from db
  async fetchCategory() {
    let details = await schemas.Category.findOne({ _id: this.id });
    if (details) {
      offloadFields(["id", "categoryName", "categoryType", "ingredients"], this, details);
      return true;
    }
    return false;
  }

  //check if the ingredient exist in this category
  checkIngredInCategory(ingredient) {
    if (this.ingredients.includes(ingredient.toLowerCase())) {
      return true;
    }
    return false;
  }
}

/*[ External access ]*/
module.exports = { Category };
