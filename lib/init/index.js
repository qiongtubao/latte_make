"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fs = require('fs');
var copy_1 = require("../task/tasks/copy");
function default_1(config, callback) {
    var result = Fs.existsSync(__dirname + '/../../template/' + config.params[0]);
    if (!result) {
        return callback("not find " + config.params[0] + " template");
    }
    copy_1.default({
        method: "copy",
        params: [__dirname + '/../../template/' + config.params[0], config.params[1] || './', {}]
    }, callback);
}
exports.default = default_1;
