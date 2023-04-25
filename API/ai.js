//[Import stuff]
const chalk = require("chalk"); //needed for colorful console messages
const { until, endPlural } = require("../utils");
const { units } = require("../jsons/views.json");
const { schemas } = require("../schemas/paths");
var assistant;

//connect to A.I. API
async function connectAI(testing) {
  var aiLabel = chalk.green("[AI]");
  var msg = await loadLib1();
  if (!testing) console.log(aiLabel + msg);
}

//Main module
async function loadLib1() {
  try {
    const rProxy1 = "https://ai.fakeopen.com/api/conversation"; //0.5 r/s
    const rProxy2 = "https://api.pawan.krd/backend-api/conversation"; //~3  r/s
    const ChatGPTUnofficialProxyAPI = (await import("chatgpt")).ChatGPTUnofficialProxyAPI;
    const access = await schemas.AIAccess.findOne({});
    assistant = new ChatGPTUnofficialProxyAPI({ accessToken: access.accessToken, apiReverseProxyUrl: rProxy1 });

    await until((_) => assistant);
    return " Api loaded using main module.";
  } catch (error) {
    console.log(error);
    return " Couldn't load Api.";
  }
}
//Backup module
async function loadLib2() {
  try {
    return " Backup module disabled.";
    const ChatGPTAPI = (await import("chatgpt")).ChatGPTAPI;
    //assistant = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });

    await until((_) => assistant);
    return " Api loaded using backup module.";
  } catch (error) {
    console.log(error);
    return " Couldn't load Api.";
  }
}

//get API endpoint
const getAssistant = () => assistant;

//parse A.I. response
function parseAssToRecipe(response, recipe) {
  console.log(response)
  if (response.text) response = response.text;
  recipe.extra = "";
  recipe.ingredients2 = [];
  recipe.instructions = "";
  const ings = recipe.ingredients.map((ing) => ing.name.toLowerCase());
  console.log(ings);
  const fields = ["$recipe name", "$ingredients", "$instructions"];
  var index;
  for (const line of response.split("\n")) {
    console.log(line);
    if (line.includes("$")) index = fields.indexOf(line.toLowerCase());
    else {
      switch (index) {
        case 0: //recipe name
          recipe.recipeName = line;
          break;
        case 1: //ingredients or extra ingredients
          var [amount, unit, name] = line.split("@");
          if (!parseInt(amount) && !parseFloat(amount)) amount = 0;
          if (!name && !units.includes(unit)) {
            name = unit;
            unit = "Pieces";
          }
          if (!units.includes(unit)) {
            if (units.includes(unit + "s")) unit = unit + "s";
            else if (units.includes(unit.slice(0, -1))) unit = unit.slice(0, -1);
            else unit = "Pieces";
          }
          if (!ings.includes(name.toLowerCase())) {
            recipe.extra += `${amount} ${endPlural(amount, unit)} of ${name}\n`;
            recipe.ingredients2.push({ amount: amount, unit: unit, name: name });
          }
          break;
        case 2: //instructions
          recipe.instructions += line + "\n";
          break;
        default:
          break;
      }
    }
  }
  return recipe;
}
//test parsing on existing text
function parseAssToRecipeTest() {
  recipe = {
    ai: true,
    ingredients: [
      { amount: 5, unit: "Pieces", name: "bread" },
      { amount: 2, unit: "Tablespoon", name: "chocolate" },
      { amount: 10, unit: "Grams", name: "butter" },
      { amount: 1, unit: "Pieces", name: "egg" },
    ],
  };
  response =
  "$Recipe name\n" +
  "Chocolate French Toast\n" +
  "$Ingredients\n" +
  "5@Pieces@bread\n" +
  "2@Tablespoons@chocolate chips\n" +
  "10@Grams@butter\n" +
  "1@Piece@egg\n" +
  "0.5@Teaspoon@vanilla extract\n" +
  "0.25@Cups@milk\n" +
  "1@Teaspoon@cinnamon\n" +
  "1@Pinch@salt\n" +
  "$Instructions\n" +
  "In a shallow bowl, whisk together the egg, milk, vanilla extract, cinnamon, and salt until well combined.\n" +
  "Melt the butter in a large non-stick skillet over medium heat.\n" +
  "Dip each slice of bread into the egg mixture, making sure to coat both sides.\n" +
  "Place the coated bread in the skillet and cook until golden brown, about 2-3 minutes per side.\n" +
  "Sprinkle the chocolate chips over the top of each slice of bread and let them melt for a minute or two.\n" +
  "Using a spatula, fold the bread in half, pressing gently to melt the chocolate chips and seal the toast together.\n" +
  "Serve immediately and enjoy your delicious Chocolate French Toast!";
  recipe.extra = "";
  recipe.ingredients2 = [];
  recipe.instructions = "";
  const ings = recipe.ingredients.map((ing) => ing.name.toLowerCase());
  console.log(ings);
  const fields = ["$recipe name", "$ingredients", "$instructions"];
  var index;
  for (const line of response.split("\n")) {
    console.log(line);
    if (line.includes("$")) index = fields.indexOf(line.toLowerCase());
    else {
      switch (index) {
        case 0: //recipe name
          recipe.recipeName = line;
          break;
        case 1: //ingredients or extra ingredients
          var [amount, unit, name] = line.split("@");
          if (!parseInt(amount) && !parseFloat(amount)) amount = 0;
          if (!name && !units.includes(unit)) {
            name = unit;
            unit = "Pieces";
          }
          if (!units.includes(unit)) {
            if (units.includes(unit + "s")) unit = unit + "s";
            else if (units.includes(unit.slice(0, -1))) unit = unit.slice(0, -1);
            else unit = "Pieces";
          }
          if (!ings.includes(name.toLowerCase())) {
            recipe.extra += `${amount} ${endPlural(amount, unit)} of ${name}\n`;
            recipe.ingredients2.push({ amount: amount, unit: unit, name: name });
          }
          break;
        case 2: //instructions
          recipe.instructions += line + "\n";
          break;
        default:
          break;
      }
    }
  }
  return recipe;
}
//[External access]
module.exports = { connectAI, getAssistant, parseAssToRecipe, parseAssToRecipeTest };
