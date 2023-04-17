/*[ Import ]*/
const express = require("express");
const router = express.Router();

router.get("/recipeupload", async (req, res) => {
  res.render("template", {
    pageTitle: "Dishcraft - Recipe Craft",
    page: "createRecipe",
  });
});

/*[ External access ]*/
module.exports = router;