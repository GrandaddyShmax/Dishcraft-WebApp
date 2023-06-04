//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
//[Classes]
const { User, Admin, Junior, Expert } = require("../../models/user");
const { Recipe } = require("../../models/recipe");
const { Suggestion } = require("../../models/suggestion");
const { Category } = require("../../models/category");
const { Ingredient } = require("../../models/ingredient");
const { News } = require("../../models/news");
//[Variables]
const testLabel = chalk.red("[Test]");
const { testRecipeID, testUserID, testBannedUserID } = require("../../jsons/tests.json");
let mockUser;
let testUser;
let testExpert;
let mockRecipe;
let testCat;
let testIng;
let items;

describe(testLabel + " Model functions:", function () {
  describe(" Checking user.js...", function () {
    this.timeout(10000);
    it("register - handling errors correctly", async () => {
      //invalid username
      mockUser = new User({ userName: "No User", email: "", password: "", passwordRep: "" });
      let response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "username");
      mockUser = new User({ userName: "u", email: "", password: "", passwordRep: "" });
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "username");
      //invalid email
      mockUser = new User({ userName: "uniTest", email: "nouser@gmail.com", password: "", passwordRep: "" });
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "email");
      //invalid password
      mockUser = new User({ userName: "uniTest", email: "unit@gmail.com", password: "1", passwordRep: "1" });
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "password");
      mockUser = new User({ userName: "uniTest", email: "unit@gmail.com", password: "000000", passwordRep: "111111" });
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "password");
      //mock valid registeration (doesn't actually save in DB)
      mockUser = new User({ userName: "uniTest", email: "unit@gmail.com", password: "000000", passwordRep: "000000" });
      response = await mockUser.register();
      assert.equal(response.successful, true);
      assert.equal(response.message, "success");
    });
    it("upgrade - upgrades Junior cook to Expert", async () => {
      mockUser = new Junior(mockUser);
      let response = await mockUser.upgradeUser();
      assert.equal(response, true);
    });
    it("fetchUser - Fill information about user", async () => {
      testUser = new User(null, testUserID);
      let response = await testUser.fetchUser();
      assert.equal(response, true);
      assert.notEqual(testUser.userName, undefined);
    });
    it("verify - check valid login information", async () => {
      //incorrect login
      await mockUser.fetchUser();
      let response = await mockUser.verify();
      assert.equal(response.successful, false);
      //banned user
      mockUser = new User(null, testBannedUserID);
      mockUser.fetchUser();
      response = await mockUser.verify();
      assert.equal(response.successful, false);
      //correct login
      testUser = new User({ userName: "No User", password: "123456" });
      response = await testUser.verify();
      assert.equal(response.successful, true);
    });

    it("fetchUsers - get all Admin users", async () => {
      items = await Admin.fetchUsers();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("fetchUsers - get all Junior users", async () => {
      items = await Junior.fetchUsers();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("fetchUsers - get all Expert users", async () => {
      items = await Expert.fetchUsers();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("fetchAllUsers - get all users", async () => {
      items = await User.fetchAllUsers();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("bookmark - bookmark a recipe", async () => {
      testExpert = new Expert(testUser);
      await testExpert.fetchUser();
      let response = await testExpert.bookmark(testRecipeID);
      assert.equal(response.success, true);
    });
    it("unBookmark - remove recipe bookmark", async () => {
      let response = await testExpert.unBookmark(testRecipeID);
      assert.equal(response.success, true);
    });
    it("checkWarnings - check nutritional warnings", () => {
      let warnings = testExpert.checkWarnings();
      assert.notEqual(warnings, undefined);
    });
  });
  describe(" Checking recipe.js...", function () {
    this.timeout(20000);
    it("addRecipes - create new recipe", async () => {
      mockRecipe = new Recipe({ recipeName: "uniTest", instructions: "temp", display: false });
      let result = await mockRecipe.addRecipe();
      assert.equal(result.success, true);
    });
    it("fetchRecipe - Fill information about recipe", async () => {
      mockRecipe = new Recipe(null, testRecipeID);
      let response = await mockRecipe.fetchRecipe(testUserID);
      assert.equal(response, true);
      assert.notEqual(mockRecipe.recipeName, undefined);
    });
    it("fetchRecipes - get all recipes", async () => {
      items = await Recipe.fetchRecipes(null, [testRecipeID]);
      assert(Array.isArray(items));
      items = await Recipe.fetchRecipes(null, null, testUserID, true);
      assert(Array.isArray(items));
      items = await Recipe.fetchRecipes(null, null, testUserID, false);
      assert(Array.isArray(items));
      let search = {
        term: "",
        filter: ["Tree nuts"],
        filterRange: "year",
        sort: { category: "energy", dir: "descend" },
      };
      items = await Recipe.fetchRecipes(search);
      assert(Array.isArray(items));
    });
    it("checkSort - sort recipes", async () => {
      items = Recipe.checkSort(null, items);
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
      items = Recipe.checkSort({ category: "now" }, items);
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
      items = Recipe.checkSort({ category: "top" }, items);
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("checkFilterRange - check recipe time range", async () => {
      const date = new Date();
      let result = Recipe.checkFilterRange("today", mockRecipe, date);
      assert.equal(result, false);
      result = Recipe.checkFilterRange("week", mockRecipe, date);
      assert.equal(result, false);
      result = Recipe.checkFilterRange("month", mockRecipe, date);
      assert.equal(result, false);
      result = Recipe.checkFilterRange("year", mockRecipe, date);
      assert.equal(result, false);
      result = Recipe.checkFilterRange("", mockRecipe, date);
      assert.equal(result, true);
    });
    it("reportFunc - report a recipe", async () => {
      let result = await mockRecipe.reportFunc(testUserID);
      assert.equal(result, true);
    });
    it("voteRating - rate a recipe", async () => {
      let result = await mockRecipe.voteRating(testUserID, 1);
      assert.equal(result, true);
      result = await mockRecipe.voteRating(testUserID, 2);
      assert.equal(result, true);
      result = await mockRecipe.voteRating(testUserID, 3);
      assert.equal(result, true);
      result = await mockRecipe.voteRating(testUserID, 4);
      assert.equal(result, true);
      result = await mockRecipe.voteRating(testUserID, 5);
      assert.equal(result, true);
    });
    it("addBadgeToRecipe - add a badge to recipe", async () => {
      let result = await mockRecipe.addBadgeToRecipe(testUserID, 1);
      assert.equal(result, true);
      result = await mockRecipe.addBadgeToRecipe(testUserID, 1);
      assert.equal(result, false);
    });
  });
  describe(" Checking category.js...", function () {
    this.timeout(10000);
    it("findCategory - get categories of ingredients", async () => {
      const ingredients = [{ name: "milk" }, { name: "pasta" }, { name: "eggs" }];
      let cat = await Category.findCategory(ingredients, "allergy", true, true);
      assert(cat);
    });
    it("findCategoryByName - get category by its name", async () => {
      testCat = await Category.findCategoryByName("Gluten");
      assert.notEqual(testCat.categoryName, undefined);
    });
    it("addIngredToCategory - add ingredient to category", async () => {
      testCat = new Category(testCat);
      await testCat.fetchCategory();
      let result = await testCat.addIngredToCategory("test");
      assert.equal(result, true);
    });
    it("deleteIngredFromCategory - remove ingredient from category", async () => {
      let result = await testCat.deleteIngredFromCategory(testCat.ingredients.length - 1);
      assert.equal(result, true);
    });
    it("fetchAllCategories - get all categories", async () => {
      items = await Category.fetchAllCategories();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("fetchCategories - get categories for filter", async () => {
      items = await Category.fetchCategories("allergy", true);
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
  });
  describe(" Checking ingredient.js...", function () {
    this.timeout(10000);
    it("fetchAllIngredients - get all saved ingredients", async () => {
      items = await Ingredient.fetchAllIngredients();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
    it("fetchIngredient - get ingredient by name", async () => {
      testIng = await Ingredient.fetchIngredient("orange+");
      assert.equal(testIng, null);
      testIng = await Ingredient.fetchIngredient("Orange+");
      assert(testIng);
    });
    it("checkIngredient - check if ingredient is in or API", async () => {
      let result = await Ingredient.checkIngredient("Orange+");
      assert.equal(result, true);
      result = await Ingredient.checkIngredient("orange+");
      assert.equal(result, true);
      result = await Ingredient.checkIngredient("test");
      assert.equal(result, false);
    });

    it("calcRecipeNutVal - calculate nutritional value", async () => {
      const ing = [{ amount: "0.1", unit: "Cups", name: "milk" }];
      let result = await Ingredient.calcRecipeNutVal(ing);
      assert(result);
    });

    it("checkIngredientDB - check ingredient is in DB", async () => {
      let result = await Ingredient.checkIngredientDB("Orange+");
      assert.equal(result, true);
      result = await Ingredient.checkIngredientDB("orange+");
      assert.equal(result, false);
    });
    it("addIngredient - add new ingredient", async () => {
      testIng = new Ingredient({ name: "uniTest" });
      let result = await testIng.addIngredient({ name: "uniTest" });
      assert.equal(result.success, true);
    });
    it("updateIngredient - update ingredient's data", async () => {
      let result = await testIng.updateIngredient({
        name: "uniTest",
        energy: 0,
        fattyAcids: 0,
        sodium: 0,
        sugar: 0,
        protein: 0,
        totalWeight: 0,
      });
      assert.equal(result, true);
    });
  });
  describe(" Checking suggestion.js...", function () {
    this.timeout(10000);
    it("addSuggestion - create new suggestion", async () => {
      let mockSuggest = new Suggestion({ suggestionName: "uniTest" });
      let result = await mockSuggest.addSuggestion();
      assert.equal(result.success, true);
    });
    it("fetchAllSuggestions - get all suggestions", async () => {
      items = await Suggestion.fetchAllSuggestions();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
  });
  describe(" Checking news.js...", function () {
    this.timeout(10000);
    it("addNews - create new news", async () => {
      let mockNews = new News({ userId: testUserID, title: "uniTest", description: "test only" });
      let result = await mockNews.addNews();
      assert.equal(result.success, true);
    });
    it("fetchAllNews - get all news", async () => {
      items = await News.fetchAllNews();
      assert(Array.isArray(items));
    });
  });
  after(() => console.log("  " + testLabel + " Done model tests."));
});
