let args = Array.prototype.splice.call(process.argv, 2);

let method = require('../lib/make/index').default;
let methodName = args.shift();
let startTime = Date.now();
method({
  method: methodName,
  params: args
}, (err) => {
  if (err) {
    return console.log('run failed: ', err);
  }
  console.log('run success:', Date.now() - startTime, 'ms');
});
