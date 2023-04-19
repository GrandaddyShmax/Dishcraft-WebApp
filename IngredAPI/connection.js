import("node-fetch");

async function getJsonNutritionDB(ingredient){
    const { APP_ID, APP_KEYS } = process.env;
    const url = `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEYS}&nutrition-type=logging&ingr=${ingredient}`
    //const url = `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEYS}&nutrition-type=cooking&ingr=${ingredient}`
    let result = await fetch(url);
    return await result.json();
}

async function getJsonFoodDB(ingredient){
    const { APP_ID2, APP_KEYS2 } = process.env;
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID2}&app_key=${APP_KEYS2}&ingr=${ingredient}&nutrition-type=cooking`
    let result = await fetch(url);
    return await result.json();
}

async function getHealthLabels(ingredient){
    const temp = await getJsonNutritionDB(ingredient)
    return temp.healthLabels;
}

async function getData(ingredient){
    const nutJson = await getJsonNutritionDB(ingredient); 
    const nutrients = nutJson.totalNutrients;
    return {  
            //[Health Labels(Array)]
            healthLabels: nutJson.healthLabels,
            calories: nutJson.calories,
            totalWeight: nutJson.totalWeight,
            //[Nutrients]//
            energy: nutrients.ENERC_KCAL.quantity,  //(unit: kcal)
            fattyAcids: nutrients.FASAT.quantity,   //(unit: g)
            sodium: nutrients.NA.quantity,          //(unit: g)
            sugar: nutrients.SUGAR.quantity,        //(unit: g)
            protein: nutrients.PROCNT.quantity      //(unit: g)
    };
}

/*[ External access ]*/
module.exports = { getJsonNutritionDB, getJsonFoodDB, getData };