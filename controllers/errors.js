module.exports = (app, router) => {
  //[Handle 404]
  app.use((req, res, next) => {
    res.status(404).render("errors/404", {
      pageTitle: "Page Not Found",
      path: "",
      url: req.headers.host + req.originalUrl,
    });
  });
};
