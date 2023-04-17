/*[ Import ]*/
const schemas = require("../../schemas/paths");

module.exports = (app, router) => 
{
    router.get("/home", async (req, res) => 
    {
        
        res.render("template", 
        {
            pageTitle: "Dishcraft - Homepage",
            page: "home",
        });
    });
};