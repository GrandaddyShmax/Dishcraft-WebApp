/*[ Import ]*/
const express = require("express");
const router = express.Router();

router.get("/assistant", async (req, res) => {
  res.render("template", {
    pageTitle: "Dishcraft - Assistant",
    page: "assistant",
  });
});

/*[ External access ]*/
module.exports = router;
