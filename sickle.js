"use strict";

const worker = require("streaming-worker");

const path = require("path");
const addon_path = path.join(__dirname, "node_modules/sickle");
const sickle = worker(addon_path, {foo: "bar"});

sickly.from.on('integer', function(value){
    console.log(value);
});