//[Import]
const express = require("express");
const router = express.Router();
const { Ingredient } = require("../../models/ingredient");

router.get("/admin/manageingredients", async (req, res) => {
  const sess = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Manage Ingredients",
    page: "A_manageIngredients",
    user: sess.user || null,
    hideSearch: true,
  });
});

/*[ External access ]*/
module.exports = router;