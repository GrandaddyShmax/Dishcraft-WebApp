//[Import]
const chalk = require("chalk"); //needed for colorful console messages
var assert = require("assert");
var request = require("supertest");
const { app } = require("../index");
//[Variables]
const testLabel = chalk.red("[Test]");
//variables to calculate coverage:
const sTotal = 30;
var done = 1; //count "User login" by default
//test variables
const { actions, expert, junior, admin, testRecipeID, testUserID, testCatID } = require("../jsons/tests.json");
const disclaimer = chalk.grey("   (note that all tests login to the website before they start)");
const format = "\n         -";

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
    it([`Testing ${actions.s1t1.length} actions:`, ...actions.s1t1].join(format), () => {
      done += actions.s1t1.length;
      //Suggest new ingredients to add
      request(app)
        .post("/suggest")
        .send({ suggestionName: "test ingredient", suggestionDescription: "can we have this?" })
        .expect(302) //redirect
        .redirects(1) //go to /home
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          //See all A.I. made recipes
          request(app)
            .get("/recipebook")
            .expect(200) //confirmation
            .end(function (err, response) {
              if (err) setTimeout(() => done(), 1000);
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              //Get random recipe
              request(app)
                .post("/home")
                .send({ submit: "random" })
                .expect(302) //redirect
                .redirects(1) //go to /recipe
                .end(function (err, response) {
                  if (err) setTimeout(() => done(), 1000);
                  assert.equal(response.header["content-type"], "text/html; charset=utf-8");
                  setTimeout(() => done(), 1000);
                });
            });
        });
    });
    it([`Testing ${actions.s1t2.length} actions:`, ...actions.s1t2].join(format), () => {
      done += actions.s1t2.length;
      //Sort/filter recipes by time
      request(app)
        .post("/search")
        .send({ category: "top", dir: "descend", submit: "sortApply" })
        .expect(302) //redirect
        .redirects(1) //go to /home
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          //Filter recipes by ingredient category
          request(app)
            .post("/search")
            .send({ filter: "Eggs", submit: "filterApply" })
            .expect(302) //redirect
            .redirects(1) //go to /home
            .end(function (err, response) {
              if (err) setTimeout(() => done(), 1000);
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              request(app)
                .post("/home")
                .send({ submit: testRecipeID })
                .expect(302) //redirect
                .redirects(1) // go to /recipe
                //Give badges to recipes && Bookmark recipes
                .send({ submit: "bookmark", badges: 2 })
                .expect(302) //redirect
                .redirects(1) // go to /recipe
                .end(function (err, response) {
                  if (err) setTimeout(() => done(), 1000);
                  assert.equal(response.header["content-type"], "text/html; charset=utf-8");
                  setTimeout(() => done(), 1000);
                });
            });
        });
    });
    it([`Testing ${actions.s1t3.length} actions:`, ...actions.s1t3].join(format), () => {
      done += actions.s1t3.length;
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
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
  });
  describe(testLabel + " Testing Junior Cook actions from Scenario 2...", function () {
    //Login as Junior Cook
    beforeEach(() => {
      request(app)
        .post("/login")
        .send({ userName: junior.userName, password: junior.password, submit: "login" })
        .expect(302) //redirect
        .redirects(1); //go to /home
    });
    it([`Testing ${actions.s2t1.length} actions:`, ...actions.s2t1].join(format), () => {
      done += actions.s2t1.length;
      //Use A.I. to get recipes
      request(app)
        .post("/assistant")
        .send({
          amount: ["3", "1"],
          unit: ["Tablespoon", "Cups"],
          name: ["peanut butter", "flour"],
        })
        .expect(302) //redirect
        .redirects(1) //go to /assistant
        //"Publish" A.I. recipes
        .send({ submit: "publish" })
        .expect(302) //redirect
        .redirects(1) //go to /home
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          setTimeout(() => done(), 1000);
        });
    });
    it([`Testing ${actions.s2t2.length} actions:`, ...actions.s2t2].join(format), () => {
      done += actions.s2t2.length;
      //Ability to search recipes
      request(app)
        .post("/search")
        .send({ search: "chicken" })
        .expect(302) //redirect
        .redirects(1) //go to /home
        //Sort recipes by nutritional value
        .send({ category: "energy", dir: "ascend" })
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          //"Category menu
          request(app)
            .post("/updateCategories")
            .send({ categories: "meat" })
            .expect(302) //redirect
            .redirects(1) //go to /home
            //View recipes and nutritional value
            .send({ submit: testRecipeID })
            .expect(302) //redirect
            .redirects(1) // go to /recipe
            //Rank/report recipes
            .send({ rating: 2 })
            .expect(302) //redirect
            .redirects(1) // go to /recipe
            .end(function (err, response) {
              if (err) setTimeout(() => done(), 1000);
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              setTimeout(() => done(), 1000);
            });
        });
    });
  });
  describe(testLabel + " Testing Admin actions from Scenario 3...", function () {
    //Login as Admin
    beforeEach(() => {
      request(app)
        .post("/login")
        .send({ userName: admin.userName, password: admin.password, submit: "login" })
        .expect(302) //redirect
        .redirects(1); //go to /home
    });
    it([`Testing ${actions.s3t1.length} actions:`, ...actions.s3t1].join(format), () => {
      done += actions.s3t1.length;
      request(app)
        .get("/admin/manageusers")
        .expect(200) //confirmation
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          //View registered users amount
          response.body.should.include("User Count");
          //View existing users and their recipe count
          response.body.should.include("Recipes Published");
          request(app)
            .post("/admin/manageusers")
            .send({ submit: "update&" + testUserID })
            .expect(302) //redirect
            .redirects(1) //go to //admin/manageusers
            //Ability to ban users
            .send({ submit: "ban&" + testUserID })
            .expect(302) //redirect
            .redirects(1) //go to //admin/manageusers
            .end(function (err, response, body) {
              if (err) setTimeout(() => done(), 1000);
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              setTimeout(() => done(), 1000);
            });
        });
    });
    it([`Testing ${actions.s3t2.length} actions:`, ...actions.s3t2].join(format), () => {
      done += actions.s3t2.length;
      //View requested ingredients
      request(app)
        .get("/admin/viewsuggestions")
        .expect(200) //confirmation
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          //Add requested ingredients
          request(app)
            .post("/admin/manageingredients")
            .send({
              name: "test",
              energy: "500",
              fattyAcids: "500",
              sodium: "500",
              sugar: "500",
              protein: "500",
              totalWeight: "500",
              submit: "apply&-1",
            })
            .expect(302) //redirect
            .redirects(1) //go to /admin/manageingredients
            .end(function (err, response) {
              if (err) setTimeout(() => done(), 1000);
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              //Ability to categorize ingredients
              request(app)
                .post("/admin/managecategories")
                .send({ addInput: "test", submit: "add&&" + testCatID });
              setTimeout(() => done(), 1000);
            });
        });
    });
    it([`Testing ${actions.s3t3.length} actions:`, ...actions.s3t3].join(format), () => {
      done += actions.s3t3.length;
      request(app)
        .get("/admin/managerecipes")
        .expect(200) //confirmation
        .end(function (err, response) {
          if (err) setTimeout(() => done(), 1000);
          assert.equal(response.header["content-type"], "text/html; charset=utf-8");
          //View reports made by users
          response.body.should.include("Report Count");
          //Add requested ingredients
          request(app)
            .post("/admin/managerecipes")
            .send({ submit: testRecipeID })
            .expect(302) //redirect
            .redirects(1) //go to /admin/manageingredients
            .end(function (err, response) {
              if (err) setTimeout(() => done(), 1000);
              assert.equal(response.header["content-type"], "text/html; charset=utf-8");
              request(app)
                .post("/news")
                .send({ title: "test", submit: "add&", description: "Integration tests complete!", userId: admin.id })
                .expect(302) //redirect
                .redirects(1) //go to /news
                .end(function (err, response) {
                  if (err) setTimeout(() => done(), 1000);
                  assert.equal(response.header["content-type"], "text/html; charset=utf-8");
                  setTimeout(() => done(), 1000);
                });
            });
        });
    });
  });

  after(() => console.log("  " + testLabel + ` Done. ${((done / sTotal) * 100).toFixed(2)}% total scenario coverage.`));
});
