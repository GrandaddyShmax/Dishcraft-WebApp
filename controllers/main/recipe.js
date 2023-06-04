//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { Recipe } = require("../../models/recipe");
const { Expert } = require("../../models/user");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

//get
router.get("/recipe", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  const {navbarError, navbarText} = navbarApply(session);
  let isMarked = false,
    isBadgeButton = false,
    isReported = session.recipe.report.includes(session.user.id);
  if (session.user && session.user.role > 1) {
    isMarked = session.user.bookmarks.includes(session.recipe.id);
    isBadgeButton = !session.recipe.badgesUsers.includes(session.user.id);
  }
  res.render("template", {
    pageTitle: "Dishcraft - Recipe View",
    page: "recipe",
    user: session.user || null,
    recipe: session.recipe,
    returnPage: session.returnPage || "/home",
    isMarked: isMarked,
    isBadgeButton: isBadgeButton,
    isReported: isReported,
    navbarError: navbarError,
    navbarText: navbarText
  });
});

//post
router.post("/recipe", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  const buttonType = req.body.submit;
  const rating = req.body.rating;
  const badges = req.body.badges;
  const user = new Expert(null, session.user.id);
  user.bookmarks = session.user.bookmarks;
  let success = true;

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
  if (badges) {
    const recipe = new Recipe(session.recipe);
    await recipe.addBadgeToRecipe(session.user.id, badges);
    session.recipe = recipe;
  }

  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
