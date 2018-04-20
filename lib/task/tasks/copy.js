"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fs = require('fs');
var Path = require('path');
var latte_lib = require('latte_lib');
var Copy = (function () {
    function Copy(opts) {
        this.opts = opts || {};
    }
    Copy.prototype.copy = function (fromPath, toPath, callback) {
        if (this.opts.ignore) {
            for (var i = 0, len = this.opts.ignore.length; i < len; i++) {
                if (this.opts.ignore[i].test(fromPath)) {
                    return callback();
                }
            }
        }
        var stat = Fs.statSync(fromPath);
        if (stat.isFile()) {
            this.copyFile(fromPath, toPath, callback);
        }
        else if (stat.isDirectory()) {
            this.copyDir(fromPath, toPath, callback);
        }
        else {
            callback();
        }
    };
    Copy.prototype.copyFile = function (fromPath, toPath, callback) {
        try {
            var from_1 = Fs.createReadStream(fromPath);
            this.mkdir(Path.dirname(toPath), function (error) {
                var to = Fs.createWriteStream(toPath);
                from_1.pipe(to);
                callback(null);
            });
        }
        catch (e) {
            callback(e);
        }
    };
    Copy.prototype.mkdir = function (toPath, callback) {
        var self = this;
        Fs.exists(toPath, function (exists) {
            if (exists) {
                callback(null, toPath);
            }
            else {
                self.mkdir(Path.dirname(toPath), function (err) {
                    if (err) {
                        return callback(err);
                    }
                    Fs.mkdir(toPath, 511, callback);
                });
            }
        });
    };
    Copy.prototype.copyDir = function (fromPath, toPath, callback) {
        var self = this;
        this.mkdir(toPath, function () {
            var files = Fs.readdirSync(fromPath);
            var all = files.map(function (file) {
                return function (cb) {
                    self.copy(fromPath + '/' + file, toPath + '/' + file, cb);
                };
            });
            latte_lib.async.parallel(all, callback);
        });
    };
    return Copy;
}());
exports.default = (function (method, callback) {
    var opts = method.params[2];
    if (opts && opts.ignore && opts.ignore.length && !opts.ignore[0].test) {
        opts.ignore = opts.ignore.map(function (str) {
            return new RegExp(str, 'ig');
        });
    }
    var c = new Copy(opts);
    c.copy(method.params[0], method.params[1], callback);
});
