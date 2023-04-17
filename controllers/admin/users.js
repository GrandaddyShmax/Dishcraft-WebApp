const { Junior, Expert } = require("../../models/user");

module.exports = (app, router) => {
  //display page of all users with an option to upgrade Junior Cooks
  router.get("/upgrade", async (req, res) => {
    const users = await Expert.fetchAllUsers();
    res.render("admin/userList", {
      pageTitle: "Upgrade users",
      users: users,
    });
  });
  //upgrade selected user
  router.post("/upgrade", async (req, res) => {
    console.log(req.body)
    return res.redirect(req.get("referer"));
    const [buttonPress, userID] = req.body.submit.split(" ");
    if (buttonPress != "upgrade") return;
    console.log(userID)
    const user = new Junior(null, userID);
    let successful = user.fetchUser();
    if (!successful)
      //error fetching the user
      return res.redirect(req.get("referer"));
    console.log(user)
    successful = user.upgradeUser();
    if (successful)//display a message to the admin
      console.log("upgraded " + user.userName);
    //update user
    return res.redirect(req.get("referer"));
  });
};
