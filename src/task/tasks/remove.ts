import { Method } from "..";
import { fs } from "../../utils";
import * as latte_lib from "latte_lib"
export default function (method: Method, callback) {
  latte_lib.async.parallel(method.params.map((o) => {
    return (cb) => {
      fs.rm(o.path, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return cb();
          }
          return cb(err);
        }
        cb();
      });
    }
  }), callback);
}