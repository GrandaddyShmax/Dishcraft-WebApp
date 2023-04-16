const User = require("../../models/user");

module.exports = (app, router) => {
    router.get("/", async (req, res) => {
        res.render("template", {
        page: "login",
        pageTitle: "Login",
        });
    });

    router.get("/register", async (req, res) => {
        res.render("template", {
        page: "register",
        pageTitle: "Register",
        });
    });

    router.post("/", async (req, res) => {
        const temp = req.body.submit;
        var user = new User(temp);
        let { successful, message, user } = user.verify();

        if(successful) {
            var session = req.session;
            session.user = user;

            return res.redirect("/home");
        }
        else 
        {
            session.message = message;
        }
    });

    
};

