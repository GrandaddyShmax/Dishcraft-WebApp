//[Import]
//App:
const fs = require("fs"); //accessing other folders & files
const express = require("express");
var session = require("express-session");
const { exec } = require("child_process"); //run terminal commands
//Database access:
require("./schemas/paths");
const mongoose = require("mongoose"); //database access
require("dotenv").config(); //enables environment variables
const { DB_URL } = process.env; //load db password from environment variables
//API access:
const { connectAI } = require("./API/ai");
//Aid:
const chalk = require("chalk"); //colorful console.logs
const path = require("path"); //safe path creating
const bodyParser = require("body-parser"); //better request parsing
const { until, printAllRoutes } = require("./utils.js");
//Info:
const port = 3000;
const url = `http://localhost:${port}/`;
const appLabel = chalk.blue("[App]");
const dbLabel = chalk.magenta("[DB]");

//[Connect to database]
let connected = null;
(async () => {
  mongoose.set("strictQuery", true); //force to follow schema
  try {
    await mongoose.connect(DB_URL).then(() => {
      connected = true;
      console.log(dbLabel + " Database connected.");
    });
  } catch (error) {
    connected = false;
    console.log(dbLabel + chalk.red(" Couldn't connect to database."));
    console.log(error);
  }
})();

//[Connect to A.I. API]
connectAI();  //will load in background

//[Initialize Tailwind]
exec("npm run tailwind:css", (err, stdout, stderr) => {
  if (err) return console.log(err);
});

//[Initialize app]
const app = express();
app.set("view engine", "ejs"); //define engine
app.set("views", "views"); //define views location
//const router = express.Router();
//app.use(router);
app.use(session({ resave: false, saveUninitialized: false, secret: "for some reason" }));

//[Define aid tools]
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //define public folder
app.use("/images", express.static(path.join(__dirname, "public/images")));

//[Prepare routes]
const controllers = fs.readdirSync(`./controllers`);
for (const controller of controllers) {
  if (controller == "errors.js") continue;
  if (controller.endsWith(".js")) {
    //File: prep file
    const routes = require(`./controllers/${controller}`);
    app.use(routes);
  } else {
    //Folder: prep files in folder
    const subFiles = fs.readdirSync(`./controllers/${controller}`).filter((file) => file.endsWith(".js"));
    for (const file of subFiles) {
      const routes = require(`./controllers/${controller}/${file}`);
      app.use(routes);
    }
  }
}
const errorController = require("./controllers/errors.js"); //handle errors
app.use(errorController.get404Page); //error page

//[Log routes]
console.log(appLabel + " Registered routes:");
printAllRoutes(app, url);

//[Launch app]
(async () => {
  await until((_) => connected != null); //wait for all async functions to finish
  app.listen(port);
  console.log(appLabel + " App launched at: " + chalk.yellow(url));
})();

//[Process events]
process.on("SIGINT", (signal, code) => process.exit(128 + signal));
process.on("exit", (code) => {
  console.log(appLabel + " App closed.");
});
