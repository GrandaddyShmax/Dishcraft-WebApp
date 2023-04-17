/*[ Import ]*/
const express = require("express");
const router = express.Router();

router.get("/recipe", async (req, res) => {
  res.render("template", {
    pageTitle: "Dishcraft - Recipe View",
    page: "recipe",
  });
});

/*[ External access ]*/
module.exports = router;