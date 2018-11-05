"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fs = require("fs");
var latte_lib = require("latte_lib");
var getConfig = function (config, path) {
    if (!config.path || (!Fs.existsSync(config.path))) {
        config.path = process.cwd() + "/.latte/" + path;
    }
    if (!Fs.existsSync(config.path)) {
        return null;
    }
    var data = Fs.readFileSync(config.path).toString();
    return JSON.parse(data);
};
var getCommand = function (command) {
    return function (callback) {
        try {
            var handle = require("../task/tasks/" + command.method).default;
            handle(command, callback);
        }
        catch (err) {
            callback(err);
        }
    };
};
var createAuto = function (method, config) {
    var data = {};
    var values = config[method];
    var _loop_1 = function (key) {
        if (latte_lib.utils.isArray(values[key])) {
            var command = values[key].pop();
            if (latte_lib.utils.isObject(command)) {
                (function (command) {
                    values[key].push(function (o, callback) {
                        getCommand(command)(callback);
                    });
                })(command);
                data[key] = values[key];
            }
            else if (latte_lib.utils.isString(command) && command[0] == "$") {
                var c = command.substring(1);
                var d = createAuto(c, config);
                if (d == null) {
                    return { value: null };
                }
                (function (d, key) {
                    values[key].push(function (o, cb) {
                        latte_lib.async.auto(d, cb);
                    });
                    data[key] = values[key];
                })(d, key);
            }
            else {
                return { value: null };
            }
        }
        else if (latte_lib.utils.isObject(values[key])) {
            data[key] = getCommand(values[key]);
        }
        else if (latte_lib.utils.isString(values[key]) && values[key][0] == "$") {
            var c = values[key].substring(1);
            var d = createAuto(c, config);
            if (d == null) {
                return { value: null };
            }
            (function (d, key) {
                data[key] = function (cb) {
                    latte_lib.async.auto(d, cb);
                };
            })(d, key);
        }
        else {
            return { value: null };
        }
    };
    for (var key in values) {
        var state_1 = _loop_1(key);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return data;
};
exports.default = (function (opts, callback) {
    var config = getConfig(opts, "make.json");
    if (config == null) {
        return callback("not find config file");
    }
    if (!config[opts.method]) {
        return callback("config error not find " + opts.method + " command");
    }
    var data = createAuto(opts.method, config);
    if (data == null) {
        return callback("config " + opts.method + " command data error");
    }
    latte_lib.async.auto(data, callback);
});
