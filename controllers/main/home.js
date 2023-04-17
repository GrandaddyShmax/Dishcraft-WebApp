/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");

router.get("/home", async (req, res) => {
  const sess = req.session;
  const recipes = await Recipe.fetchRecipes(sess.filter || null, sess.sort || null);
  res.render("template", {
    pageTitle: "Dishcraft - Homepage",
    page: "home",
    recipes: recipes,
  });
});

/*[ External access ]*/
module.exports = router;
