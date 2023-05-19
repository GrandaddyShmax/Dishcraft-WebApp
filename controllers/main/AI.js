//[Import]
const express = require("express");
const router = express.Router();
const { schemas } = require("../../schemas/paths");
//[Clases]
const { Recipe } = require("../../models/recipe");
const { Ingredient } = require("../../models/ingredient");
const { Category } = require("../../models/category");
const { Expert } = require("../../models/user");
//[API]
const { getAssistant, parseAssToRecipe, parseAssToRecipeTest } = require("../../API/ai");
//disable AI *in database* to avoid accidental exceeding request limits during testing
const msg = "A.I. is currently disabled!";
//[Aid]
const { offloadFields, handleIngAdding } = require("../../utils");
const { defNutritions, defIngs, units } = require("../../jsons/views.json");
const prompt = require("../../jsons/prompt.json");

//display assistant page
router.get("/assistant", async (req, res) => {
  const sess = req.session;
  const access = await schemas.AIAccess.findOne({});

  //premium plus cleanup service
  //let nutritions = defNutritions; //default values in jsons/views.json
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
      categories: {spicy: false, sweet: false, salad: false, meat: false, soup: false, dairy: false, 
        pastry: false, fish: false, grill: false}
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
  const sess = req.session;
  if (!sess.user) return res.redirect("/");
  var recipe = sess.recipe;
  const access = await schemas.AIAccess.findOne({});
  const [buttonPress, index] = req.body.submit.split("&");
  if (buttonPress != "generate") {
    sess.recipe.categories = { spicy: req.body.spicy != null, sweet: req.body.sweet != null, 
      salad: req.body.salad != null, meat: req.body.meat != null, soup: req.body.soup != null, 
      dairy: req.body.dairy != null, pastry: req.body.pastry != null, fish: req.body.fish != null, 
      grill: req.body.grill != null};
  }
  offloadFields(["extra", "instructions"], sess.recipe, req.body);
  //Update ingredients & "addmore" & "remove"
  if (handleIngAdding(req, res, buttonPress, index)) { return res.redirect(req.get("referer")); }
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
      const testMsg = prompt.text.join("\n") + "\n" + Recipe.parseIngredients(recipe.ingredients, true);
      //code to talk with ai (can be disabled to avoid exceeding request limits)
      if (access.disabled) {
        req.session.recipe = parseAssToRecipeTest();
      } else {
        const assistant = getAssistant();
        const response = await assistant.sendMessage(testMsg);
        //console.log(response);
        req.session.recipe = parseAssToRecipe(response, recipe);
      }

      //calculate nutritional value & check allergies:
      const ings = [...req.session.recipe.ingredients, ...req.session.recipe.ingredients2];
      req.session.allergies = await Category.findCategory(ings, "allergy", true);
      req.session.nutritions = await Ingredient.calcRecipeNutVal(ings, true);
      req.session.recipe.nutritions = req.session.nutritions; //taking the nutritions into the recipe
      sess.recipe.categories = {spicy: false, sweet: false, salad: false, meat: false, soup: false, dairy: false, 
        pastry: false, fish: false, grill: false};
      sess.clearAiFlag = false;
      sess.recipeTrue = true;
      //alert the unaware expert user about his unhealthy way of life
      if (sess.user.role > 1) {
        const user = new Expert(null, sess.user.id);
        user.latest = sess.user.latest;
        user.updateLatest(req.session.nutritions);
        sess.alert = user.checkWarnings();
      }
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
    }
    for (var i = images.length; i < 3; i++) images.push({ url: "" });
    recipe.recipeImages = images;
    let AiRecipe = new Recipe(recipe);
    // add the recipe to the db
    let { success, msg } = await AiRecipe.addRecipe();
    sess.recipeTrue = false;
    if (success) return res.redirect("/home");
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
