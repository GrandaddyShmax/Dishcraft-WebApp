//[Import stuff]
const chalk = require("chalk"); //needed for colorful console messages
const { until, endPlural, smartInclude } = require("../utils");
const { units } = require("../jsons/views.json");
const { schemas } = require("../schemas/paths");
const prompt = require("../jsons/prompt.json");
var assistant;

//connect to A.I. API
async function connectAI(testing) {
  const { DEPLOYED } = process.env;
  var aiLabel = chalk.cyan("[AI]");
  const access = await schemas.AIAccess.findOne({});
  var msg;
  if (access.lib == "1") msg = await loadLib1(access.accessToken);
  else if (access.lib == "2") msg = await loadLib2(access.disabled);
  else if (access.lib == "3") msg = await loadLib3(DEPLOYED ? access.apiKeyDeploy : access.apiKeyLocal);
  else msg = chalk.red(" Couldn't load Api, invalid lib selected.");
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
    return chalk.red(" Couldn't load Api.");
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
    return chalk.red(" Couldn't load Api.");
  }
}
//New module
async function loadLib3(apiKey) {
  try {
    if (!apiKey) return " Couldn't find apiKey.";
    const Configuration = (await import("openai")).Configuration;
    const OpenAIApi = (await import("openai")).OpenAIApi;
    const rProxy = "https://api.pawan.krd/v1";
    const configuration = new Configuration({ apiKey: apiKey, basePath: rProxy });
    assistant = new OpenAIApi(configuration);

    await until((_) => assistant);
    return " Api loaded using new module.";
  } catch (error) {
    console.log(error);
    return chalk.red(" Couldn't load Api.");
  }
}
//get API endpoint
const getAssistant = () => assistant;

//request A.I. to give a recipe
async function sendMessage(testMsg, recipe) {
  const response = await assistant.createCompletion({
    model: "gpt-3.5-turbo",
    prompt: `Human: ${testMsg}\nAI:`,
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["Human: ", "AI: "],
  });
  return parseAssToRecipe(response.data.choices[0].text, recipe);
}

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
      { amount: "3", unit: "Tablespoon", name: "peanut butter" },
      { amount: "1", unit: "Cups", name: "flour" },
      { amount: "1", unit: "Pieces", name: "egg" },
      { amount: "2", unit: "Tablespoon", name: "sugar" },
      { amount: "1", unit: "Teaspoon", name: "salt" },
    ],
  };
  response =
    "$Recipe name\n" +
    "Peanut Butter Cookies\n" +
    "$Ingredients\n" +
    "3@Tablespoon@peanut butter\n" +
    "1@Cup@all-purpose flour\n" +
    "1@Piece@egg\n" +
    "2@Tablespoon@granulated sugar\n" +
    "1@Teaspoon@salt\n" +
    "$Instructions\n" +
    "Preheat the oven to 375°F (190°C). Line a baking sheet with parchment paper.\n" +
    "In a mixing bowl, cream together the peanut butter and sugar until light and fluffy. \n" +
    "Add in the egg and mix until well combined.\n" +
    "Sift in the flour and salt, then fold the mixture with a spatula until just combined.\n" +
    "Using a spoon, scoop out dough and roll into balls. Place them on the prepared baking sheet, leaving at least 2 inches (5 cm) of space between cookies.\n" +
    "Use a fork to gently flatten the balls, making a crisscross pattern on the top.\n" +
    "Bake for 10-12 minutes, or until the edges are lightly golden.\n" +
    "Let the cookies cool on the pan for 5 minutes before transferring to a wire rack to cool completely.\n" +
    "Serve and enjoy!";
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
    if (!line || !line.replaceAll(" ", "")) continue;
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
          if (!name && !smartInclude(units, unit)) {
            name = unit;
            unit = "Pieces";
          }
          if (!units.includes(unit)) {
            if (units.includes(unit + "s")) unit = unit + "s";
            else if (units.includes(unit.slice(0, -1))) unit = unit.slice(0, -1);
            else unit = "Pieces";
          }
          if (!amount || !unit || !name) continue;
          if (!smartInclude(ings, name)) {
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
  if (!recipe.extra) recipe.extra = "No extra ingredients!";
  console.log(recipe);
  return recipe;
}
//[External access]
module.exports = { connectAI, getAssistant, sendMessage, parseAssToRecipe, parseAssToRecipeTest };
