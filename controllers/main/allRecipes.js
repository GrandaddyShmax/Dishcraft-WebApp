//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

router.get("/uploadedRecipes", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  const {navbarError, navbarText} = navbarApply(session);
  const recipes = await Recipe.fetchRecipes(null, null, session.user.id, false);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - Uploaded Recipes",
    page: "allRecipes",
    recipes: recipes,
    user: session.user,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText
  });
});

router.post("/uploadedRecipes", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  const smt = req.body.submit;
  const recipe = new Recipe(null, smt);
  //find recipe
  let successful = await recipe.fetchRecipe(session.user.id);
  if (successful) {
    session.recipe = recipe;
    session.returnPage = "/uploadedRecipes";
    return res.redirect("/recipe");
  }
  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
