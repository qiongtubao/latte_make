"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fs = require("fs");
var Path = require("path");
var mkdirSync = function (path, options) {
    if (Fs.existsSync(path)) {
        return null;
    }
    if (!Fs.existsSync(Path.dirname(path))) {
        var error = mkdirSync(Path.dirname(path), options);
        if (error) {
            return error;
        }
    }
    return Fs.mkdirSync(path, options);
};
exports.mkdirSync = mkdirSync;
var readFileSync = function (filePath) {
    return Fs.readFileSync(filePath).toString();
};
exports.readFileSync = readFileSync;
var writeFileSync = function (filePath, data, options) {
    return Fs.writeFileSync(filePath, data, options);
};
exports.writeFileSync = writeFileSync;
var readDirSync = function (dirPath) {
    return Fs.readdirSync(dirPath);
};
exports.readDirSync = readDirSync;
var statSync = function (filename) {
    return Fs.statSync(filename);
};
exports.statSync = statSync;
var writeFile = function (filePath, data, options, callback) {
    return Fs.writeFile(filePath, data, options, callback);
};
exports.writeFile = writeFile;
var unlink = function (path, callback) {
    return Fs.unlink(path, callback);
};
exports.unlink = unlink;
var rmDir = function (path, callback) {
    return Fs.rmdir(path, callback);
};
exports.rmDir = rmDir;
var deleteFolderRecursive = function (path) {
    if (Fs.existsSync(path)) {
        Fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (Fs.statSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                Fs.unlinkSync(curPath);
            }
        });
        Fs.rmdirSync(path);
    }
};
var rm = function (path, callback) {
    if (!Fs.existsSync(path)) {
        return callback(undefined);
    }
    var stat = Fs.statSync(path);
    if (stat.isFile()) {
        Fs.unlink(path, callback);
    }
    else {
        try {
            deleteFolderRecursive(path);
        }
        catch (err) {
            return callback(err);
        }
        callback(undefined);
    }
};
exports.rm = rm;
