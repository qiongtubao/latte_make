"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
function default_1(file, alias, callback) {
    var fileData = utils_1.fs.readFileSync(file);
    return callback(null, ['(function(define) {\'use strict\'',
        '\tdefine("' + alias + '", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {',
        "\t\t" + fileData.toString().split("\n").join("\n\t\t"),
        '\t});',
        '})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });'].join("\n"));
}
exports.default = default_1;
