/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Recipe } = require("../../models/recipe");
const { offloadFields } = require("../../utils");
const { defIngs, units } = require("../../API/constants.json");
const { getAssistant } = require("../../API/ai");
const prompt = require("../../API/prompt.json");

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
  res.render("template", {
    pageTitle: "Dishcraft - Assistant",
    page: "assistant",
    units: units,
    recipe: sess.recipe || null,
    user: sess.user || null,
  });
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  const sess = req.session;
  var recipe = sess.recipe;
  const [buttonPress, index] = req.body.submit.split("&");
  var list = [];
  offloadFields(["recipeName", "extra", "instructions"], sess.recipe, req.body);
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

    //parse prompt:
    const text = prompt.text.join("\n") + "\n" + Recipe.parseIngredients(recipe.ingredients, true);
    console.log(text);
    recipe.extra = "No extra ingredients!";
    recipe.instructions = "temporary A.I. response";
    return res.redirect(req.get("referer"));
    //code to talk with ai:
    const assistant = getAssistant();
    const testMsg = ""; //[parse sess.recipe + requst into proper request]
    const response = await assistant.sendMessage(testMsg);
    console.log(response);
    //parse response
    //recipe.instructions = parsedResponse
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
