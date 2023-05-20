//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../index");
const testLabel = chalk.red("[Test]");
const testRecipeID = "6465f8fbafe0329f05f949b9";

describe(testLabel + " Running integration tests...", function () {
  it("Registration, login, logout", () => {
    request(app)
      .post("/register")
      .send({ userName: "test", email: "unit@test.co.il", password: "000000", passwordRep: "000000" })
      .expect(302) //redirect
      .redirects(1) //go to /
      .send({ userName: "test", password: "000000", submit: "login" })
      .expect(302) //redirect
      .redirects(1) //go to /home
      .end(function (err, response) {
        if (err) setTimeout(() => done(), 1000);
        request(app)
          .post("/logout")
          .expect(302) //redirect
          .redirects(1) //go to /
          .end(function (err, response) {
            assert.equal(response.header["content-type"], "text/html; charset=utf-8");
            setTimeout(() => done(), 1000);
          });
      });
  });
  it("Login, upload recipe, logout", () => {
    request(app)
      .post("/")
      .send({ userName: "test", password: "000000", submit: "login" })
      .expect(302) //redirect
      .redirects(1) //go to /home
      .end(function (err, response) {
        if (err) setTimeout(() => done(), 1000);
        request(app)
          .post("/createRecipe")
          .send({
            recipeName: "test",
            amount: ["3", "1"],
            unit: ["Tablespoon", "Cups"],
            name: ["peanut butter", "flour"],
            instructions: "this is a test recipe",
          })
          .expect(302) //redirect
          .redirects(1) //go to /assistant
          .end(function (err, response) {
            if (err) setTimeout(() => done(), 1000);
            request(app)
              .post("/logout")
              .expect(302) //redirect
              .redirects(1) //go to /
              .end(function (err, response) {
                assert.equal(response.header["content-type"], "text/html; charset=utf-8");
                setTimeout(() => done(), 1000);
              });
          });
      });
  });
  it("Login, get AI recipe, logout", () => {
    request(app)
      .post("/")
      .send({ userName: "test", password: "000000", submit: "login" })
      .expect(302) //redirect
      .redirects(1) //go to /home
      .end(function (err, response) {
        request(app)
          .post("/assistant")
          .send({ amount: ["3", "1"], unit: ["Tablespoon", "Cups"], name: ["peanut butter", "flour"] })
          .expect(302) //redirect
          .redirects(1) //go to /assistant
          .end(function (err, response) {
            assert.equal(response.header["content-type"], "text/html; charset=utf-8");
            setTimeout(() => done(), 1000);
          });
      });
  });
  it("Login, view recipe, rate, report, logout", () => {
    request(app)
      .post("/")
      .send({ userName: "test", password: "000000", submit: "login" })
      .expect(302) //redirect
      .redirects(1) //go to /home
      .send({ submit: testRecipeID })
      .expect(302) //redirect
      .redirects(1) // go to /recipe
      .send({ rating: 4 })
      .expect(302) //redirect
      .redirects(1) // go to /recipe
      .send({ submit: "report" })
      .expect(302) //redirect
      .redirects(1) // go to /recipe
      .end(function (err, response) {
        request(app)
          .post("/logout")
          .expect(302) //redirect
          .redirects(1) //go to /
          .end(function (err, response) {
            assert.equal(response.header["content-type"], "text/html; charset=utf-8");
            setTimeout(() => done(), 1000);
          });
      });
  });
  it("Login (expert), view recipe, bookmark&unbookmark, add badge, logout", () => {
    request(app)
      .post("/")
      .send({ userName: "expertTest", password: "000000", submit: "login" })
      .expect(302) //redirect
      .redirects(1) // go to /home
      .send({ submit: testRecipeID })
      .expect(302) //redirect
      .redirects(1) // go to /recipe
      .send({ submit: "bookmark" })
      .expect(302) //redirect
      .redirects(1) // go to /recipe
      .send({ submit: "unbookmark", badges: 2 })
      .expect(302) //redirect
      .redirects(1) // go to /recipe
      .send({ submit: "unbookmark", badges: 2 })
      .expect(302) //redirect
      .redirects(1) //follow redirect
      .end(function (err, response) {
        if (err) setTimeout(() => done(), 1000);
        request(app)
          .post("/logout")
          .expect(302) //redirect
          .redirects(1) //go to /
          .end(function (err, response) {
            assert.equal(response.header["content-type"], "text/html; charset=utf-8");
            setTimeout(() => done(), 1000);
          });
      });
  });

  after(() => console.log("  " + testLabel + " Done integration tests."));
});
