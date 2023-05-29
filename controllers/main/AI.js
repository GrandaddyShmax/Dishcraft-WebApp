//[Import]
const express = require("express");
const router = express.Router();
const { schemas } = require("../../schemas/paths");
//[Classes]
const { Recipe } = require("../../models/recipe");
const { Ingredient } = require("../../models/ingredient");
const { Category } = require("../../models/category");
const { Expert } = require("../../models/user");
//[API]
const { getAssistant, parseAssToRecipe, parseAssToRecipeTest, sendMessage } = require("../../API/ai");
//disable AI *in database* to avoid accidental exceeding request limits during testing
const msg = "A.I. is currently disabled!";
//[Aid]
const { checkPerms, offloadFields, handleIngAdding, resetCategories } = require("../../utils");
const { defNutritions, defIngs, units } = require("../../jsons/views.json");
const prompt = require("../../jsons/prompt.json");

//display assistant page
router.get("/assistant", async (req, res) => {
  if (!checkPerms(req, res)) return;
  const sess = req.session;
  const access = await schemas.AIAccess.findOne({});

  //premium plus cleanup service
  let error = "";
  if (sess.clearAiFlag) {
    sess.nutritions = "";
    sess.allergies = "";
    sess.alert = "";
    sess.recipeTrue = false;
  }
  if (sess.errorIngred != "") {
    error = sess.errorIngred;
    sess.errorIngred = "";
  }
  if (!sess.recipe || !sess.recipe.ai) {
    sess.recipe = {
      ai: true,
      recipeName: "AI Chef",
      recipeImages: {},
      imagesData: {},
      ingredients: [defIngs],
      extra: "",
      instructions: "",
      categories: {
        spicy: false,
        sweet: false,
        salad: false,
        meat: false,
        soup: false,
        dairy: false,
        pastry: false,
        fish: false,
        grill: false,
      },
    };
    if (access.disabled) {
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
    nutritions: sess.nutritions || "",
    allergies: sess.allergies || "",
    recipeTrue: sess.recipeTrue || false,
    alert: sess.alert || "",
  });
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  if (!checkPerms(req, res)) return;
  const sess = req.session;
  var recipe = sess.recipe;
  const access = await schemas.AIAccess.findOne({});
  const [buttonPress, index] = req.body.submit.split("&");
  if (buttonPress != "generate") {
    resetCategories(sess.recipe, req);
  }
  offloadFields(["extra", "instructions", "color"], sess.recipe, req.body);
  //Update ingredients & "addmore" & "remove"
  if (handleIngAdding(req, res, buttonPress, index)) {
    return res.redirect(req.get("referer"));
  }
  //Generate recipe
  if (buttonPress == "generate") {
    //check ingredients exist in foodAPI:
    if (!access.disabled) {
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
      const promptText = prompt.text.join("\n") + "\n" + Recipe.parseIngredients(recipe.ingredients, true);
      //code to talk with ai (can be disabled to avoid exceeding request limits)
      if (access.disabled) {
        req.session.recipe = parseAssToRecipeTest();
      } else {
        if (access.lib == "3") {
          req.session.recipe = await sendMessage(promptText, recipe);
        } else {
          const assistant = getAssistant();
          const response = await assistant.sendMessage(promptText);
          req.session.recipe = parseAssToRecipe(response, recipe);
        }
      }
      //calculate nutritional value & check allergies:
      const ings = [...req.session.recipe.ingredients, ...req.session.recipe.ingredients2];
      req.session.allergies = await Category.findCategory(ings, "allergy", true);
      req.session.nutritions = await Ingredient.calcRecipeNutVal(ings, true);
      req.session.recipe.nutritions = req.session.nutritions; //taking the nutritions into the recipe
      resetCategories(sess.recipe);
      sess.clearAiFlag = false;
      sess.recipeTrue = true;
      //alert the unaware expert user about his unhealthy way of life
      if (sess.user.role > 1) {
        const user = new Expert(null, sess.user.id);
        await user.fetchUser();
        await user.updateLatest(req.session.nutritions);
        sess.alert = user.checkWarnings();
      }
      //add AI recipe to DB after generate
      let ing2 = recipe.ingredients2;
      let ing1 = recipe.ingredients.concat(ing2);
      recipe.aiMade = true; //made by AI
      recipe.display = false; //hide the recipe until publish
      recipe.userID = sess.user.id; //userID
      const tempRecipe = { userID: sess.user.id, ingredients: ings, aiMade: true, display: false };
      let AiRecipe = new Recipe(tempRecipe);
      // add the recipe to the db
      let { success, msg, id } = await AiRecipe.addRecipe();
      recipe.id = id;
    } catch (error) {
      console.log(error);
      sess.recipe.extra = "Failed to generate recipe, please try again later.";
      sess.recipe.instructions = "Failed to generate recipe, please try again later.";
    }
  }
  if (buttonPress == "publish") {
    //publish the recipe with the updates
    var images = [];
    if (recipe.imagesData) {
      if (recipe.imagesData.img1) images.push(recipe.imagesData.img1);
      if (recipe.imagesData.img2) images.push(recipe.imagesData.img2);
      if (recipe.imagesData.img3) images.push(recipe.imagesData.img3);
    }
    for (var i = images.length; i < 3; i++) images.push({ url: "" });
    recipe.recipeImages = images;
    recipe.hideRating = req.body.hideRating === "on" ? true : false;

    let AiRecipe = new Recipe(recipe);
    // add the recipe to the db
    let success = await AiRecipe.updateRecipe();
    sess.recipeTrue = false;
    if (success) return res.redirect("/home");
  }
  return res.redirect(req.get("referer"));
});

//[External access]
module.exports = router;
