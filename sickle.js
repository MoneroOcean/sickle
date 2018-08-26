"use strict";

const path   = require("path");
const events = require("events");

function core(core_name, opts) {
    const core_path   = path.join(__dirname, "node_modules/" + core_name + "/build/Release/" + core_name + ".node");
    const core_module = require(core_path);
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

const sickle_core = core("sickle-core", { foo: "bar" });

sickle_core.from.on('integer', function(value) {
    console.log(value);
});

let i = 0;
setInterval(function() {
    sickle_core.emit_to("input" + ++i, "here's something");
}, 100);

setTimer(function() { sickle_core.emit_to("close"); }, 5*1000);