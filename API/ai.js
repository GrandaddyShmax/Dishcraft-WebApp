//[Import stuff]
const chalk = require("chalk"); //needed for colorful console messages
const { until, endPlural } = require("../utils");
const { units } = require("../jsons/views.json");
const { schemas } = require("../schemas/paths");
var assistant;

//connect to A.I. API
async function connectAI(testing) {
  var aiLabel = chalk.green("[AI]");
  const access = await schemas.AIAccess.findOne({});
  var msg;
  if (access.lib == "1") msg = await loadLib1(access.accessToken);
  else if (access.lib == "2") msg = await loadLib2(access.disabled);
  else msg = " Couldn't load Api, invalid lib selected.";
  if (!testing) console.log(aiLabel + msg);
  return true;
}

//Main module
async function loadLib1(accessToken) {
  try {
    const rProxy1 = "https://ai.fakeopen.com/api/conversation"; //0.5 r/s
    const rProxy2 = "https://api.pawan.krd/backend-api/conversation"; //~3  r/s
    const ChatGPTUnofficialProxyAPI = (await import("chatgpt")).ChatGPTUnofficialProxyAPI;

    assistant = new ChatGPTUnofficialProxyAPI({ accessToken: accessToken, apiReverseProxyUrl: rProxy1 });

    await until((_) => assistant);
    return " Api loaded using main module.";
  } catch (error) {
    console.log(error);
    return " Couldn't load Api.";
  }
}
//Backup module
async function loadLib2(disabled) {
  try {
    if (disabled) return " Backup module disabled.";
    const ChatGPTAPI = (await import("chatgpt")).ChatGPTAPI;
    assistant = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });

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
  console.log(response);
  if (response.text) response = response.text;
  return parseRecipe(response, recipe);
}
//parse template recipe to test page visually without making API requests
function parseAssToRecipeTest() {
  recipe = {
    ai: true,
    ingredients: [
      { amount: "0.1", unit: "Cups", name: "milk" },
      { amount: 8, unit: "Ounces", name: "linguine pasta" },
      { amount: 2, unit: "Tablespoon", name: "unsalted butter" },
    ],
  };
  response =
    "$Recipe name\n" +
    "Creamy Garlic Parmesan Pasta\n" +
    "$Ingredients\n" +
    "0.1@Cups@milk\n" +
    "8@Ounces@linguine pasta\n" +
    "2@Tablespoons@unsalted butter\n" +
    "4@Cloves@garlic, minced\n" +
    "1@Cup@heavy cream\n" +
    "1/2@Cup@grated Parmesan cheese\n" +
    "1/2@Teaspoon@salt\n" +
    "1/4@Teaspoon@black pepper\n" +
    "1/4@Cup@chopped fresh parsley leaves\n" +
    "$Instructions\n" +
    "In a large pot, bring water to a boil and cook the linguine pasta according to the package instructions. Drain and set aside.\n" +
    "In a separate skillet, melt the butter over medium heat. Add the minced garlic and cook for about 2 minutes until fragrant and lightly golden.\n" +
    "Reduce the heat to low and pour in the milk. Stir well to combine with the garlic and butter.\n" +
    "Slowly pour in the heavy cream while continuously stirring. Allow the mixture to simmer gently for about 5 minutes, until it thickens slightly.\n" +
    "Add the grated Parmesan cheese, salt, and black pepper to the sauce. Stir until the cheese has melted and the sauce is smooth and creamy.\n" +
    "Add the cooked linguine pasta to the skillet and toss it in the sauce until well coated.\n" +
    "Remove the skillet from the heat and sprinkle the chopped parsley over the pasta. Toss again to incorporate the parsley.\n" +
    "Serve the creamy garlic Parmesan pasta immediately and enjoy!\n" +
    "Note: Feel free to adjust the seasoning according to your taste preferences. You can also add cooked chicken, shrimp, or vegetables to make it a heartier dish.";
  return parseRecipe(response, recipe);
}

function parseRecipe(response, recipe) {
  recipe.extra = "";
  recipe.ingredients2 = [];
  recipe.instructions = "";
  const ings = recipe.ingredients.map((ing) => ing.name.toLowerCase());
  const fields = ["$recipe name", "$ingredients", "$instructions"];
  var index;
  for (const line of response.split("\n")) {
    if (line.includes("$")) index = fields.indexOf(line.toLowerCase());
    else {
      switch (index) {
        case 0: //recipe name
          recipe.recipeName = line;
          break;
        case 1: //ingredients or extra ingredients
          var [amount, unit, name] = line.split("@");
          if (!parseInt(amount) && !parseFloat(amount)) amount = 0;
          else amount = parseFloat(amount);
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
  console.log(recipe);
  return recipe;
}
//[External access]
module.exports = { connectAI, getAssistant, parseAssToRecipe, parseAssToRecipeTest };
