//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../index");
const testLabel = chalk.red("[Test]");
//variables to calculate coverage:
const sTotal = 30;
var done = 1; //count "User login" by default
//test variables
const expert = { userName: "Mordechai", password: "scenario1" };
const junior = { userName: "Maor", password: "scenario2" };
const admin = { userName: "Genia", password: "scenario3" };
const actions = require("../jsons/tests.json").actions;
const disclaimer = chalk.grey("   (note that all tests login to the website before they start)");
const format = "\n         -";
const testRecipeID = "6465f8fbafe0329f05f949b9";

describe(testLabel + " Running integration tests:\n" + disclaimer, function () {
  describe("Testing Expert Cook actions from Scenario 1...", function () {
    //Login as Expert Cook
    beforeEach(() => {
      request(app)
        .post("/login")
        .send({ userName: expert.userName, password: expert.password, submit: "login" })
        .expect(302) //redirect
        .redirects(1); //go to /home
    });
    it(["Testing 3 actions:", ...actions.s1t1].join(format), () => {
      done += 3;
      request(app)
        .post("/login")
        .send({ userName: expert.userName, password: expert.password, submit: "login" })
        .expect(302) //redirect
        .redirects(1) //go to /home
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          //Suggest new ingredients to add
          request(app)
            .post("/suggest")
            .send({ suggestionName: "test ingredient", suggestionDescription: "can we have this?" })
            .expect(302) //redirect
            .redirects(1) //go to /home
            .end(function (err, response) {
              if (err) setTimeout(() => done(), 1000);
              //See all A.I. made recipes
              request(app)
                .get("/recipebook")
                .expect(302) //redirect
                .redirects(1) //go to recipebook
                .end(function (err, response) {
                  if (err) setTimeout(() => done(), 1000);
                  //Get random recipe
                  request(app)
                    .post("/home")
                    .send({ submit: "random" })
                    .expect(302) //redirect
                    .redirects(1) //go to /recipe
                    .end(function (err, response) {
                      assert.equal(response.header["content-type"], "text/html; charset=utf-8");
                      setTimeout(() => done(), 1000);
                    });
                });
            });
        });
    });
    it(["Testing 4 actions:", ...actions.s1t2].join(format), () => {
      done += 4;
      //Sort/filter recipes by time
      request(app)
        .post("/search")
        .send({ category: "top", dir: "descend", submit: "sortApply" })
        .expect(302) //redirect
        .redirects(1) //go to /home
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          //Filter recipes by ingredient category
          request(app)
            .post("/search")
            .send({ filter: "Eggs", submit: "filterApply" })
            .expect(302) //redirect
            .redirects(1) //go to /home
            .send({ submit: testRecipeID })
            .expect(302) //redirect
            .redirects(1) // go to /recipe
            //Give badges to recipes && Bookmark recipes
            .send({ submit: "bookmark", badges: 2 })
            .expect(302) //redirect
            .redirects(1) // go to /recipe
            .end(function (err, response) {
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              setTimeout(() => done(), 1000);
            });
        });
    });
    it(["Testing 2 actions:", ...actions.s1t3].join(format), () => {
      done += 2;
      //Upload recipe && Custom background
      request(app)
        .post("/createRecipe")
        .send({
          recipeName: "test",
          instructions: "testing creation",
          color: "cold",
          amount: ["3", "1"],
          unit: ["Tablespoon", "Cups"],
          name: ["peanut butter", "flour"],
        })
        .expect(302) //redirect
        .redirects(1) //go to /home
        .end(function (err, response) {
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
  });
  describe(testLabel + " Testing Junior Cook actions from Scenario 2...", function () {});
  describe(testLabel + " Testing Admin actions from Scenario 3...", function () {});

  after(() => console.log("  " + testLabel + ` Done. ${((done / sTotal) * 100).toFixed(2)}% total scenario coverage.`));
});
