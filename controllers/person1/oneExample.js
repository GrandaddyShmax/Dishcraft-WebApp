module.exports = (app, router) => {
  router.get("/", async (req, res) => {
    const text = "Example 1";
    res.render("main/main", {
      pageTitle: text,
      path: "/1",
      text: text,
      redirect: "/2",
    });
  });

  router.get("/text", async (req, res) => {
    res.render("main/main", {
      pageTitle: "TEXT",
      path: "/text",
      text: "TEXT",
    });
  });
};
