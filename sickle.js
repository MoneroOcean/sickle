"use strict";

const path   = require("path");
const worker = require("streaming-worker");

const addon_path  = path.join(__dirname, "node_modules/sickle_core/build/Release/sickle_core.node");
const sickle_core = worker(addon_path, { foo: "bar" });

sickle_core.from.on('integer', function(value) {
  console.log(value);
});

let i = 0;
setInterval(1000, function() { sickle_core.to.emit("input" + ++i, "here's something"); })