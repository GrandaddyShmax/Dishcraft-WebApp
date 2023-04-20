/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");

//get
router.get("/createRecipe", async (req, res) => {
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Recipe Craft",
    page: "createRecipe",
    user: session.user || null,
  });
});


//post
router.post("/createRecipe", async (req, res) => {
  var session = req.session;
  const recipeData =req.body;
  var recipe = new Recipe (recipeData);
  let {success,msg} = await recipe.addRecipe();

  if(success){
    return res.redirect("/home");
  }

  else{
    console.log(msg);
    return res.redirect(req.get("referer"));
  }
});


/*[ External access ]*/
module.exports = router;