//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
const { Category } = require("../../models/category");
//[Aid]
const { offloadFields } = require("../../utils");
const { defSearch, sorts } = require("../../jsons/views.json");
var filters;

router.get("/home", async (req, res) => {
  const session = req.session;
  const recipes = await Recipe.fetchRecipes(session.search || defSearch);
  session.recipe = null;
  if (!filters)
    filters = {
      allergy: await Category.fetchCategories("allergy", true),
      diet: await Category.fetchCategories("diet", true),
    };
  res.render("template", {
    pageTitle: "Dishcraft - Homepage",
    page: "home",
    recipes: recipes,
    search: session.search || defSearch,
    sorts: sorts,
    filters: filters,
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
    session.returnPage = "/home";
    return res.redirect("/recipe");
  }
  return res.redirect(req.get("referer"));
});
//look up recipe by name, author, or ingredient
router.post("/search", async (req, res) => {
  const session = req.session;
  const buttonPress = req.body.submit;
  if (!session.search) session.search = defSearch;
  switch (buttonPress) {
    case "home":
      session.search = defSearch;
      break;
    case "search":
      if (req.body.search) session.search.term = req.body.search.toLowerCase();
      else session.search.term = "";
      break;
    case "sortApply":
      session.search.sort = offloadFields(["category", "dir"], null, req.body);
      break;
    case "sortReset":
      session.search.sort = null;
      break;
    case "filterApply":
      if (Array.isArray(req.body.filter)) session.search.filter = req.body.filter;
      else session.search.filter = req.body.filter ? [req.body.filter] : null;
      break;
    case "filterReset":
      session.search.filter = null;
      break;
    default:
      return res.redirect(req.get("referer"));
  }
  //console.log(req.body);
  return res.redirect("/home");
});

/*[ External access ]*/
module.exports = router;
