/*[ Import ]*/
const express = require("express");
const router = express.Router();

//display assistant page
router.get("/assistant", async (req, res) => {
  const sess = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Assistant",
    page: "assistant",
    ingredients: sess.ingredients && sess.ingredients.length > 0 ? sess.ingredients : [],
    recipe: sess.recipe || null,
  });
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  const sess = req.session;
  const [buttonPress, index] = req.body.submit.split("&");
  if (buttonPress == "addmore") {
    //update fields to match fields in ejs file
    //const { amount, units, name } = req.body;
    //sess.ingredients.push({ amount, units, name });
  } else if (buttonPress == "remove") sess.ingredients = sess.ingredients.splice(index, 1);
  else if (buttonPress == "run") {
    //code to talk with ai
    //sess.recipe = whataver ai said
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
