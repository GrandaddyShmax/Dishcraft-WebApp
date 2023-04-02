//[Import]
const fs = require("fs"); //accessing other folders & files

//[Object to store schemas]
const schemas = new Object();

//[Prepare schemas]
const aidFiles = fs.readdirSync(`./schemas`).filter((file) => file.endsWith(".js"));
for (const file of aidFiles) if (file != "paths.js") require(`./${file}`)(schemas);

module.exports = { schemas };

