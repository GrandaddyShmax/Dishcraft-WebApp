/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");

router.get("/", async (req, res) => {
  res.render("template", {
    page: "login",
    pageTitle: "Login",
  });
});

router.post("/", async (req, res) => {
  const temp = req.body.submit;
  var tempUser = new User(temp);
  let { successful, message, user } = tempUser.verify();

  if (successful) {
    var session = req.session;
    session.user = user;

    return res.redirect("/home");
  } else {
    session.message = message;
  }
});

router.get("/register", async (req, res) => {
  res.render("template", {
    page: "register",
    pageTitle: "Register",
  });
});

router.post("/register", async (req, res) => {
  const temp = req.body.submit;
  var tempUser = new User(temp);
  let { successful, message } = tempUser.register();
});

/*[ External access ]*/
module.exports = router;
