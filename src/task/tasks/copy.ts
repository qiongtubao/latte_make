import {Method} from '../index'
let Fs = require('fs')
let Path = require('path')
let latte_lib = require('latte_lib')
interface Opts {
    ignore?: Array<RegExp>;
}
class Copy {
    opts: Opts;
    constructor(opts?) {
        this.opts = opts || {};
    }
    copy(fromPath, toPath, callback) {
        if(this.opts.ignore) {
            for(let i = 0, len = this.opts.ignore.length; i < len; i++) {
                if(this.opts.ignore[i].test(fromPath)) {
                    return callback();
                }
            }
        }
        let stat = Fs.statSync(fromPath);
        if(stat.isFile()) {
            this.copyFile(fromPath, toPath, callback);
        }else if(stat.isDirectory()) {
            this.copyDir(fromPath, toPath, callback);
        }else{
            callback();
        }

    }
    copyFile(fromPath, toPath, callback) {
        try {
            let from = Fs.createReadStream(fromPath)
            this.mkdir(Path.dirname(toPath), function(error) {
                var to = Fs.createWriteStream(toPath);
                from.pipe(to);
                callback(null);
            });
        }catch(e) {
            callback(e);
        }
    }
    mkdir(toPath, callback) {
        let self = this;
        Fs.exists(toPath, function(exists) {
            if(exists) {
                callback(null, toPath);
            }else{
                self.mkdir(Path.dirname(toPath), (err) => {
                    if(err) { return callback(err); }
                    Fs.mkdir(toPath, 0o777,  callback);
                });
            }
        });
    }
    copyDir(fromPath, toPath, callback) {
        let self = this;
        this.mkdir(toPath, () => {
            let files = Fs.readdirSync(fromPath);
			let all = files.map(function(file) {
				return function(cb) {
					self.copy(fromPath + '/' + file, toPath + '/'+ file , cb);
				}
			});
			latte_lib.async.parallel(all, callback);
        });
    }
}
export default (method:Method, callback) => {
    let opts = method.params[2];
    //以后用latte_verify
    if(opts &&  opts.ignore && opts.ignore.length && !opts.ignore[0].test) {
        opts.ignore = opts.ignore.map(function(str) {
            return new RegExp(str, 'ig');
        });
    }
    let c = new Copy(opts);
    c.copy(method.params[0], method.params[1], callback);
}