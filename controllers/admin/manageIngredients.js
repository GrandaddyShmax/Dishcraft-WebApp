//[Import]
const express = require("express");
const router = express.Router();
const { Ingredient } = require("../../models/ingredient");

router.get("/admin/manageingredients", async (req, res) => {
  const sess = req.session;
  const ingredients = await Ingredient.fetchAllIngredients();
  var currIngred,
    index = -1,
    error = "";
  if (sess.index) {
    index = sess.index;
    sess.index = 0;
  }
  if (sess.error != "") {
    error = sess.error;
    sess.error = "";
  }
  if (index == -1 || ingredients.length == 0) {
    currIngred = { name: "", energy: 0, fattyAcids: 0, sodium: 0, sugar: 0, protein: 0, totalWeight: 0 };
  } else {
    currIngred = ingredients[index];
  }
  res.render("template", {
    pageTitle: "Dishcraft - Manage Ingredients",
    page: "A_manageIngredients",
    user: sess.user || null,
    ingredients: ingredients || [],
    currIngred: currIngred,
    indexIngred: index,
    error: error,
    hideSearch: true,
  });
});

router.post("/admin/manageingredients", async (req, res) => {
  const sess = req.session;
  const [buttonPress, index] = req.body.submit.split("&");

  if (buttonPress === "ingred") {
    sess.index = index;
  } else if (buttonPress === "apply") {
    if (req.body.name === "") {
      sess.error = "Enter ingredient name";
      return res.redirect("/admin/manageingredients");
    }
    const ingredients = await Ingredient.fetchAllIngredients();
    let ingred;
    if (index == -1) {
      ingred = await Ingredient.fetchIngredient(req.body.name);
      if (!ingred) {
        ingred = new Ingredient(req.body);
        if (!(await ingred.addIngredient())) {
          sess.error = "Failed to save ingredient";
        }
      } else {
        if (!(await ingred.updateIngredient(req.body))) {
          sess.error = "Failed to update ingredient";
        }
      }
    } else {
      ingred = new Ingredient(ingredients[index]);
      if (!(await ingred.updateIngredient(req.body))) {
        sess.error = "Failed to update ingredient";
      }
    }
    await Ingredient.updateRecContainsIngred(req.body.name, false);
  } else if (buttonPress === "remove") {
    const ingredients = await Ingredient.fetchAllIngredients();
    if (index == -1) {
      if (ingredients.length == 0) {
        sess.error = "There is nothing to remove";
      } else {
        sess.error = "Choose ingredient to remove";
      }
      sess.index = index;
    } else {
      ingred = new Ingredient(ingredients[index]);
      ingred.deleteIngredient();
    }
    await Ingredient.updateRecContainsIngred(req.body.name, true);
  }
  return res.redirect("/admin/manageingredients");
});

/*[ External access ]*/
module.exports = router;
