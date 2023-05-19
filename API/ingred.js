import("node-fetch");

async function getJsonNutritionDB(ingredient) {
  const { APP_ID, APP_KEYS } = process.env;
  const url = `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEYS}&nutrition-type=logging&ingr=${ingredient}`;
  let result = await fetch(url);
  return await result.json();
}

async function getJsonFoodDB(ingredient) {
  const { APP_ID2, APP_KEYS2 } = process.env;
  const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID2}&app_key=${APP_KEYS2}&ingr=${ingredient}&nutrition-type=cooking`;
  let result = await fetch(url);
  return await result.json();
}

// try to get the ingredient from the API
async function getData(ingredient) {
  const nutJson = await getJsonNutritionDB(ingredient);
  if (!nutJson) return false;
  const nutrients = nutJson.totalNutrients;

  return {
    //[Health Labels(Array)]
    healthLabels: nutJson.healthLabels,
    //[Details]//
    name: ingredient,
    calories: nutJson.calories,
    totalWeight: nutJson.totalWeight,
    //[Nutrients]//
    energy: nutrients.ENERC_KCAL ? nutrients.ENERC_KCAL.quantity : 0, //(unit: kcal)
    fattyAcids: nutrients.FASAT ? nutrients.FASAT.quantity : 0,       //(unit: g)
    sodium: nutrients.NA ? nutrients.NA.quantity : 0,                 //(unit: g)
    sugar: nutrients.SUGAR ? nutrients.SUGAR.quantity : 0,            //(unit: g)
    protein: nutrients.PROCNT ? nutrients.PROCNT.quantity : 0,        //(unit: g)
  };
}

// check ingredient in the API
async function checkIgredientAPI(ingredient) {
  let parsed = (await getJsonFoodDB(ingredient)).parsed;
  if (!parsed || parsed.length === 0) {
    return false;
  }
  return true;
}

/*[ External access ]*/
module.exports = { getData, checkIgredientAPI };
