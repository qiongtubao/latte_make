let args = Array.prototype.splice.call(process.argv, 2);
let methodName = args.shift();
let method ;
try {
    method = require('../lib/init/' + methodName).default;
}catch(err) {
    method = require('../lib/init/index').default;
    args.unshift(methodName);  
    methodName = 'init';  
}
let startTime = Date.now();
method({
    method: methodName,
    params: args
}, (err) => {
    if(err) {
        return console.log('run failed: ', err);
    }
    console.log('run success:', Date.now() - startTime, 'ms');
});
