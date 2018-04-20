var args = Array.prototype.splice.call(process.argv, 2);
var methodName = args.shift();
var method;
try {
    method = require('../lib/init/' + methodName)["default"];
}
catch (err) {
    method = require('../lib/init/index')["default"];
    args.unshift(methodName);
    methodName = 'init';
}
var startTime = Date.now();
method({
    method: methodName,
    params: args
}, function (err) {
    if (err) {
        return console.log('run failed: ', err);
    }
    console.log('run success:', Date.now() - startTime, 'ms');
});
