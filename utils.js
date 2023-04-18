//[Import]
const AsciiTable = require("ascii-table");

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
    string[index++] = aidLib.capitalize(str);
  });
  return string;
}
//aid func
function capitalizeSentence(_string) {
  const strings = _string.split("-");
  var string = "";
  strings.forEach((str) => {
    string += aidLib.capitalize(str);
  });
  return string;
}

//Update fields in object
function offloadFields(fields, object1, object2) {
  if (!object1) object1 = new Object();
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

//Prints all registered routes
function printAllRoutes(app, url) {
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
  console.log(table.toString());
}

/*[ External access ]*/
module.exports = { until, capitalize, offloadFields, printAllRoutes };
