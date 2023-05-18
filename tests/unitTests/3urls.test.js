//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../../index.js");
const testLabel = chalk.red("[Test]");

describe(testLabel + " URLs:", function () {
  describe("Checking Junior Cook pages exist...", function () {
    it("Login page", () => {
      request(app)
        .get("/")
        .expect(302) //redirect
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Loging in", () => {
      request(app)
        .post("/")
        .send({ userName: "test", password: "000000", submit: "login" })
        .expect(302) //redirect
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Registration page", () => {
      request(app)
        .get("/register")
        .expect(302) //redirect
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Home page", () => {
      request(app)
        .get("/home")
        .expect(302) //redirect
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Recipe page", () => {
      try {
        request(app).get("/recipe");
      } catch {
        //can't access without being logged in
        setTimeout(() => done(), 1000);
      }
    });
    it("Assistant page", () => {
      request(app)
        .get("/assistant")
        .expect(302) //redirect
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it("Create Recipe page", () => {
      try {
        request(app).get("/createRecipe");
      } catch {
        //can't access without being logged in
        setTimeout(() => done(), 1000);
      }
    });
  });

  describe("Checking Expert Cook pages...", function () {
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
  });
  describe("Checking Admin pages...", function () {
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
  });

  after(() => console.log("  " + testLabel + " Done checking URLs."));
});
