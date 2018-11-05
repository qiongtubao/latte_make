"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var latte_lib = require("latte_lib");
function default_1(method, callback) {
    latte_lib.async.parallel(method.params.map(function (o) {
        return function (cb) {
            utils_1.fs.rm(o.path, function (err) {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return cb();
                    }
                    return cb(err);
                }
                cb();
            });
        };
    }), callback);
}
exports.default = default_1;
