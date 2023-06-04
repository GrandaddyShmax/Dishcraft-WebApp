//[Import]
const express = require("express");
const router = express.Router();
//[Classes]
const { News } = require("../../models/news");
//[Aid]
const { checkPerms, navbarApply } = require("../../utils");

router.get("/news", async (req, res) => {
  if (!checkPerms(req, res)) return;
  var session = req.session;
  const {navbarError, navbarText} = navbarApply(session);
  const allNews = await News.fetchAllNews();
  res.render("template", {
    pageTitle: "Dishcraft - News & Updates",
    page: "news",
    user: session.user || null,
    allNews: allNews,
    hideSearch: true,
    navbarError: navbarError,
    navbarText: navbarText
  });
});

router.post("/news", async (req, res) => {
  if (!checkPerms(req, res, 2)) return;
  var session = req.session;
  const newsData = req.body;
  newsData.userId = session.user.id;
  const [buttonPress, index] = req.body.submit.split("&");
  const allNews = await News.fetchAllNews();
  var news;

  if (buttonPress == "add") {
    news = new News(newsData);
    const { success, msg } = await news.addNews();
    if (!success) return res.redirect(req.get("referer"));
  } else if (buttonPress == "delete") {
    news = new News(allNews[index]);
    success = await news.deleteNews();
    if (!success) return res.redirect(req.get("referer"));
  } else if (buttonPress == "appreciate") {
    news = new News(allNews[index]);
    success = await news.appreciate(session.user.id);
    if (!success) return res.redirect(req.get("referer"));
  }
  return res.redirect("/news");
});

//[External access]
module.exports = router;
