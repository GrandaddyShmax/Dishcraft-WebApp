//[Import stuff]
const chalk = require("chalk"); //needed for colorful console messages
const { until } = require("../utils");
var assistant;

//[Update presence]
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

//[Get assistant access]
const getAssistant = () => assistant;

module.exports = { connectAI, getAssistant };
