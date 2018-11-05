
import * as Fs from "fs"
import * as latte_lib from "latte_lib"
import { create } from "../../../../latte_class/tsd/removeIdle";
let getConfig = (config, path) => {
    if (!config.path || (!Fs.existsSync(config.path))) {
        config.path = process.cwd() + "/.latte/" + path;
    }
    if (!Fs.existsSync(config.path)) {
        return null;
    }
    let data = Fs.readFileSync(config.path).toString();
    return JSON.parse(data);
}
let getCommand = (command) => {
    return function (callback) {
        try {
            var handle = require("../task/tasks/" + command.method).default;
            handle(command, callback);
        } catch (err) {
            callback(err);
        }
    }
}
let createAuto = (method, config) => {
    let data: any = {};
    let values = config[method];
    for (let key in values) {
        if (latte_lib.utils.isArray(values[key])) {
            let command = values[key].pop();
            if (latte_lib.utils.isObject(command)) {
                ((command) => {
                    values[key].push((o, callback) => {
                        getCommand(command)(callback);
                    });
                })(command);
                data[key] = values[key];
            } else if (latte_lib.utils.isString(command) && command[0] == "$") {
                let c = command.substring(1);
                let d = createAuto(c, config);
                if (d == null) {
                    return null;
                }
                (function (d, key) {
                    values[key].push((o, cb) => {
                        latte_lib.async.auto(d, cb);
                    });
                    data[key] = values[key];
                })(d, key);
            } else {
                return null;
            }
        } else if (latte_lib.utils.isObject(values[key])) {
            data[key] = getCommand(values[key]);
        } else if (latte_lib.utils.isString(values[key]) && values[key][0] == "$") {
            let c = values[key].substring(1);
            let d = createAuto(c, config);
            if (d == null) {
                return null;
            }
            (function (d, key) {
                data[key] = (cb) => {
                    latte_lib.async.auto(d, cb);
                };
            })(d, key);
        } else {
            return null;
        }
    }
    return data;
}
export default (opts, callback) => {
    let config = getConfig(opts, "make.json");
    if (config == null) {
        return callback("not find config file");
    }
    if (!config[opts.method]) {
        return callback(`config error not find ${opts.method} command`);
    }
    let data = createAuto(opts.method, config);
    if (data == null) {
        return callback(`config ${opts.method} command data error`);
    }
    latte_lib.async.auto(data, callback);
    //console.log(data.clean.toString());
    //callback();
}