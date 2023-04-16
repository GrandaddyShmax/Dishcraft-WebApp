//[Import]
//App:
const fs = require("fs"); //accessing other folders & files
const express = require("express");
var session = require("express-session");
//Database access:
const mongoose = require("mongoose"); //database access
require("dotenv").config(); //enables environment variables
const { DB_URL } = process.env; //load db password from environment variables
//Aid:
const chalk = require("chalk"); //colorful console.logs
const path = require("path"); //safe path creating
const bodyParser = require("body-parser"); //better request parsing
const { until, printAllRoutes } = require("./utils.js");
//Info:
const port = 3000;
const url = `http://localhost:${port}/`;

//[Connect to database]
let connected = null;
(async () => {
  mongoose.set("strictQuery", true); //force to follow schema
  try {
    await mongoose.connect(DB_URL).then(() => {
      connected = true;
      console.log(chalk.green("[DB]") + " Database connected.");
    });
  } catch (error) {
    connected = false;
    console.log(chalk.green("[DB]") + chalk.red(" Couldn't connect to database."));
    console.log(error);
  }
})();

const { exec } = require('child_process');
exec('npm run tailwind:css', (err, stdout, stderr) => {
  if (err) {
    return console.log(err);
  }
});

//[Initialize app]
const app = express();
app.set("view engine", "ejs"); //define engine
app.set("views", "views"); //define views location
const router = express.Router();
app.use(router);
app.use(session({ resave: false, saveUninitialized: false, secret: "for some reason" }));

//[Define aid tools]
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //define public folder
app.use("/images", express.static(path.join(__dirname, "public/images")));

//[Prepare routes]
const controllers = fs.readdirSync(`./controllers`);
for (const controller of controllers) {
  if (controller.endsWith(".js"))
    //File: prep file
    require(`./controllers/${controller}`)(app, router);
  else {
    //Folder: prep files in folder
    const subFiles = fs.readdirSync(`./controllers/${controller}`).filter((file) => file.endsWith(".js"));
    for (const file of subFiles) require(`./controllers/${controller}/${file}`)(app, router);
  }
}
//[Log routes]
console.log(chalk.blue("[App]") + " Registered routes:");
printAllRoutes(app, url);

//[Launch app]
(async () => {
  await until((_) => connected != null); //wait for all async functions to finish
  app.listen(port);
  console.log(chalk.blue("[App]") + " App launched at: " + chalk.yellow(url));
})();

//[Process events]
process.on("SIGINT", (signal, code) => process.exit(128 + signal));
process.on("exit", (code) => {
  console.log(chalk.blue("[App]") + " App closed.");
});
