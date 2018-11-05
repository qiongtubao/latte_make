var args = Array.prototype.splice.call(process.argv, 2);
var method = require('../lib/make/index')["default"];
var methodName = args.shift();
var startTime = Date.now();
method({
    method: methodName || "main",
    params: args
}, function (err) {
    if (err) {
        return console.log('run failed: ', err);
    }
    console.log('run success:', Date.now() - startTime, 'ms');
});
