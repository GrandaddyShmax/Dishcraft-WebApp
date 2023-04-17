/*[ Import ]*/
const express = require("express");
const router = express.Router();
const schemas = require("../../schemas/paths");

router.get("/home", async (req, res) => {
  res.render("template", {
    pageTitle: "Dishcraft - Homepage",
    page: "home",
  });
});

/*[ External access ]*/
module.exports = router;
