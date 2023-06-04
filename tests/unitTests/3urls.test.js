//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../../index.js");
//[Variables]
const testLabel = chalk.red("[Test]");

describe(testLabel + " URLs:", function () {
  describe("Checking Junior Cook pages exist...", function () {
    it("Login page", () => {
      request(app)
        .get("/")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Registration page", () => {
      request(app)
        .get("/register")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Home page", () => {
      request(app)
        .get("/home")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Recipe page", () => {
      request(app)
        .get("/recipe")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Assistant page", () => {
      request(app)
        .get("/assistant")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Create Recipe page", () => {
      request(app)
        .get("/createRecipe")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("News page", () => {
      request(app)
        .get("/news")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Uploaded recipes page", () => {
      request(app)
        .get("/uploadedRecipes")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
  });

  describe("Checking Expert Cook pages exist...", function () {
    it("Suggestion page", () => {
      request(app)
        .get("/suggest")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Bookmarks page", () => {
      request(app)
        .get("/bookmarks")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("AI recipe book page", () => {
      request(app)
        .get("/recipebook")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
  });
  describe("Checking Admin pages exist...", function () {
    it("Manage Users page", () => {
      request(app)
        .get("/admin/manageusers")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Manage Recipes page", () => {
      request(app)
        .get("/admin/managerecipes")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Manage Categories page", () => {
      request(app)
        .get("/admin/managecategories")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Manage Ingredients page", () => {
      request(app)
        .get("/admin/manageingredients")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("View Suggestions page", () => {
      request(app)
        .get("/admin/viewsuggestions")
        .expect(200) //confirmation
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
  });

  after(() => console.log("  " + testLabel + " Done checking URLs."));
});
