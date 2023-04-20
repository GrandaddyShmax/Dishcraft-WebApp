/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");

//get
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

//post
router.post("/admin/managerecipes", async (req, res) => {
  const session = req.session;
  const recipes = await Recipe.fetchRecipes(session.filter || null, session.sort || null);
  const delRec = req.body.submit;
  const fetchRec = new Recipe(null,delRec);
  console.log (delRec);
  const result = fetchRec.delRecipe();
  /*if (result){
    console.log("delete success");

  }
  else{
    console.log("delete error");
    
  }*/

  return res.redirect(req.get("referer"));
});


/*[ External access ]*/
module.exports = router;