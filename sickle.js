"use strict";

const path   = require("path");
const events = require('events');

function core(core_entry_point, opts) {
    const core_module = require(core_entry_point);
    var emitter = new events();
    var worker = new core_module.AsyncWorker(
        function(event, value) { emitter.emit(event, value); }, 
        function () { emitter.emit("close"); }, 
        function(error) { emitter.emit("error", error); }, 
        opts
    );
    return {
        from: emitter,
        emit_to: function(name, data) { worker.sendToCpp(name, data); }
    };
}

const core_path   = path.join(__dirname, "node_modules/sickle_core/build/Release/sickle_core.node");
const sickle_core = core(core_path, { foo: "bar" });

sickle_core.from.on('integer', function(value) {
    console.log(value);
});

let i = 0;
setInterval(function() {
    sickle_core.emit_to("input" + ++i, "here's something");
}, 100);