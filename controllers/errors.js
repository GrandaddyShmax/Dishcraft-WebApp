//[Handle 404]
exports.get404Page = (req, res, next) => {
  res.status(404).render("errors/404", {
    pageTitle: "Page Not Found",
    path: "",
    url: req.headers.host + req.originalUrl,
  });
};
