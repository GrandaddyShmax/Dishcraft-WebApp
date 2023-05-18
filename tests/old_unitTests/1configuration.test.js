//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
const { schemas } = require("../../schemas/paths");
let { db } = require("../../index.js");
const testLabel = chalk.red("[Test]");
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
