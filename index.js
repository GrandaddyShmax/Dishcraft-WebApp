//[Import]
const fs = require("fs"); //accessing other folders & files
const path = require("path");
const express = require("express");
var session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //database access
require("dotenv").config(); //enables environment variables

//[Info]
const port = 8080;
const url = `http://localhost:${port}/`;

//[Connect to database]
(async () => {
  mongoose.set("strictQuery", true); //force to follow schema
  try {
    await mongoose.connect(process.env.DB_URL).then(() => console.log("Database connected"));
  } catch (error) {
    console.log(error);
  }
})();

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

//[Launch app]
app.listen(port);
console.log(url);
