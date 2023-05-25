//[Import]
const express = require("express");
const router = express.Router();
//[API]
//const { getAssistant, parseAssToRecipe, parseAssToRecipeTest } = require("../../API/ai");
//[Clases]
const { Recipe } = require("../../models/recipe");
//[API]

router.get("/recipebook", async (req, res) => {
  var session = req.session;
  if (!session.user) return res.redirect("/");
  var recipes = await Recipe.fetchRecipes(null, session.user.recipes);
  const filtered = recipes.filter(item=>item.aiMade && item.userID == session.user.id);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - AI Recipe Book",
    page: "recipeBook",
    recipes: filtered,
    user: session.user,
    hideSearch: true,
  });
});

/*[ External access ]*/
module.exports = router;
