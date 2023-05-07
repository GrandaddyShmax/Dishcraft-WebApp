//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
const { Expert } = require("../../models/user");

//get
router.get("/recipe", async (req, res) => {
  var session = req.session;
  let isMarked = false;
  if (session.user && session.user.role > 1) {
    isMarked = session.user.bookmarks.includes(session.recipe.id);
  }
  res.render("template", {
    pageTitle: "Dishcraft - Recipe View",
    page: "recipe",
    user: session.user || null,
    recipe: session.recipe,
    returnPage: session.returnPage || "/home",
    isMarked: isMarked,
  });
});

//post
router.post("/recipe", async (req, res) => {
  var session = req.session;
  if (!session.user) return res.redirect("/");
  const buttonType = req.body.submit;
  const rating = req.body.rating;
  const user = new Expert(null, session.user.id);
  user.bookmarks = session.user.bookmarks;
  let success = true;

  //console.log(rating);

  if (buttonType === "bookmark") {
    const { success, bookmarks } = await user.bookmark(session.recipe.id);
    session.user.bookmarks = bookmarks;
  } else if (buttonType === "unbookmark") {
    const { success, bookmarks } = await user.unBookmark(session.recipe.id);
    session.user.bookmarks = bookmarks;
  } else if (buttonType === "report") {
    const recipe = new Recipe(session.recipe);
    await recipe.reportFunc(session.user.id);
    session.recipe = recipe;
  }

  if (rating) {
    const recipe = new Recipe(session.recipe);
    await recipe.voteRating(session.user.id, rating);
    session.recipe = recipe;
  }

  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
