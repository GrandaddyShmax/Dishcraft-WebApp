//[Import]
const mongoose = require("mongoose");
const { schemas } = require("../schemas/paths");
const { capitalize, offloadFields, smartInclude } = require("../utils");
const defCategories = {
  spicy: false,
  sweet: false,
  salad: false,
  meat: false,
  soup: false,
  dairy: false,
  pastry: false,
  fish: false,
  grill: false,
};

class Category {
  constructor(details, id) {
    if (details) offloadFields(["id", "categoryName", "categoryType", "ingredients"], this, details);
    else this.id = id;
  }

  //find category for ingredients and return text or object
  static async findCategory(ingredients, type, text, lowerCase) {
    var alg = [];
    let categories;
    if (type) categories = await schemas.Category.find({ categoryType: type });
    else categories = await schemas.Category.find({});
    for (const ing of ingredients) {
      for (const category of categories) {
        let catIngs = category.ingredients;
        if (smartInclude(catIngs, ing.name, true)) {
          if (lowerCase) alg.push(category.categoryName.toLowerCase());
          else alg.push(category.categoryName);
        }
      }
    }
    alg = Array.from(new Set(alg)); //remove duplicates
    if (text) return alg.length > 0 ? alg.join(", ") + "." : "None.";
    return alg;
  }
  //find category/categories by name
  static async findCategoryByName(name, multiple) {
    if (multiple) return await schemas.Category.find({ categoryName: name });
    return await schemas.Category.findOne({ categoryName: name });
  }

  async addIngredToCategory(ingredient) {
    try {
      await this.fetchCategory();
      this.ingredients.push(ingredient);
      let details = await schemas.Category.findOne({ _id: this.id });
      if (details) await details.updateOne({ ingredients: this.ingredients }).catch(console.error);
      return true;
    } catch /* istanbul ignore next */ {
      return false;
    }
  }

  async deleteIngredFromCategory(index) {
    try {
      await this.fetchCategory();
      this.ingredients.splice(index, 1);
      let details = await schemas.Category.findOne({ _id: this.id });
      if (details) await details.updateOne({ ingredients: this.ingredients }).catch(console.error);
      return true;
    } catch /* istanbul ignore next */ {
      return false;
    }
  }

  //get all the categories from db
  static async fetchAllCategories() {
    let categories = await schemas.Category.find({});
    return categories || [];
  }

  //get all the categories from db
  static async fetchCategories(type, format) {
    let categories = await schemas.Category.find({ categoryType: type });
    if (!format) return categories || [];
    const filter = categories.map((cat) => {
      var n = cat.categoryName;
      var v = type == "allergy" ? `${n}-Free` : type == "diet" ? n.replace("Non-", "").replace("non-", "") : n;
      return { name: v, value: n };
    });
    return filter;
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

//[External access]
module.exports = { Category, defCategories };
