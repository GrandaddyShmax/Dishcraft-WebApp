//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
const { capitalize, endPlural, offloadFields, handleIngAdding, printAllRoutes } = require("../../utils");
const { app } = require("../../index.js");
const testLabel = chalk.red("[Test]");
const dbLabel = "MongoDB access: ";
const apiFoodLabel = "Edamam API access: ";
const apiAILabel = "GPT API access: ";

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

    it("printAllRoutes - list all registered routes", () => {
      let result = printAllRoutes(app, "", true);
      assert.equal(result, true);
    });
  });

  after(() => console.log("  " + testLabel + " Done general tests."));
});
