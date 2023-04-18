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
    user: session.user || null,
  });
});

router.post("/", async (req, res) => {
  var session = req.session;
  const buttonPress = req.body.submit;
  if (buttonPress != "login") return res.redirect(req.get("referer"));
  var tempUser = new User(req.body);
  let { successful, message, user } = await tempUser.verify();
  if (successful) {
    session.user = user;
    return res.redirect("/home");
  }
  session.message = message;
  return res.redirect(req.get("referer"));
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
