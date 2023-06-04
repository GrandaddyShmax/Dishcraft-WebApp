//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { Category } = require("../../models/category");
//[API]
const { checkIgredientAPI } = require("../../API/ingred");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

router.get("/admin/managecategories", async (req, res) => {
  if (!checkPerms(req, res, 3)) return;
  const session = req.session;
  const {navbarError, navbarText} = navbarApply(session);
  const categories = await Category.fetchAllCategories();
  delete session.currIngred;
  delete session.indexIngred;
  let error = "";
  if (session.errorIngred != "") {
    error = session.errorIngred;
    session.errorIngred = "";
  }

  res.render("template", {
    pageTitle: "Dishcraft - Manage Categories",
    page: "A_manageCategories",
    user: session.user || null,
    categories: categories,
    categoryIndex: session.categoryIndex || 0,
    errorIngred: error,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText
  });
});

router.post("/admin/managecategories", async (req, res) => {
  if (!checkPerms(req, res, 3)) return;
  const session = req.session;
  const [buttonPress, index, id] = req.body.submit.split("&");
  session.errorIngred = "";

  if (buttonPress === "category") {
    session.categoryIndex = index;
  } else if (buttonPress === "add") {
    let category = new Category(null, id);
    await category.fetchCategory();
    if (!(await checkIgredientAPI(req.body.addInput))) {
      session.errorIngred = "Ingredient " + req.body.addInput + " not found.";
      return res.redirect(req.get("referer"));
    }
    if (category.checkIngredInCategory(req.body.addInput)) {
      session.errorIngred = "Ingredient " + req.body.addInput + " already in this category.";
      return res.redirect(req.get("referer"));
    }
    if (!(await category.addIngredToCategory(req.body.addInput))) {
      console.log("adding ingredient failed miserably!");
    }
  } else if (buttonPress === "remove") {
    let category = new Category(null, id);
    let success = await category.deleteIngredFromCategory(index);
    if (!success) {
      console.log("deleting ingredient failed miserably!");
    }
  }
  return res.redirect("/admin/managecategories");
});

//[External access]
module.exports = router;
