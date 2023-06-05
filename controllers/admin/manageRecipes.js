//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { Recipe } = require("../../models/recipe");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

//get
router.get("/admin/managerecipes", async (req, res) => {
  if (!checkPerms(req, res, 3)) return;
  const session = req.session;
  const { navbarError, navbarText } = navbarApply(session);
  const recipes = await Recipe.fetchRecipes(session.filter || null, session.sort || null);
  delete session.currIngred;
  delete session.indexIngred;
  delete session.categoryIndex;
  delete session.errorIngred;
  res.render("template", {
    pageTitle: "Dishcraft - Manage Recipes",
    page: "A_manageRecipes",
    recipes: recipes,
    user: session.user || null,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText,
  });
});

//post
router.post("/admin/managerecipes", async (req, res) => {
  if (!checkPerms(req, res, 3)) return;
  const delRec = req.body.submit;
  const fetchRec = new Recipe(null, delRec);
  const result = await fetchRec.delRecipe();
  if (!result) console.log("delete error");
  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
