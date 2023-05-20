//[Import]
const express = require("express");
const router = express.Router();
const { Suggestion } = require("../../models/suggestion");

router.get("/admin/viewsuggestions", async (req, res) => {
  const sess = req.session;
  const suggestions = await Suggestion.fetchAllSuggestions();
  delete sess.currIngred;
  delete sess.indexIngred;
  delete sess.categoryIndex;
  delete sess.errorIngred;
  res.render("template", {
    pageTitle: "Dishcraft - View Suggestions",
    page: "A_viewSuggestions",
    user: sess.user || null,
    suggestions: suggestions,
    hideSearch: true,
  });
});

router.post("/admin/viewsuggestions", async (req, res) => {
  await Suggestion.deleteSuggestion(req.body.submit);
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;