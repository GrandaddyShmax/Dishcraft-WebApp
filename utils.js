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
module.exports = { until, printAllRoutes };
