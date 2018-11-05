"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
function default_1(method, callback) {
    var program = ts.createProgram({
        rootNames: [method.params[0].inPath],
        options: {
            outDir: method.params[0].outPath
        }
    });
    var result = program.emit();
    console.log(method.params[0]);
    if (result.emitSkipped && result.diagnostics.length > 0) {
        callback(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
    }
    else if (result.diagnostics.length > 0) {
        callback(ts.ExitStatus.DiagnosticsPresent_OutputsGenerated);
    }
    callback();
}
exports.default = default_1;
