/*[ Import ]*/
const express = require("express");
const router = express.Router();

router.get("/admin/managecategories", async (req, res) => {
  const session = req.session;
  const temp = [
    {categoryName: "Gluten-Free", ingredient: ["Flour", "Bread", "Pasta"]},
    {categoryName: "Dairy-Free", ingredient: ["Milk", "Cheese", "Yogurt"]},
    {categoryName: "Vegan", ingredient: ["Meat", "Eggs"]},
    {categoryName: "Vegetarian", ingredient: ["Meat", "Eggs", "Cheese"]},
               ];
  res.render("template", {
    pageTitle: "Dishcraft - Manage Categories",
    page: "A_manageCategories",
    user: session.user || null,
    categories: temp,
    categoryIndex: session.categoryIndex || 0,
  });
});

router.post("/admin/managecategories", async (req, res) => {
  const session = req.session;
  
});

/*[ External access ]*/
module.exports = router;