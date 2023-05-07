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
const disabled = true;
const msg = "A.I. is currently disabled!";
//[Aid]
const { offloadFields, handleIngAdding } = require("../../utils");
const { defNutritions, defIngs, units } = require("../../jsons/views.json");
const prompt = require("../../jsons/prompt.json");
const recipe = require("../../schemas/recipe");
`1`;
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
    sess.recipe = {
      ai: true,
      recipeName: "Recipe name",
      recipeImages: new Object(),
      imagesData: new Object(),
      ingredients: [defIngs],
      extra: "",
      instructions: "",
    };
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
    recipeTrue: sess.recipeTrue || false,
  });
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  const sess = req.session;
  var recipe = sess.recipe;
  const [buttonPress, index] = req.body.submit.split("&");
  offloadFields(["extra", "instructions"], sess.recipe, req.body);
  //Update ingredients & "addmore" & "remove"
  if (handleIngAdding(req, res, buttonPress, index)) return res.redirect(req.get("referer"));
  //Generate recipe
  if (buttonPress == "generate") {
    //check ingredients exist in foodAPI:
    if (!disabled) {
      let status;
      for (let ingred of recipe.ingredients) {
        status = await Ingredient.checkIngredient(ingred.name);
        if (!status) {
          sess.errorIngred = "Ingredient " + ingred.name + " not found.";
          return res.redirect(req.get("referer"));
        }
      }
    }
    try {
      //parse prompt:
      const testMsg = prompt.text.join("\n") + "\n" + Recipe.parseIngredients(recipe.ingredients, true);
      //console.log(recipe.ingredients);

      //code to talk with ai (can be disabled to avoid exceeding request limits)
      if (disabled) {
        req.session.recipe = parseAssToRecipeTest();
      } else {
        const assistant = getAssistant();
        const response = await assistant.sendMessage(testMsg);
        //console.log(response);
        req.session.recipe = parseAssToRecipe(response, recipe);
      }

      //calculate nutritional value & check allergies:
      req.session.allergies = await Category.findCategory(req.session.recipe.ingredients, "allergy", true);
      req.session.nutritions = await Ingredient.calcRecipeNutVal(req.session.recipe.ingredients, true);
      req.session.recipe.nutritions = req.session.nutritions; //taking the nutritions into the recipe
      sess.flag = true;
      sess.recipeTrue = true;
    } catch (error) {
      console.log(error);
      sess.recipe.extra = "Failed to generate recipe, please try again later.";
      sess.recipe.instructions = "Failed to generate recipe, please try again later.";
    }
  }
  if (buttonPress == "publish") {
    //publish the recipe
    let ing2 = recipe.ingredients2;
    let ing1 = recipe.ingredients.concat(ing2);
    recipe.aiMade = true; //made by AI
    recipe.userID = sess.user.id; //userID
    recipe.ingredients = ing1;
    var images = [];
    if (recipe.imagesData) {
      if (recipe.imagesData.img1) images.push(recipe.imagesData.img1);
      if (recipe.imagesData.img2) images.push(recipe.imagesData.img2);
      if (recipe.imagesData.img3) images.push(recipe.imagesData.img3);
      for (var i = images.length; i < 3; i++) images.push({ url: "" });
    }
    recipe.recipeImages = images;
    let AiRecipe = new Recipe(recipe);
    // add the recipe to the db
    let { success, msg } = await AiRecipe.addRecipe();
    if (success) return res.redirect("/home");
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
