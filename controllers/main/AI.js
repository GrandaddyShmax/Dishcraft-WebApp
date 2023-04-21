/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");
const { offloadFields } = require("../../utils");
const { defIngs, units } = require("../../jsons/ingredients.json");
const { getAssistant, parseAssToRecipe, parseAssToRecipeTest } = require("../../API/ai");
const prompt = require("../../jsons/prompt.json");

//display assistant page
router.get("/assistant", async (req, res) => {
  const sess = req.session;
  if (!sess.recipe || !sess.recipe.ai) {
    sess.recipe = {
      ai: true,
      recipeName: "Recipe name",
      ingredients: [defIngs],
      extra: "",
      instructions: "",
    };
  }
  if (sess.errorIngred != "") sess.errorIngred = "";
  if (sess.recipe.ingredients.length == 0) sess.recipe.ingredients = [defIngs];
  res.render("template", {
    pageTitle: "Dishcraft - Assistant",
    page: "assistant",
    units: units,
    recipe: sess.recipe || null,
    user: sess.user || null,
    errorIngred: sess.errorIngred || ""
  });
  if (sess.errorIngred != "") sess.errorIngred = "";
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  const sess = req.session;
  var recipe = sess.recipe;
  const [buttonPress, index] = req.body.submit.split("&");
  var list = [];
  offloadFields(["extra", "instructions"], sess.recipe, req.body);
  recipe.recipeName = recipe.recipeName || "Recipe Name";
  const { amount, unit, name } = req.body;
  if (Array.isArray(name)) for (var i = 0; i < name.length; i++) list.push({ amount: amount[i], unit: unit[i], name: name[i] });
  else list.push({ amount: amount, unit: unit, name: name });
  recipe.ingredients = list;
  //add ingredient
  if (buttonPress == "addmore") {
    recipe.ingredients.push(defIngs);
  } //remove ingredient
  else if (buttonPress == "remove") {
    recipe.ingredients.splice(index, 1);
  } else if (buttonPress == "generate") {
    //check ingredients exist in foodAPI:
    let status;
    for (let ingred of recipe.ingredients) {
      status = await checkIgredient(ingred.name);
      if (!status) {
        sess.errorIngred = "Ingredient " + ingred.name + " not found.";
        return res.redirect(req.get("referer"));
      }
    }
    //parse prompt:
    const testMsg = prompt.text.join("\n") + "\n" + Recipe.parseIngredients(recipe.ingredients, true);
    console.log(testMsg);
    //recipe.extra = "No extra ingredients!";
    //recipe.instructions = "temporary A.I. response";
    req.session.recipe = parseAssToRecipeTest();
    return res.redirect(req.get("referer"));

    //code to talk with ai (not accessible atm to avoid exceeding request limits)
    const assistant = getAssistant();
    const response = await assistant.sendMessage(testMsg);
    console.log(response);
    req.session.recipe = parseAssToRecipe(response, recipe);
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
