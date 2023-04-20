//[Import stuff]
const chalk = require("chalk"); //needed for colorful console messages
const { schemas } = require("../schemas/paths");
const { until } = require("../utils");
const { USERMAIL, USERPASS } = process.env; //load passwords
var assistant;

//[Update presence]
async function connectAI() {
  try {
    let access = await schemas.AIAccess.findOne({});
    const ChatGPTUnofficialProxyAPI = (await import("chatgpt")).ChatGPTUnofficialProxyAPI;
    var OPENAI_ACCESS_TOKEN;
    let result;
    //[Load key from database]
    if (access && access.accessToken) {
      OPENAI_ACCESS_TOKEN = access.accessToken;
      result = getApi(ChatGPTUnofficialProxyAPI, OPENAI_ACCESS_TOKEN);
    }
    //[Get new key and save in database]
    if (!access || !access.accessToken || !result) {
      //refresh access token

      result = getApi(ChatGPTUnofficialProxyAPI, OPENAI_ACCESS_TOKEN);
      if (result) await schemas.access.updateOne({}, { accessToken: OPENAI_ACCESS_TOKEN.accessToken });
    }
    await until((_) => assistant);
    const msg = result ? "A.I. Api loaded" : "Couldn't load A.I. Api";
    console.log(chalk.magenta(msg));
  } catch (error) {
    console.log(error);
  }
}

//[Try to get API access]
function getApi(ChatGPTUnofficialProxyAPI, OPENAI_ACCESS_TOKEN) {
  try {
    assistant = new ChatGPTUnofficialProxyAPI({ accessToken: OPENAI_ACCESS_TOKEN });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
module.exports = { connectAI, assistant };
