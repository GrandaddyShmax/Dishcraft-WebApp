//[Import]
const express = require("express");
const router = express.Router();
const { User, Junior } = require("../../models/user");

router.get("/admin/manageusers", async (req, res) => {
  const sess = req.session;
  const users = await User.fetchAllUsers();
  res.render("template", {
    pageTitle: "Dishcraft - Manage Users",
    page: "A_manageUsers",
    users: users,
    message: sess.message || null,
    user: sess.user || null,
    hideSearch: true,
  });
});

//upgrade selected user
router.post("/admin/manageusers", async (req, res) => {
  const sess = req.session;
  const userID = req.body.submit;
  const user = new Junior(null, userID);
  //update user
  let successful = await user.upgradeUser();
  if (!successful) sess.message = `Encountered an error while upgrading user ${user.userName}`;

  //refresh page
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
