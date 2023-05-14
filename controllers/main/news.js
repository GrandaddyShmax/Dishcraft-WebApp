//[Import]
const express = require("express");
const router = express.Router();
//[Clases]

router.get("/news", async (req, res) => {
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - News & Updates",
    page: "news",
    user: session.user || null,
    hideSearch: true,
  });
});

/*[ External access ]*/
module.exports = router;