/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");
const { offloadFields } = require("../../utils");
const defIngs = { amount: 0, unit: "Cups", name: "" };

//get
router.get("/createRecipe", async (req, res) => {
  const sess = req.session;
  if (!sess.ingredients || sess.ingredients.length == 0) sess.ingredients = [defIngs];
  //prettier-ignore
  const units = [ "Cups", "Deciliters", "Galons", "Grams", "Kilograms", "Liters", "Ounces", "Pieces", "Pints", "Pounds", "Quarts", "Tablespoon", "Teaspoon",];
  res.render("template", {
    pageTitle: "Dishcraft - Recipe Craft",
    page: "createRecipe",
    ingredients: sess.ingredients,
    units: units,
    user: session.user || null,
  });
});

//post
router.post("/createRecipe", async (req, res) => {
  var sess = req.session;
  const [buttonPress, index] = req.body.submit.split("&");
  var list = [];
  for (var i = 0; i < sess.ingredients.length; i++)
    list.push({ amount: req.body["amount" + i], unit: req.body["unit" + i], name: req.body["name" + i] });
  sess.ingredients = list;
  if (buttonPress == "addmore") {
    sess.ingredients.push(defIngs);
    return res.redirect(req.get("referer"));
  } else if (buttonPress == "remove") {
    sess.ingredients.splice(index, 1);
    return res.redirect(req.get("referer"));
  } else if (buttonPress == "publish") {
    var recipeData = offloadFields(["recipeName", "recipeImages", "instructions", "color"], this, req.body);
    recipeData.ingredients = sess.ingredients;
    var recipe = new Recipe(recipeData);
    let { success, msg } = await recipe.addRecipe();
    if (success) return res.redirect("/home");
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
