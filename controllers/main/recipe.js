//[Import]
const express = require("express");
const router = express.Router();
const recipe = require("../../schemas/recipe");

//get
router.get("/recipe", async (req, res) => {
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Recipe View",
    page: "recipe",
    user: session.user || null,
    recipe: session.recipe || null,
  });
});

//post
router.post("/recipe", async (req, res) => {//is this even used?
  var session = req.session;
  const recipeData = req.body;
  var recipe = new recipe(recipeData);
  let { success, msg } = await recipe.addRecipe();

  if (success) {
    return res.redirect("/home");
  } else {
    console.log(msg);
    return res.redirect(req.get("referer"));
  }
});

/*[ External access ]*/
module.exports = router;
