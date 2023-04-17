/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");

//basic page for testing user badges
router.get("/userTest", async (req, res) => {
  const sess = req.session;
  const recipes = await Recipe.fetchRecipes(sess.filter || null, sess.sort || null);
  console.log(recipes);
  res.render("test/home", {
    pageTitle: "test",
    text: "it just works",
    recipes: recipes,
  });
});

/*[ External access ]*/
module.exports = router;
