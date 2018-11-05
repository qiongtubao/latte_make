"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var uglifyJs = require("uglify-js");
function default_1(method, callback) {
    var param = method.params[0];
    var data = utils_1.fs.readFileSync(param.inPath);
    var result = uglifyJs.minify([data.toString()]);
    if (result.code) {
        utils_1.fs.writeFile(param.outPath, result.code, callback);
    }
    else {
        callback(result);
    }
}
exports.default = default_1;
