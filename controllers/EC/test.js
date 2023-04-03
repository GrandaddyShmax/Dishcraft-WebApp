module.exports = (app, router) => {
  //basic page for testing user badges
  router.get("/userTest", async (req, res) => {
    const text = "User Test";
    //fake recipes array to test dynamic user badges
    const recipes = [
      {
        user: {
          avatar: "chrome://branding/content/about-logo.png",
          name: "Junior 1",
        },
      },
      {
        user: {
          avatar: "https://cdn-icons-png.flaticon.com/512/4436/4436481.png",
          name: "Junior 2",
        },
      },
      {
        user: {
          avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/How_to_use_icon.svg/1200px-How_to_use_icon.svg.png",
          name: "Expert 1",
          expert: true,
        },
      },
      {
        user: {
          avatar: "https://cdn-icons-png.flaticon.com/512/3884/3884851.png",
          name: "Junior 3",
        },
      },
      {
        user: {
          avatar: "https://sce-ac.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10421?size=xxlarge",
          name: "Expert 2",
          expert: true,
        },
      },
    ];
    res.render("main/recipes", {
      pageTitle: text,
      path: "/userTest",
      text: text,
      recipes: recipes,
    });
  });
};
