"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
var latte_lib = require("latte_lib");
function default_1(file, alias, callback) {
    var fileData = utils_1.fs.readFileSync(file);
    var templateData = utils_1.fs.readFileSync(__dirname + '/template');
    return callback(null, latte_lib.format.templateStringFormat(templateData, {
        path: alias,
        data: "module.exports = '" + fileData.toString().replace(/[\n]/g, "\\n").replace(/'/g, '\"').toString() + "';"
    }));
}
exports.default = default_1;
