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
  const { navbarError, navbarText } = navbarApply(session);
  const recipes = await Recipe.fetchRecipes(null, null, session.user.id, false);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - Uploaded Recipes",
    page: "allRecipes",
    recipes: recipes,
    user: session.user,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText,
  });
});

router.post("/uploadedRecipes", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  const [buttonPress, smt] = req.body.submit.split("&");
  const recipe = new Recipe(null, smt);

  if (buttonPress == "open") {
    //open the recipe for viewing
    let successful = await recipe.fetchRecipe(session.user.id);
    if (successful) {
      session.recipe = recipe;
      session.returnPage = "/uploadedRecipes";
      return res.redirect("/recipe");
    }
  } else if (buttonPress == "delete") {
    if (!checkPerms(req, res, 2)) return;
    //delete the recipe
    const result = await recipe.delRecipe();
    if (!result) console.log("delete error");
  }
  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
