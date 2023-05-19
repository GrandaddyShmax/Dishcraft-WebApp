//[Import]
const AsciiTable = require("ascii-table");
const { defIngs } = require("./jsons/views.json");

//Forces code to wait until condition is met
function until(condition) {
  const check = (resolve) => {
    if (condition()) resolve();
    else setTimeout((_) => check(resolve), 100);
  };
  return new Promise(check);
}
//Capitalizes first letter depending on type, explanation in function
function capitalize(string) {
  if (!string) return "";
  if (Array.isArray(string)) return capitalizeArray(string);
  if (string.includes("-")) return capitalizeSentence(string);
  if (string.charAt(0) === "[" && string.charAt(string.length - 1) === "]") return `[${capitalize(string.slice(1, -1))}]`;
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
  /*  "test string" => "Test string"
  /*  "test-string" => "TestString"
  /*  ["test", "string"] => ["Test", "String"]
  */
}
//aid func
function capitalizeArray(_string) {
  string = [];
  var index = 0;
  _string.forEach((str) => {
    string[index++] = capitalize(str);
  });
  return string;
}
//aid func
function capitalizeSentence(_string) {
  const strings = _string.split("-");
  var string = [];
  strings.forEach((str) => {
    string.push(capitalize(str));
  });
  return string.join("-");
}

//Add s to word if needed
function endPlural(number, string) {
  const last = string.charAt(string.length - 1);
  if (number == 1) {
    if (last == "s") return string.slice(0, -1);
    return string;
  }
  if (last == "s") return string;
  return string + "s";
}

//check if string is in array, singular&plural
function smartInclude(arr, string, strict) {
  let s = string.toLowerCase();
  if (s.charAt(s.length - 1) == "s") s = s.slice(0 - 1);
  /* jshint -W083 */
  if (strict) return arr.some((word) => word == s || word == s + "s" || s + "s" == word);
  return arr.some((word) => word.includes(s) || word.includes(s + "s") || s.includes(word) || (s + "s").includes(word));
}

//Update fields in object
function offloadFields(fields, object1, object2) {
  if (!object1) object1 = {};
  if (object2) {
    //Fill fields from array
    if (Array.isArray(object2)) {
      var index = 0;
      fields.forEach((field) => {
        object1[field] = object2[index++];
      });
    }
    //Fill fields from object
    else
      fields.forEach((field) => {
        object1[field] = object2[field];
      });
    return object1;
  }
  //Empty fields:
  fields.forEach((field) => {
    object1[field] = null;
  });
  return object1;
}
//Update ingredients & "addmore" & "remove"
function handleIngAdding(req, res, buttonPress, index) {
  var recipe = req.session.recipe;
  var list = [];
  const { amount, unit, name } = req.body;
  if (Array.isArray(name)) for (var i = 0; i < name.length; i++) list.push({ amount: amount[i], unit: unit[i], name: name[i] });
  else list.push({ amount: amount, unit: unit, name: name });
  recipe.ingredients = list;

  //add ingredient
  if (buttonPress == "addmore") {
    recipe.ingredients.push(defIngs);
    return true;
  } //remove ingredient
  else if (buttonPress == "remove") {
    recipe.ingredients.splice(index, 1);
    return true;
  }
  return false;
}

//Prints all registered routes
function printAllRoutes(app, url, silent) {
  const table = new AsciiTable().setBorder("|", "=", "0", "0").setAlign(0, AsciiTable.CENTER);
  //add url to table
  function add(path, layer) {
    if (layer.route) layer.route.stack.forEach(add.bind(null, path.concat(split(layer.route.path))));
    else if (layer.name === "router" && layer.handle.stack)
      layer.handle.stack.forEach(add.bind(null, path.concat(split(layer.regexp))));
    else if (layer.method) {
      const method = layer.method.toUpperCase();
      const fullUrl = url + path.concat(split(layer.regexp)).filter(Boolean).join("/");
      table.addRow(method, fullUrl);
    }
  }
  //format url
  function split(thing) {
    if (typeof thing === "string") return thing.split("/");
    else if (thing.fast_slash) return "";
    else {
      var match = thing
        .toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
      return match ? match[1].replace(/\\(.)/g, "$1").split("/") : "<complex:" + thing.toString() + ">";
    }
  }
  app._router.stack.forEach(add.bind(null, []));
  if (silent) return true;
  console.log(table.toString());
}

/*[ External access ]*/
module.exports = { until, capitalize, endPlural, smartInclude, offloadFields, handleIngAdding, printAllRoutes };
