module.exports = (app, router) => 
{
    router.get("/assistant", async (req, res) => 
    {
        res.render("template",
        {
            pageTitle: "Dishcraft - Assistant",
            page: "assistant",
        });
    });
};