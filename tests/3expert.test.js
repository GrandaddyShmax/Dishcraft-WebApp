//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../index.js");
const testLabel = chalk.red("[Test]");

describe(testLabel + " Checking Expert Cook features...", function () {
  it("Suggestion page", () => {
    try {
      request(app).get("/suggest");
    } catch {
      //can't access without being logged as an expert
      setTimeout(() => done(), 1000);
    }
  });
  it("Bookmarks page", () => {
    try {
      request(app).get("/bookmarks");
    } catch {
      //can't access without being logged as an expert
      setTimeout(() => done(), 1000);
    }
  });

  after(() => console.log("  " + testLabel + " Done checking Expert Cook features."));
});
