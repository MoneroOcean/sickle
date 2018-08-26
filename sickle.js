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

let sickle_core = core("sickle-core", { foo: "bar" });

sickle_core.from.on("result", function(value) {
    console.log("RESULT: " + JSON.stringify(value));
});

sickle_core.from.on("error", function(value) {
    console.error("ERROR: " + JSON.stringify(value));
});

sickle_core.from.on("close", function() {
    console.log("CLOSE");
});

let i = 0;
setInterval(function() {
    if (sickle_core) sickle_core.emit_to("job", {
        "algo":     "cn/1",
        "ways":     "2",
        "soft_aes": "0",
        "blob_hex": "7f7ffeeaa0db054f15eca39c843cb82c15e5c5a7743e06536cb541d4e96e90ffd31120b7703aa90000000076a6f6e34a9977c982629d8fe6c8b45024cafca109eef92198784891e0df41bc03",
        "target":   "10000000",
    });
    else console.log("tick");
}, 5*1000);

setTimeout(function() {
    sickle_core.emit_to("close");
    sickle_core = null;
}, 20*1000);