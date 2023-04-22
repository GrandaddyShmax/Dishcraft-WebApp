//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
const testLabel = chalk.red("[Test]");
const dbLabel = "MongoDB access: ";
const apiFoodLabel = "Edamam API access: ";
const apiAILabel = "GPT API access: ";

describe(testLabel + " Checking secrets...", function () {
  //db api
  it(dbLabel + "url", () => assert.notEqual(process.env.DB_URL, undefined));
  //food api
  it(apiFoodLabel + "app ID", () => assert.notEqual(process.env.APP_ID, undefined));
  it(apiFoodLabel + "app key", () => assert.notEqual(process.env.APP_KEYS, undefined));
  it(apiFoodLabel + "app ID 2", () => assert.notEqual(process.env.APP_ID2, undefined));
  it(apiFoodLabel + "app key 2", () => assert.notEqual(process.env.APP_KEYS2, undefined));
  //ai api
  it(apiAILabel + "username", () => assert.notEqual(process.env.USERNAME, undefined));
  it(apiAILabel + "password", () => assert.notEqual(process.env.USERPASS, undefined));
  it(apiAILabel + "ai key", () => assert.notEqual(process.env.OPENAI_API_KEY, undefined));

  after(() => console.log("  " + testLabel + " Done checking secrets."));
});
