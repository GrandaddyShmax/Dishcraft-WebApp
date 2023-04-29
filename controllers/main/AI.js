//[Import]
const express = require("express");
const router = express.Router();
//[Clases]
const { Recipe } = require("../../models/recipe");
const { Ingredient } = require("../../models/ingredient");
const { Category } = require("../../models/category");
//[API]
const { getAssistant, parseAssToRecipe, parseAssToRecipeTest } = require("../../API/ai");
//disable AI to avoid accidental exceeding request limits during testing
const disabled = false;
const msg = "A.I. is currently disabled!";
//[Aid]
const { offloadFields } = require("../../utils");
const { defNutritions, defIngs, units } = require("../../jsons/views.json");
const prompt = require("../../jsons/prompt.json");

//display assistant page
router.get("/assistant", async (req, res) => {
  const sess = req.session;

  //premium cleanup service
  let nutritions = defNutritions, //default values in jsons/views.json
    allergies = "",
    error = "";
  if (sess.flag) {
    sess.flag = false;
    nutritions = sess.nutritions;
    sess.nutritions = defNutritions;
    allergies = sess.allergies;
    sess.allergies = "";
  }
  if (sess.errorIngred != "") {
    error = sess.errorIngred;
    sess.errorIngred = "";
  }

  if (!sess.recipe || !sess.recipe.ai) {
    sess.recipe = { ai: true, recipeName: "Recipe name", ingredients: [defIngs], extra: "", instructions: "" };
    if (disabled) {
      sess.recipe.extra = msg;
      sess.recipe.instructions = msg;
    }
  }
  if (sess.recipe.ingredients.length == 0) sess.recipe.ingredients = [defIngs];
  res.render("template", {
    pageTitle: "Dishcraft - Assistant",
    page: "assistant",
    units: units,
    recipe: sess.recipe || null,
    user: sess.user || null,
    errorIngred: error,
    nutritions: nutritions,
    allergies: allergies,
  });
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  const sess = req.session;
  var recipe = sess.recipe;
  const [buttonPress, index] = req.body.submit.split("&");
  var list = [];
  offloadFields(["extra", "instructions"], sess.recipe, req.body);
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
      status = await Ingredient.checkIngredient(ingred.name);
      if (!status) {
        sess.errorIngred = "Ingredient " + ingred.name + " not found.";
        return res.redirect(req.get("referer"));
      }
    }
    try {
      //parse prompt:
      const testMsg = prompt.text.join("\n") + "\n" + Recipe.parseIngredients(recipe.ingredients, true);
      console.log(recipe.ingredients);

      //code to talk with ai (can be disabled to avoid exceeding request limits)
      if (disabled) {
        req.session.recipe = parseAssToRecipeTest();
      } else {
        const assistant = getAssistant();
        const response = await assistant.sendMessage(testMsg);
        console.log(response);
        req.session.recipe = parseAssToRecipe(response, recipe);
      }

      //calculate nutritional value & check allergies:
      req.session.allergies = await Category.findCategory(req.session.recipe.ingredients, "allergy", true);
      req.session.nutritions = await Ingredient.calcRecipeNutVal(req.session.recipe.ingredients, true);
      sess.flag = true;
    } catch (error) {
      console.log(error);
      sess.recipe.extra = "Failed to generate recipe, please try again later.";
      sess.recipe.instructions = "Failed to generate recipe, please try again later.";
    }
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
