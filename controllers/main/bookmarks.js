//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { Recipe } = require("../../models/recipe");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

router.get("/bookmarks", async (req, res) => {
  if (!checkPerms(req, res, 2)) return;
  var session = req.session;
  const recipes = await Recipe.fetchRecipes(null, session.user.bookmarks);
  session.recipe = null;
  const { navbarError, navbarText } = navbarApply(session);
  res.render("template", {
    pageTitle: "Dishcraft - Bookmarks",
    page: "bookmarks",
    recipes: recipes,
    user: session.user,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText,
  });
});

router.post("/bookmarks", async (req, res) => {
  if (!checkPerms(req, res, 2)) return;
  var session = req.session;
  const smt = req.body.submit;
  const recipe = new Recipe(null, smt);
  //find recipe
  let successful = await recipe.fetchRecipe(session.user.id);
  if (successful) {
    session.recipe = recipe;
    session.returnPage = "/bookmarks";
    return res.redirect("/recipe");
  }
  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
