/*[ Import ]*/
const express = require("express");
const router = express.Router();
const defIngs = { amount: 0, unit: "Cups", name: "Ingredient" };

//display assistant page
router.get("/assistant", async (req, res) => {
  var session = req.session;
  const sess = req.session;
  if (!sess.ingredients || sess.ingredients.length == 0) sess.ingredients = [defIngs];
  //prettier-ignore
  const units = [ "Cups", "Deciliters", "Galons", "Grams", "Kilograms", "Liters", "Ounces", "Pieces", "Pints", "Pounds", "Quarts", "Tablespoon", "Teaspoon",];
  res.render("template", {
    pageTitle: "Dishcraft - Assistant",
    page: "assistant",
    ingredients: sess.ingredients,
    units: units,
    recipe: sess.recipe || null,
    user: session.user || null,
  });
});

//get ingredients from assistant page
router.post("/assistant", async (req, res) => {
  const sess = req.session;
  const [buttonPress, index] = req.body.submit.split("&");
  var list = [];
  for (var i = 0; i < sess.ingredients.length; i++)
    list.push({ amount: req.body["amount" + i], unit: req.body["unit" + i], name: req.body["name" + i] });
  sess.ingredients = list;
  if (buttonPress == "addmore") {
    sess.ingredients.push(defIngs);
  } else if (buttonPress == "remove") {
    sess.ingredients.splice(index, 1);
  } else if (buttonPress == "generate") {
    //code to talk with ai
    //sess.recipe = whataver ai said
  }
  return res.redirect(req.get("referer"));
});

/*[ External access ]*/
module.exports = router;
