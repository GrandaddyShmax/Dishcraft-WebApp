/*[ Import ]*/
const express = require("express");
const router = express.Router();

router.get("/recipe", async (req, res) => {
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Recipe View",
    page: "recipe",
    user: session.user || null,
    recipe: session.recipe || null,
  });
});

/*[ External access ]*/
module.exports = router;
