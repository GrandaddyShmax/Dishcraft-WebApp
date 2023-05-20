//[Tests]
const start = new Date();
const dtCheck = process.argv.length > 2 && process.argv[2] == "dt"; //deploy time check
const testing = typeof global.it === "function" || dtCheck; //avoid printing during tests
//[Import]
//App:
const fs = require("fs"); //accessing other folders & files
const express = require("express");
var session = require("express-session");
const { exec } = require("child_process"); //run terminal commands
const multer = require("multer"); //save files
//Database access:
require("./schemas/paths");
const mongoose = require("mongoose"); //database access
require("dotenv").config(); //enables environment variables
const { DB_URL, APP_ID, APP_KEYS, APP_ID2, APP_KEYS2 } = process.env; //load db password from environment variables
//API access:
const { connectAI } = require("./API/ai");
//Aid:
const chalk = require("chalk"); //colorful console.logs
const path = require("path"); //safe path creating
const bodyParser = require("body-parser"); //better request parsing
const { printAllRoutes } = require("./utils.js");
//Info:
const port = 3000;
const url = `http://localhost:${port}/`;
const appLabel = chalk.green("[App]");
const dbLabel = chalk.magenta("[DB]");
const apiLabel = chalk.blue("[API]");

//[Connect to database]
//let db = null;
const connectDB = async () => {
  mongoose.set("strictQuery", true); //force to follow schema
  try {
    await mongoose.connect(DB_URL).then(() => {
      if (!testing) console.log(dbLabel + " Database connected.");
    });
    return true;
  } catch (error) /* istanbul ignore next */ {
    if (!testing) console.log(dbLabel + chalk.red(" Couldn't connect to database."));
    console.log(error);
    return false;
  }
};
const db = connectDB(); //will load in background
module.exports.db = db;

//[Connect to A.I. API]
const ai = connectAI(testing); //will load in background

//[Initialize Tailwind]
exec("npm run tailwind:css", (err, stdout, stderr) => {
  if (err) return console.log(err);
});

//[Initialize app]
const app = express();
app.set("view engine", "ejs"); //define engine
app.set("views", "views"); //define views location
app.use(session({ resave: false, saveUninitialized: false, secret: "for some reason" }));

//[Define aid tools]
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"))); //define public folder
app.use("/images", express.static(path.join(__dirname, "public/images")));

//[Initialize storage]
/* istanbul ignore next */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/images/temp/"),
  filename: (req, file, cb) => cb(null, file.originalname),
});
module.exports.uploadImage = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } });

//[Prepare routes]
const controllers = fs.readdirSync(`./controllers`);
for (const controller of controllers) {
  if (controller == "errors.js") continue;
  if (!controller.endsWith(".js")) {
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
/* istanbul ignore next */
if (!testing) {
  console.log(appLabel + " Registered routes:");
  printAllRoutes(app, url);
}

//[Launch app]
(async () => {
  //wait for db connection to finish
  db.then(() => {
    app.listen(port);

    /* istanbul ignore next */
    if (!testing) {
      console.log(appLabel + " App launched at: " + chalk.yellow(url));

      if (!APP_ID || !APP_KEYS || !APP_ID2 || !APP_KEYS2) console.log(apiLabel + chalk.red(" Missing secrets to use Food API."));
      else console.log(apiLabel + " Food API is ready to use.");
    }
    //wait for ai connection to finish
    ai.then(() => {
      //print deploy time
      let dtTime = (new Date().getTime() - start.getTime()) / 1000;
      const threshhold = 7;
      const pass = dtTime <= threshhold;
      dtTime = pass ? chalk.green(dtTime) : chalk.red(dtTime);

      if (!testing || (testing && dtCheck)) console.log(chalk.grey("Deployment time: ") + dtTime);

      if (dtCheck) process.exit(pass ? 0 : 1);
    });
  });
})();

module.exports.app = app;

//[Process events]
process.on("SIGINT", (signal, code) => process.exit(128 + signal));
process.on("exit", (code) => {
  if (!testing) console.log(appLabel + " App closed.");
});
