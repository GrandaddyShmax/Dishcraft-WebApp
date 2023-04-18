const fetch = require("node-fetch");
const { APP_ID, APP_KEYS } = process.env;

async function getJson(ingredient){
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=&{APP_KEYS}&ingr=${ingredient}&nutrition-type=cooking`
    let result = await fetch(url);
    let res = await result.json();
    return res;
}

/*[ External access ]*/
module.exports = { getJson };