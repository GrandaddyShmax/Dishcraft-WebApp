/*[ Import ]*/
const express = require("express");
const router = express.Router();

router.get("/suggest", async (req, res) => {
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Suggest Ingredient",
    page: "suggest",
    user: session.user || null,
  });
});

/*[ External access ]*/
module.exports = router;