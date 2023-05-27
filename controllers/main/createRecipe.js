//[Import]
const express = require("express");
const router = express.Router();
const fs = require("fs"); //accessing other folders & files
const path = require("path"); //safe path creating
const { uploadImage } = require("../../index");
//[Classes]
const { Ingredient } = require("../../models/ingredient");
const { Recipe } = require("../../models/recipe");
//[Aid]
const { checkPerms, offloadFields, handleIngAdding, resetCategories } = require("../../utils");
const { defIngs, units } = require("../../jsons/views.json");

//get
router.get("/createRecipe", async (req, res) => {
  if (!checkPerms(req, res)) return;
  const sess = req.session;
  sess.clearAiFlag = true;
  let error = "";
  if (sess.errorIngred != "") {
    error = sess.errorIngred;
    sess.errorIngred = "";
  }
  if (!sess.recipe || !sess.recipe.create) {
    sess.recipe = {
      create: true,
      recipeName: "",
      recipeImages: {},
      imagesData: {},
      ingredients: [defIngs],
      instructions: "",
      color: "original",
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
  if (!checkPerms(req, res)) return;
  var sess = req.session;
  var recipe = sess.recipe;
  resetCategories(sess.recipe, req);
  /*sess.recipe.categories = {
    spicy: req.body.spicy != null,
    sweet: req.body.sweet != null,
    salad: req.body.salad != null,
    meat: req.body.meat != null,
    soup: req.body.soup != null,
    dairy: req.body.dairy != null,
    pastry: req.body.pastry != null,
    fish: req.body.fish != null,
    grill: req.body.grill != null,
  };*/
  offloadFields(["recipeName", "instructions", "color"], sess.recipe, req.body);
  //sess.recipe.recipeImages = Recipe.parseImages(sess.recipe.imagesData);
  if (req.body.submit) {
    const [buttonPress, index] = req.body.submit.split("&");
    //Update ingredients & "addmore" & "remove"
    if (handleIngAdding(req, res, buttonPress, index)) return res.redirect(req.get("referer"));
    //Create and save recipe
    if (buttonPress == "publish") {
      let status;
      for (let ingred of recipe.ingredients) {
        status = await Ingredient.checkIngredient(ingred.name);
        if (!status) {
          sess.errorIngred = "Ingredient " + ingred.name + " not found.";
          return res.redirect(req.get("referer"));
        }
      }
      var recipeData = offloadFields(["recipeName", "instructions", "color", "hideRating"], null, req.body);
      recipeData.userID = sess.user ? sess.user.id : null;
      var images = [];
      if (recipe.imagesData) {
        if (recipe.imagesData.img1) images.push(recipe.imagesData.img1);
        if (recipe.imagesData.img2) images.push(recipe.imagesData.img2);
        if (recipe.imagesData.img3) images.push(recipe.imagesData.img3);
      }
      for (var i = images.length; i < 3; i++) images.push({ url: "" });
      recipeData.recipeImages = images;
      recipeData.ingredients = recipe.ingredients;
      recipeData.nutritions = await Ingredient.calcRecipeNutVal(recipeData.ingredients, false);
      recipeData.categories = recipe.categories;
      recipeData.hideRating = recipeData.hideRating === "on" ? true : false;
      recipeData.display = true;
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
  if (!sess.recipe) sess.recipe = {};
  if (sess.recipe.create) {
    offloadFields(["recipeName", "instructions", "color"], sess.recipe, req.body);
    //Update ingredients & "addmore" & "remove"
    handleIngAdding(req, res);
  }
  resetCategories(sess.recipe, req);
  /*sess.recipe.categories = {
    spicy: req.body.spicy != null,
    sweet: req.body.sweet != null,
    salad: req.body.salad != null,
    meat: req.body.meat != null,
    soup: req.body.soup != null,
    dairy: req.body.dairy != null,
    pastry: req.body.pastry != null,
    fish: req.body.fish != null,
    grill: req.body.grill != null,
  };*/
  if (req.file) {
    if (!sess.recipe.imagesData) sess.recipe.imagesData = {};
    const url = path.resolve("./public/images/temp/" + req.file.filename);
    sess.recipe.imagesData["img" + index] = {
      data: fs.readFileSync(url),
      contentType: "image/png",
    };
    if (!sess.recipe.recipeImages) sess.recipe.recipeImages = {};
    sess.recipe.recipeImages["img" + index] = Recipe.parseImage(sess.recipe.imagesData["img" + index]);
    fs.unlinkSync(url);
  }
  return res.redirect(req.get("referer"));
}

//[External access]
module.exports = router;
