//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
const {
  capitalize,
  endPlural,
  offloadFields,
  handleIngAdding,
  printAllRoutes,
  smartInclude,
  resetCategories,
  navbarApply
} = require("../../utils");
const { schemas } = require("../../schemas/paths");
let { app, db } = require("../../index.js");
//[Variables]
const testLabel = chalk.red("[Test]");
const dbLabel = "MongoDB access: ";
const apiFoodLabel = "Edamam API access: ";
const apiAILabel = "GPT API access: ";
let connected;

//wait for DB to connect
before(function (done) {
  this.timeout(10000);
  db.then((result) => {
    connected = result;
    done();
  });
});

describe(testLabel + " General:", function () {
  describe(" Checking secrets...", function () {
    //db api
    it(dbLabel + "url", () => assert.notEqual(process.env.DB_URL, undefined));
    //food api
    it(apiFoodLabel + "app ID", () => assert.notEqual(process.env.APP_ID, undefined));
    it(apiFoodLabel + "app key", () => assert.notEqual(process.env.APP_KEYS, undefined));
    it(apiFoodLabel + "app ID 2", () => assert.notEqual(process.env.APP_ID2, undefined));
    it(apiFoodLabel + "app key 2", () => assert.notEqual(process.env.APP_KEYS2, undefined));
    //ai api
    it(apiAILabel + "usermail", () => assert.notEqual(process.env.USERMAIL, undefined));
    it(apiAILabel + "password", () => assert.notEqual(process.env.USERPASS, undefined));
    it(apiAILabel + "ai key", () => assert.notEqual(process.env.OPENAI_API_KEY, undefined));
  });
  describe(" Checking utils.js...", function () {
    it("capitalize - smart capitalization of strings", () => {
      let result = capitalize(["[test-text]"]);
      assert(result);
    });
    it("endPlural - smart pluralization of strings", () => {
      let result = endPlural(2, "test");
      assert.equal(result.charAt(result.length - 1), "s");
      result = endPlural(1, "tests");
      assert.notEqual(result.charAt(result.length - 1), "s");
      result = endPlural(1, "test");
      assert.notEqual(result.charAt(result.length - 1), "s");
    });
    it("smartInclude - check if string is in array", () => {
      let result = smartInclude(["one1", "two2", "three3"], "1");
      assert.equal(result, true);
      result = smartInclude(["apple", "tomato", "fish"], "apples");
      assert.equal(result, true);
      result = smartInclude(["one1", "two2", "three3"], "1", true);
      assert.equal(result, false);
    });
    it("offloadFields - copy fields of object to another", () => {
      let result = offloadFields(["test"], null, [true]);
      assert.equal(result.test, true);
      offloadFields(["test"], result);
      assert.equal(result.test, undefined);
    });
    it("handleIngAdding - backend for Ingredient buttons", () => {
      var req = { session: { recipe: {} }, body: { amount: [1.0], unit: ["Cups"], name: ["milk"] } };
      let result = handleIngAdding(req, null);
      assert.equal(result, false);
      req = { session: { recipe: {} }, body: { amount: 1.0, unit: "Cups", name: "milk" } };
      result = handleIngAdding(req, null);
      assert.equal(result, false);
      result = handleIngAdding(req, null, "addmore");
      assert.equal(result, true);
      result = handleIngAdding(req, null, "remove", 0);
      assert.equal(result, true);
    });
    it("resetCategories - clear categories in a recipe", () => {
      var recipe = {
        categories: {
          spicy: true,
          sweet: null,
          salad: null,
          meat: null,
          soup: null,
          dairy: null,
          pastry: null,
          fish: null,
          grill: null,
        },
      };
      resetCategories(recipe);
      assert.equal(recipe.categories.spicy, false);
      var req = {
        body: {
          spicy: true,
          sweet: null,
          salad: null,
          meat: null,
          soup: null,
          dairy: null,
          pastry: null,
          fish: null,
          grill: null,
        },
      };
      resetCategories(recipe, req);
      assert.equal(recipe.categories.spicy, true);
    });
    it("printAllRoutes - list all registered routes", () => {
      let result = printAllRoutes(app, "", true);
      assert.equal(result, true);
    });
    it("navbarApply - apply navbar values to session", () => {
      let session = {navbarError: "testError", navbarText: "testText"};
      let result = navbarApply(session);
      assert.equal(result.navbarError, "testError");
      assert.equal(result.navbarText, "testText");
    });
  });
  describe("Checking database...", function () {
    it("Connection to database", () => assert(connected));
    it("Users database exists", () => {
      schemas.User.find({}).then((items) => {
        assert(Array.isArray(items));
        assert.notEqual(items.length, 0);
      });
    });
    it("Recipes database exists", () => {
      schemas.Recipe.find({}).then((items) => {
        assert(Array.isArray(items));
        assert.notEqual(items.length, 0);
      });
    });
    it("Categories database exists", () => {
      schemas.Category.find({}).then((items) => {
        assert(Array.isArray(items));
        //db can have no entries
      });
    });
    it("Ingredient database exists", () => {
      schemas.Ingredient.find({}).then((items) => {
        assert(Array.isArray(items));
        //db can have no entries
      });
    });
    it("Suggestion database exists", () => {
      schemas.Suggestion.find({}).then((items) => {
        assert(Array.isArray(items));
        //db can have no entries
      });
    });
    it("Admin list exists", () => {
      schemas.AdminList.find({}).then((items) => {
        assert(Array.isArray(items));
        assert.notEqual(items.length, 0);
      });
    });
    it("AI configuration file exists", () => {
      schemas.AIAccess.findOne({}).then((item) => {
        assert.notEqual(item, undefined);
      });
    });
  });
  after(() => console.log("  " + testLabel + " Done general tests."));
});
