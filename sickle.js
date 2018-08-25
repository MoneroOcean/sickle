"use strict";

const path   = require("path");
const events = require('events');

function core(cpp_entry_point, opts) {
    const stream2node = require(cpp_entry_point);
    var emitter = new events();

    var worker = new stream2node.StreamingWorker(
        function(event, value){
            emitter.emit(event, value);
        }, 
        function () {
            emitter.emit("close");
        }, 
        function(error) {
            emitter.emit("error", error);
        }, 
        opts
    );

    var sw = {};
    
    sw.from = emitter;
    sw.to = {
        emit: function(name, data) {
            worker.sendToAddon(name, data);
        }
    }
    sw.close = worker.closeInput;
               
    return sw;
}

const core_path   = path.join(__dirname, "node_modules/sickle_core/build/Release/sickle_core.node");
const sickle_core = code(core_path, { foo: "bar" });

sickle_core.from.on('integer', function(value) {
  console.log(value);
});

let i = 0;
setInterval(function() { sickle_core.to.emit("input" + ++i, "here's something"); }, 100);