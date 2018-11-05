"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var latte_lib = require("latte_lib");
var utils_1 = require("../../utils");
var Path = require("path");
var types = require("./mergeJs/index");
var mergeFile = function (inPath, alias, callback) {
    var type = Path.extname(inPath).substring(1);
    var handle;
    if (types[type]) {
        handle = types[type];
    }
    else {
        handle = types.file;
    }
    handle(inPath, alias, callback);
};
var mergeDir = function (inPath, alias, callback) {
    var files = utils_1.fs.readDirSync(inPath);
    var all = files.map(function (file) {
        return function (cb) {
            mergeJs(inPath + '/' + file, alias + '/' + file, cb);
        };
    });
    latte_lib.async.parallel(all, function (err, data) {
        if (err) {
            return callback(err);
        }
        callback(undefined, data.join('\n'));
    });
};
var mergeJs = function (inPath, alias, callback) {
    var stat = utils_1.fs.statSync(inPath);
    if (stat.isFile()) {
        mergeFile(inPath, alias, callback);
    }
    else {
        mergeDir(inPath, alias, callback);
    }
};
function default_1(method, callback) {
    var param = method.params[0];
    mergeJs(param.inPath, param.alias, function (err, data) {
        if (err) {
            return callback(err);
        }
        utils_1.fs.mkdirSync(Path.dirname(param.outPath));
        if (param.root) {
            var rootFile = utils_1.fs.readFileSync(__dirname + "/mergeJs/root.js");
            data = rootFile + data;
        }
        if (param.main) {
            var mainFile = utils_1.fs.readFileSync(param.main);
            data += "\n" + mainFile;
        }
        utils_1.fs.writeFileSync(param.outPath, data, {
            encoding: "utf8"
        });
        callback();
    });
}
exports.default = default_1;
