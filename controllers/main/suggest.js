//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { Suggestion } = require("../../models/suggestion");
//[Aid]
const { checkPerms } = require("../../utils");

router.get("/suggest", async (req, res) => {
  if (!checkPerms(req, res, 2)) return;
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Suggest Ingredient",
    page: "suggest",
    user: session.user || null,
    hideSearch: true,
  });
});

//post
router.post("/suggest", async (req, res) => {
  if (!checkPerms(req, res, 2)) return;
  const suggestionData = req.body;
  var suggestion = new Suggestion(suggestionData);
  let { success, msg } = await suggestion.addSuggestion();
  if (success) {
    return res.redirect("/home");
  } else {
    console.log(msg);
    return res.redirect(req.get("referer"));
  }
});

//[External access]
module.exports = router;
