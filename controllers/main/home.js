//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
//[API]
const { offloadFields } = require("../../utils");
const { defSearch, sorts } = require("../../jsons/views.json");

router.get("/home", async (req, res) => {
  const session = req.session;
  const recipes = await Recipe.fetchRecipes(session.search || defSearch);
  session.recipe = null;
  res.render("template", {
    pageTitle: "Dishcraft - Homepage",
    page: "home",
    recipes: recipes,
    search: session.search || defSearch,
    sorts: sorts,
    user: session.user,
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
//look up recipe by name, author, or ingredient
router.post("/search", async (req, res) => {
  const session = req.session;
  const buttonPress = req.body.submit;
  if (!session.search) session.search = defSearch;
  //console.log(req.body);
  switch (buttonPress) {
    case "home":
      session.search = defSearch;
      break;
    case "search":
      session.search.term = req.body.search;
      break;
    case "sortApply":
      console.log("yes");
      session.search.sort = offloadFields(["category", "dir"], null, req.body);
      break;
    case "sortReset":
      session.search.sort = null;
      break;
    default:
      return res.redirect(req.get("referer"));
  }
  return res.redirect("/home");
});

/*[ External access ]*/
module.exports = router;
