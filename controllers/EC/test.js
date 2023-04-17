//fake users for testing
var users = [
  {
    avatar: "chrome://branding/content/about-logo.png",
    username: "Junior 1",
  },
  {
    avatar: "https://cdn-icons-png.flaticon.com/512/4436/4436481.png",
    username: "Junior 2",
  },
  {
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/How_to_use_icon.svg/1200px-How_to_use_icon.svg.png",
    username: "Expert 1",
    expert: true,
  },
  {
    avatar: "https://cdn-icons-png.flaticon.com/512/3884/3884851.png",
    username: "Junior 3",
  },
  {
    avatar: "https://sce-ac.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10421?size=xxlarge",
    username: "Expert 2",
    expert: true,
  },
];

module.exports = (app, router) => {
  //basic page for testing user badges
  router.get("/userTest", async (req, res) => {
    const text = "User Test";
    //fake recipes array to test dynamic user badges
    const recipes = [{ user: users[0] }, { user: users[1] }, { user: users[2] }, { user: users[3] }, { user: users[4] }];
    res.render("test/main", {
      pageTitle: text,
      recipes: recipes,
    });
  });
};
