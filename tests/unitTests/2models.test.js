//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
const { User, Admin, Junior, Expert } = require("../../models/user");
const { Recipe } = require("../../models/recipe");
const { Suggestion } = require("../../models/suggestion");
const { Category } = require("../../models/category");
const { Ingredient } = require("../../models/ingredient");
const testLabel = chalk.red("[Test]");
const mockUserName = { userName: "No User", email: "", password: "", passwordRep: "" };
const mockUserName2 = { userName: "u", email: "", password: "", passwordRep: "" };
const mockUserEmail = { userName: "uniTest", email: "nouser@gmail.com", password: "", passwordRep: "" };
const mockUserPass = { userName: "uniTest", email: "unit@gmail.com", password: "1", passwordRep: "1" };
const mockUserPass2 = { userName: "uniTest", email: "unit@gmail.com", password: "000000", passwordRep: "111111" };
const mockUserValid = { userName: "uniTest", email: "unit@gmail.com", password: "000000", passwordRep: "000000" };
const mockRecipeInfo = { recipeName: "uniTest", instructions: "temp", display: false };
const mockIngInfo = { name: "uniTest" };
const mockIngInfo2 = { name: "uniTest", energy: 0, fattyAcids: 0, sodium: 0, sugar: 0, protein: 0, totalWeight: 0 };
const mockSuggestInfo = { suggestionName: "uniTest" };
let mockUser;
let testUser;
let testExpert;
let mockRecipe;
let testCat;
let testIng;
let mockSuggest;
let items;
const testUserID = "6441a06e827a79b1666eb356";
const testBannedUserID = "646605e4d96084bc90cca22c";
const testRecipeID = "6465f8fbafe0329f05f949b9";

describe(testLabel + " Model functions:", function () {
  describe(" Checking user.js...", function () {
    this.timeout(10000);
    it("register - handling errors correctly", async () => {
      //invalid username
      mockUser = new User(mockUserName);
      let response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "username");
      mockUser = new User(mockUserName2);
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "username");
      //invalid email
      mockUser = new User(mockUserEmail);
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "email");
      //invalid password
      mockUser = new User(mockUserPass);
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "password");
      mockUser = new User(mockUserPass2);
      response = await mockUser.register();
      assert.equal(response.successful, false);
      assert.equal(response.error, "password");
      //mock valid registeration (doesn't actually save in DB)
      mockUser = new User(mockUserValid);
      response = await mockUser.register();
      assert.equal(response.successful, true);
      assert.equal(response.message, "success");
    });
    it("upgrade - upgrades Junior cook to Expert", async () => {
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
    this.timeout(10000);
    it("addRecipes - create new recipe", async () => {
      mockRecipe = new Recipe(mockRecipeInfo);
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
      let search = {
        term: "",
        filter: ["Tree nuts"],
        filterRange: "year",
        sort: { category: "energy", dir: "descend" },
      };
      items = await Recipe.fetchRecipes(search);
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
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
      testIng = new Ingredient(mockIngInfo);
      let result = await testIng.addIngredient(mockIngInfo);
      assert.equal(result.success, true);
    });
    it("updateIngredient - update ingredient's data", async () => {
      let result = await testIng.updateIngredient(mockIngInfo2);
      assert.equal(result, true);
    });
  });
  describe(" Checking suggestion.js...", function () {
    this.timeout(10000);
    it("addSuggestion - create new suggestion", async () => {
      mockSuggest = new Suggestion(mockSuggestInfo);
      let result = await mockSuggest.addSuggestion();
      assert.equal(result.success, true);
    });
    it("fetchAllSuggestions - get all suggestions", async () => {
      items = await Suggestion.fetchAllSuggestions();
      assert(Array.isArray(items));
      assert.notEqual(items.length, 0);
    });
  });
  after(() => console.log("  " + testLabel + " Done model tests."));
});
