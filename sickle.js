"use strict";

const path   = require("path");
const events = require('events');

function core(core_entry_point, opts) {
    const core_module = require(core_entry_point);
    var emitter = new events();
    var worker = new core_module.StreamingWorker(
        function(event, value) { emitter.emit(event, value); }, 
        function () { emitter.emit("close"); }, 
        function(error) { emitter.emit("error", error); }, 
        opts
    );
    return {
        from: emitter,
        to:   { emit: worker.sendToCpp }
    };
}

const core_path   = path.join(__dirname, "node_modules/sickle_core/build/Release/sickle_core.node");
const sickle_core = core(core_path, { foo: "bar" });

sickle_core.from.on('integer', function(value) {
    console.log(value);
});

let i = 0;
setInterval(function() {
    sickle_core.to.emit("input" + ++i, "here's something");
}, 100);