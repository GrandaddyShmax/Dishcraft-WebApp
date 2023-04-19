/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const { Ingredient } = require("../../models/ingredient");

//temp//
const ingred = require("../../IngredAPI/connection");

router.get("/", async (req, res) => {
  var session = req.session;

  //let data = await ingred.getData('apple');
  //var temp = new Ingredient('apple', data);
  //temp.printIngridient();

  res.render("template", {
    page: "login",
    pageTitle: "Login",
    message: session.message || null,
    user: null,
  });
});

router.post("/", async (req, res) => {
  var session = req.session;
  const buttonPress = await req.body.submit;
  if (buttonPress != "login") return res.redirect(req.get("referer"));
  var tempUser = new User(req.body);
  let { successful, message, user } = await tempUser.verify();
  if (successful) {
    session.user = user;
    return res.redirect("/home");
  }
  session.message = message;
  console.log(message);
  return res.redirect(req.get("referer"));
});

router.get("/register", (req, res) => {
  res.render("template", {
    page: "register",
    pageTitle: "Register",
    user: null
  });
});

router.post("/register", async (req, res) => {
  var session = req.session;
  var tempUser = new User(req.body);
  let { successful, message } = await tempUser.register();
  if (successful) {
    return res.redirect("/");
  }
  session.message = message;
  console.log(message);
  return res.redirect(req.get("referer"));
});

router.get("/logOut", async (req, res) => {
  delete req.session.user;
  return res.redirect("/");
});

/*[ External access ]*/
module.exports = router;
