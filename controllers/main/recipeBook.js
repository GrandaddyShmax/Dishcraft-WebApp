//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
//[Aid]
const { checkPerms } = require("../../utils");

router.get("/recipebook", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  if (!session.user) return res.redirect("/");
  const recipes = await Recipe.fetchRecipes(null, null, session.user.id, true);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - AI Recipe Book",
    page: "recipeBook",
    recipes: recipes,
    user: session.user,
    hideSearch: true,
  });
});

//[External access]
module.exports = router;
