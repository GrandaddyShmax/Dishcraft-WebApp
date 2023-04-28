//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
//[API]

router.get("/bookmarks", async (req, res) => {
  const session = req.session;
  const recipes = await Recipe.fetchRecipes(null);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - Bookmarks",
    page: "bookmarks",
    recipes: recipes,
    user: session.user,
    hideSearch: true,
  });
});

router.post("/bookmarks", async (req, res) => {
  const session = req.session;
  const smt = req.body.submit;
  const recipe = new Recipe(null, smt);
  //find recipe
  let successful = await recipe.fetchRecipe();
  if (successful) {
    session.recipe = recipe;
    return res.redirect("/recipe");
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;