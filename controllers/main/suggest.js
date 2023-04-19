/*[ Import ]*/
const express = require("express");
const router = express.Router();
const { Suggestion } = require("../../models/suggestion");


router.get("/suggest", async (req, res) => {
  var session = req.session;
  res.render("template", {
    pageTitle: "Dishcraft - Suggest Ingredient",
    page: "suggest",
    user: session.user || null,
  });
});

//post
router.post("/suggest", async (req, res) => {
  //console.log("testmsg");
  var session = req.session;
  const suggestionData= req.body;
  var suggestion = new Suggestion(suggestionData);
  let {success,msg} = await suggestion.addSuggestion();
  console.log(req.body);
  if(success){
    //console.log(msg);
    return res.redirect("/home");
  }
  else{
    console.log(msg);
    return res.redirect(req.get("referer"));
    //return res.redirect("/home");
  }
  });



/*[ External access ]*/
module.exports = router;