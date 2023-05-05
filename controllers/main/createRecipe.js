//[Import]
const express = require("express");
const router = express.Router();
const fs = require("fs"); //accessing other folders & files
const path = require("path"); //safe path creating
const { uploadImage } = require("../../index");
//[Clases]
const { Ingredient } = require("../../models/ingredient");
const { Recipe } = require("../../models/recipe");
//[Aid]
const { offloadFields } = require("../../utils");
const { defIngs, units } = require("../../jsons/views.json");

//get
router.get("/createRecipe", async (req, res) => {
  const sess = req.session;
  let error = "";
  if (sess.errorIngred != "") {
    error = sess.errorIngred;
    sess.errorIngred = "";
  }
  if (!sess.recipe || !sess.recipe.create) {
    sess.recipe = {
      create: true,
      recipeName: "",
      recipeImages: new Object(),
      imagesData: new Object(),
      ingredients: [defIngs],
      instructions: "",
      color: "original",
    };
  }
  if (sess.recipe.ingredients.length == 0) sess.recipe.ingredients = [defIngs];
  res.render("template", {
    pageTitle: "Dishcraft - Recipe Craft",
    page: "createRecipe",
    units: units,
    user: sess.user || null,
    recipe: sess.recipe,
    errorIngred: error,
  });
});

//post
router.post("/createRecipe", async (req, res) => {
  var sess = req.session;
  var recipe = sess.recipe;
  offloadFields(["recipeName", "instructions", "color"], sess.recipe, req.body);
  //sess.recipe.recipeImages = Recipe.parseImages(sess.recipe.imagesData);
  if (req.body.submit) {
    const [buttonPress, index] = req.body.submit.split("&");
    var list = [];
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
    } //Create and save recipe
    else if (buttonPress == "publish") {
      let status;
      for (let ingred of recipe.ingredients) {
        status = await Ingredient.checkIngredient(ingred.name);
        if (!status) {
          sess.errorIngred = "Ingredient " + ingred.name + " not found.";
          return res.redirect(req.get("referer"));
        }
      }
      var recipeData = offloadFields(["recipeName", "instructions", "color"], this, req.body);
      recipeData.userID = sess.user ? sess.user.id : null;
      recipeData.recipeImages = [recipe.imagesData.img1, recipe.imagesData.img2, recipe.imagesData.img3] || [];
      console.log(recipeData);
      recipeData.ingredients = recipe.ingredients;
      recipeData.nutritions = await Ingredient.calcRecipeNutVal(recipeData.ingredients, false);
      sess.recipe = null;
      recipe = new Recipe(recipeData);
      let { success, msg } = await recipe.addRecipe();
      if (success) return res.redirect("/home");
    }
  }
  return res.redirect(req.get("referer"));
});
//upload image based on input name
router.post("/uploadImage1", uploadImage.single("image1"), async (req, res) => handleImage(req, res, 1));
router.post("/uploadImage2", uploadImage.single("image2"), async (req, res) => handleImage(req, res, 2));
router.post("/uploadImage3", uploadImage.single("image3"), async (req, res) => handleImage(req, res, 3));
function handleImage(req, res, index) {
  var sess = req.session;
  if (req.file) {
    if (!sess.recipe) sess.recipe = new Object();
    if (!sess.recipe.imagesData) sess.recipe.imagesData = new Object();
    const url = path.resolve("./public/images/temp/" + req.file.filename);
    sess.recipe.imagesData["img" + index] = {
      data: fs.readFileSync(url),
      contentType: "image/png",
    };
    sess.recipe.recipeImages["img" + index] = Recipe.parseImage(sess.recipe.imagesData["img" + index]);
    fs.unlinkSync(url);
  }
  return res.redirect(req.get("referer"));
}

/*[ External access ]*/
module.exports = router;
