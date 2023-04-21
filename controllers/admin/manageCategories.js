/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Category } = require("../../models/category")

router.get("/admin/managecategories", async (req, res) => {
  const session = req.session;
  const categories = await Category.fetchAllCategories();
  res.render("template", {
    pageTitle: "Dishcraft - Manage Categories",
    page: "A_manageCategories",
    user: session.user || null,
    categories: categories,
    categoryIndex: session.categoryIndex || 0,
    errorIngred: session.errorIngred || null
  });
  if (session.errorIngred != null) session.errorIngred = null;
});

router.post("/admin/managecategories", async (req, res) => {
  const session = req.session;
  const [buttonPress, index, id] = req.body.submit.split("&");
  if (buttonPress === 'category') {
    session.categoryIndex = index;
  }
  else if (buttonPress === 'add') {
    let category = new Category(null, id);
    //let status;
    //for (let ingred of recipe.ingredients) {
    //  status = await checkIgredient(ingred.name);
    //  if (!status) {
    //    session.errorIngred = "Ingredient " + ingred.name + " not found.";
    //    return res.redirect(req.get("referer"));
    //  }
    //}
    let success = await category.addIngredToCategory(req.body.addInput);
    if(!success)
    {
      console.log("adding ingedient failed miserably!");
    }
    console.log(session.errorIngred);
  }
  else if (buttonPress === 'remove') {
    let category = new Category(null, id);
    let success = await category.deleteIngredFromCategory(index);
    if(!success)
    {
      console.log("deleting ingedient failed miserably!")
    }
  }
  return res.redirect("/admin/managecategories");
});

/*[ External access ]*/
module.exports = router;