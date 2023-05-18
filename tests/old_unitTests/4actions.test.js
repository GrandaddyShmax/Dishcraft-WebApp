//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../../index.js");
const testLabel = chalk.red("[Test]");

describe(testLabel + " Actions:", function () {
describe("Checking Junior Cook features...", function () {
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
  it("Logging out", () => {
    request(app)
      .get("/logout")
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
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
  it("Searching recipes", () => {
    request(app)
      .post("/search")
      .send({ search: "bread" })
      .expect(302) //redirect
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Filtering recipes", () => {
    request(app)
      .post("/search")
      .send({ filter: "Gluten" })
      .expect(302) //redirect
      .expect("Location", "/home")
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
  it("Sorting recipes", () => {
    request(app)
      .post("/search")
      .send({ category: "energy", dir: "ascend" })
      .expect(302) //redirect
      .expect("Location", "/home")
      .end(function (err, response) {
        assert.equal(response.header["content-type"], "text/plain; charset=utf-8");
        setTimeout(() => done(), 1000);
      });
  });
});
  after(() => console.log("  " + testLabel + " Done checking actions."));
});
