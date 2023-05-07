//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../index.js");
const testLabel = chalk.red("[Test]");

describe(testLabel + " Checking Admin features...", function () {
  it("Manage Users page", () => {
    request(app)
      .get("/admin/manageusers")
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Manage Recipes page", () => {
    request(app)
      .get("/admin/managerecipes")
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Manage Categories page", () => {
    request(app)
      .get("/admin/managecategories")
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Manage Ingredients page", () => {
    request(app)
      .get("/admin/manageingredients")
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("View Suggestions page", () => {
    request(app)
      .get("/admin/viewsuggestions")
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });

  after(() => console.log("  " + testLabel + " Done checking Admin features."));
});
