//[Import]
const express = require("express");
const router = express.Router();
const { Suggestion } = require("../../models/suggestion");

router.get("/admin/viewsuggestions", async (req, res) => {
  const sess = req.session;
  //const suggestions = await Suggestion.fetchAllSuggestions();
  res.render("template", {
    pageTitle: "Dishcraft - View Suggestions",
    page: "A_viewSuggestions",
    user: sess.user || null,
    //suggestions: suggestions,
    hideSearch: true,
  });
});

/*[ External access ]*/
module.exports = router;