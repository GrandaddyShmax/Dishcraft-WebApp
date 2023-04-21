/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");

router.get("/home", async (req, res) => {
  const session = req.session;
  const recipes = await Recipe.fetchRecipes(session.filter || null, session.sort || null);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - Homepage",
    page: "home",
    recipes: recipes,
    user: session.user || null,
  });
});

router.post("/home", async (req, res) => {
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
