//[Import stuff]
const chalk = require("chalk"); //needed for colorful console messages
const { until, endPlural } = require("../utils");
var assistant;

//connect to A.I. API
async function connectAI() {
  var aiLabel = chalk.green("[AI]");
  var msg;
  try {
    const ChatGPTAPI = (await import("chatgpt")).ChatGPTAPI;
    assistant = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });

    await until((_) => assistant);
    msg = " Api loaded.";
  } catch (error) {
    console.log(error);
    msg = " Couldn't load Api.";
  }
  console.log(aiLabel + msg);
}

//get API endpoint
const getAssistant = () => assistant;

//parse A.I. response
function parseAssToRecipe(response, recipe) {
  recipe.extra = "";
  recipe.ingredients2 = [];
  recipe.instructions = "";
  const ings = recipe.ingredients.map((ing) => ing.name.toLowerCase());
  console.log(ings);
  const { units } = require("../jsons/ingredients.json");
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

function parseAssToRecipeTest() {
  recipe = {
    ai: true,
    ingredients: [
      {
        amount: 2,
        unit: "Cups",
        name: "milk",
      },
      {
        amount: 50,
        unit: "Grams",
        name: "flour",
      },
      {
        amount: 2,
        unit: "Tablespoon",
        name: "cocoa powder",
      },
      {
        amount: 1,
        unit: "Teaspoon",
        name: "vanilla extract",
      },
      {
        amount: 200,
        unit: "Grams",
        name: "butter",
      },
    ],
  };
  response =
    "$Recipe name\n" +
    "Decadent Chocolate Milkshake\n" +
    "$Ingredients\n" +
    "2@Cups@milk\n" +
    "50@Grams@flour\n" +
    "200@Grams@butter\n" +
    "2@Tablespoon@cocoa powder\n" +
    "1@Teaspoon@vanilla extract\n" +
    "4@Tablespoon@sugar\n" +
    "2@Cups@vanilla ice cream\n" +
    "$Instructions\n" +
    "In a small bowl, mix together the flour, cocoa powder, and sugar until well combined.\n" +
    "Melt the butter in a saucepan over low heat.\n" +
    "Add the flour mixture to the melted butter and stir until smooth. Cook for 2-3 minutes, stirring constantly, until the mixture is thick and bubbly.\n" +
    "Remove from heat and let cool.\n" +
    "In a blender, combine the milk, vanilla extract, and vanilla ice cream. Blend until smooth.\n" +
    "Add the cooled chocolate mixture to the blender and blend until fully incorporated.\n" +
    "Pour the milkshake into two glasses and serve immediately.\n" +
    "Enjoy!";
  recipe.extra = "";
  recipe.ingredients2 = [];
  recipe.instructions = "";
  const ings = recipe.ingredients.map((ing) => ing.name.toLowerCase());
  console.log(ings);
  const { units } = require("../jsons/ingredients.json");
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

module.exports = { connectAI, getAssistant, parseAssToRecipe, parseAssToRecipeTest };
