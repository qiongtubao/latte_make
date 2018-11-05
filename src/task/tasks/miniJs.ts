import { Method } from "..";
import { fs } from "../../utils";
import * as uglifyJs from "uglify-js"

export default function (method: Method, callback) {
  let param = method.params[0];
  let data = fs.readFileSync(param.inPath);
  var result = uglifyJs.minify([data.toString()]);
  if (result.code) {
    fs.writeFile(param.outPath, result.code, callback);
  } else {
    callback(result);
  }
}