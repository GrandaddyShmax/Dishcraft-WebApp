//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
const { schemas } = require("../../schemas/paths");
let { db } = require("../../index.js");
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

describe(testLabel + " Configuration:", function () {
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

  after(() => console.log("  " + testLabel + " Done configuration tests."));
});
