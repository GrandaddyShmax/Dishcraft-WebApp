/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Junior, Expert } = require("../../models/user");

//display page of all users with an option to upgrade Junior Cooks
router.get("/admin/upgrade", async (req, res) => {
  const users = await Expert.fetchAllUsers();
  res.render("admin/userList", {
    pageTitle: "Upgrade users",
    users: users,
  });
});
//upgrade selected user
router.post("/admin/upgrade", async (req, res) => {
  const userID = req.body.submit;
  console.log(userID);
  const user = new Junior(null, userID);
  console.log(user)
  let successful = await user.fetchUser();
  if (!successful)
    //error fetching the user
    return res.redirect(req.get("referer"));
  console.log(user);
  successful = await user.upgradeUser();
  if (successful)
    //display a message to the admin
    console.log("upgraded " + user.userName);
  //update user
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
