//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { User, Junior, Expert } = require("../../models/user");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

router.get("/admin/manageusers", async (req, res) => {
  if (!checkPerms(req, res, 3)) return;
  const sess = req.session;
  const {navbarError, navbarText} = navbarApply(sess);
  const users = await User.fetchAllUsers();
  delete sess.currIngred;
  delete sess.indexIngred;
  delete sess.categoryIndex;
  delete sess.errorIngred;
  res.render("template", {
    pageTitle: "Dishcraft - Manage Users",
    page: "A_manageUsers",
    users: users,
    message: sess.message || null,
    user: sess.user || null,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText
  });
});

//upgrade selected user
router.post("/admin/manageusers", async (req, res) => {
  if (!checkPerms(req, res, 3)) return;
  const sess = req.session;
  const [buttonPress, userID] = req.body.submit.split("&");
  if (buttonPress == "update") {
    const user = new Junior(null, userID);
    //update user
    let successful = await user.upgradeUser();
    if (!successful) sess.message = `Encountered an error while upgrading user ${user.userName}`;
  } else if (buttonPress == "downgrade") {
    const user = new Expert(null, userID);
    //update user
    let successful = await user.downgradeUser();
    if (!successful) sess.message = `Encountered an error while downgrading user ${user.userName}`;
  } else if (buttonPress == "ban") {
    const user = new User(null, userID);
    //ban user
    let successful = await user.banUser();
    if (!successful) sess.message = `Encountered an error while banning user ${user.userName}`;
  } else if (buttonPress == "unban") {
    const user = new User(null, userID);
    //ban user
    let successful = await user.unbanUser();
    if (!successful) sess.message = `Encountered an error while unbanning user ${user.userName}`;
  }
  //refresh page
  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
