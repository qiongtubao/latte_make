(function () {
    if (window.latte && window.latte.define) {
        return;
    }
    var LATTE_NAMESPACE = "latte";
    var global = (function () {
        return this;
    })();
    if (!LATTE_NAMESPACE && typeof window.requirejs !== "undefined")
        return;
    var _define = function (module, deps, payload) {
        if (typeof module !== 'string') {
            if (_define.original)
                _define.original.apply(window, arguments);
            else {
                console.error('dropping module because define wasn\'t a string.');
                console.trace();
            }
            return;
        }
        if (arguments.length == 2)
            payload = deps;
        if (!_define.modules) {
            _define.modules = {};
            _define.payloads = {};
        }
        _define.payloads[module] = payload;
        _define.modules[module] = null;
    };
    var _require = function (parentId, module, callback) {
        if (Object.prototype.toString.call(module) === "[object Array]") {
            var params = [];
            for (var i = 0, l = module.length; i < l; ++i) {
                var dep = lookup(parentId, module[i]);
                if (!dep && _require.original)
                    return _require.original.apply(window, arguments);
                params.push(dep);
            }
            if (callback) {
                callback.apply(null, params);
            }
        }
        else if (typeof module === 'string') {
            var payload = lookup(parentId, module);
            if (!payload && _require.original)
                return _require.original.apply(window, arguments);
            if (callback) {
                callback();
            }
            return payload;
        }
        else {
            if (_require.original)
                return _require.original.apply(window, arguments);
        }
    };
    var resolve = function (parentId, moduleName) {
        if (moduleName.charAt(0) == ".") {
            var ps = parentId.split("/");
            var base = ps.pop();
            var ms = moduleName.split("/");
            var n;
            while ((n = ms.shift())) {
                if (n == "..") {
                    ps.pop();
                }
                else if (n != ".") {
                    ps.push(n);
                }
            }
            return ps.join("/");
        }
        return moduleName;
    };
    var normalizeModule = function (parentId, moduleName) {
        if (moduleName.indexOf("!") !== -1) {
            var chunks = moduleName.split("!");
            return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
        }
        var name = resolve(parentId, moduleName);
        return name;
    };
    var lookup = function (parentId, moduleName) {
        moduleName = normalizeModule(parentId, moduleName);
        if (window.latte.DEBUG) {
            console.log(parentId, moduleName);
        }
        var module = _define.modules[moduleName];
        if (!module) {
            module = _define.payloads[moduleName];
            if (typeof module === 'function') {
                var exports = {};
                var mod = {
                    id: moduleName,
                    uri: '',
                    exports: exports,
                    packaged: true
                };
                var req = function (module, callback) {
                    return _require(moduleName, module, callback);
                };
                var splitDir = moduleName.split("/");
                splitDir.pop();
                var dirname = splitDir.join("/");
                var returnValue = module(req, exports, mod, global, moduleName, dirname);
                exports = returnValue || mod.exports;
                _define.modules[moduleName] = exports;
                delete _define.payloads[moduleName];
                module = exports;
            }
            if (!module && moduleName.indexOf(".js") == -1) {
                module = lookup(parentId, moduleName + ".js");
            }
            if (!module && moduleName.indexOf("/index") == -1) {
                module = lookup(parentId, moduleName + "/index");
            }
            if (!module && moduleName.indexOf("/index.js") == -1) {
                module = lookup(parentId, moduleName + "/index.js");
            }
        }
        if (!module) {
        }
        return module;
    };
    function exportWindow(ns) {
        var require = function (module, callback) {
            return _require("", module, callback);
        };
        var root = global;
        if (ns) {
            if (!global[ns])
                global[ns] = {};
            root = global[ns];
        }
        if (!root.define || !root.define.packaged) {
            _define.original = root.define;
            root.define = _define;
            root.define.packaged = true;
        }
        if (!root.require || !root.require.packaged) {
            _require.original = root.require;
            root.require = require;
            root.require.packaged = true;
            root.require.find = function (path, all, type) {
                var pathStrNum = path.length;
                var callbackArray = [];
                Object.keys(_define.modules).forEach(function (p) {
                    if (p.indexOf(path) == 0) {
                        var nPath = p.substring(pathStrNum);
                        if (all) {
                            callbackArray.push(nPath);
                        }
                        else {
                            if (nPath.indexOf("/") == -1) {
                                callbackArray.push(nPath);
                            }
                        }
                    }
                });
                return callbackArray;
            };
        }
    }
    exportWindow(LATTE_NAMESPACE);
})();
window.latte.global = this;
this.define = window.latte.define;
(function () {
    this.config = {};
}).call(window.latte);
