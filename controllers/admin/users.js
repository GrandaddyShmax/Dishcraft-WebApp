/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Junior, Expert } = require("../../models/user");

//display page of all users with an option to upgrade Junior Cooks
router.get("/admin/upgrade", async (req, res) => {
  const sess = req.session;
  const users = await Expert.fetchAllUsers(true);
  res.render("template", {
    pageTitle: "Dishcraft - Upgrade users",
    page: "/A_userList",
    users: users,
    message: sess.message || null,
  });
});
//upgrade selected user
router.post("/admin/upgrade", async (req, res) => {
  const sess = req.session;
  const userID = req.body.submit;
  const user = new Junior(null, userID);
  //find user
  let successful = await user.fetchUser();
  if (!successful) {
    sess.message = `Encountered an error while looking up user with ID:\n${userID}`;
    return res.redirect(req.get("referer"));
  }
  //update user
  successful = await user.upgradeUser();
  if (!successful) sess.message = `Encountered an error while upgrading user ${user.userName}`;

  //refresh page
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
