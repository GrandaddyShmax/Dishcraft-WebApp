/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");

router.get("/admin/managerecipes", async (req, res) => {
  const session = req.session;
  const recipes = await Recipe.fetchRecipes(session.filter || null, session.sort || null);
  res.render("template", {
    pageTitle: "Dishcraft - Manage Recipes",
    page: "A_manageRecipes",
    recipes: recipes,
    user: session.user || null,
  });
});

/*[ External access ]*/
module.exports = router;