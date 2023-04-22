//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../index.js");
const testLabel = chalk.red("[Test]");

describe(testLabel + " Checking Junior Cook features...", function () {
  it("Login page", () => {
    request(app)
      .get("/")
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Loging in", () => {
    request(app)
      .post("/")
      .send({ userName: "test", password: "000000", submit: "login" })
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Logging out", () => {
    request(app)
      .get("/logout")
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Registration page", () => {
    request(app)
      .get("/register")
      .expect(200)
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Registrating", () => {
    request(app)
      .post("/register")
      .send({ userName: "test", email: "unit@test.co.il", password: "000000", passwordRep: "000000" })
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/html; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Home page", () => {
    request(app)
      .get("/home")
      .expect(200)
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
      .expect(200)
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
  after(() => console.log("  " + testLabel + " Done checking Junior Cook features."));
});
