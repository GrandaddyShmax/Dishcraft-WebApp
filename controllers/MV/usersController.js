/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");

router.get("/", async (req, res) => {
  var session = req.session;
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
    session.message = null;
    session.error = null;
    return res.redirect("/home");
  }
  session.message = message;
  return res.redirect(req.get("referer"));
});

router.get("/register", (req, res) => {
  var session = req.session;
  res.render("template", {
    page: "register",
    pageTitle: "Register",
    message: session.message || null,
    error: session.error || null,
    temp: session.temp || {username: "", email: ""},
    user: null
  });
});

router.post("/register", async (req, res) => {
  var session = req.session;
  var tempUser = new User(req.body);
  let { successful, error, message } = await tempUser.register();
  if (successful) {
    session.message = null;
    session.error = null;
    return res.redirect("/");
  }
  session.message = message;
  session.error = error;
  session.temp = {username: tempUser.userName, email: tempUser.email};
  return res.redirect(req.get("referer"));
});

router.get("/logOut", async (req, res) => {
  delete req.session.user;
  return res.redirect("/");
});

/*[ External access ]*/
module.exports = router;
