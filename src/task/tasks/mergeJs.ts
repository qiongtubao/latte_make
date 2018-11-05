
import { Method } from "..";
import * as latte_lib from "latte_lib"
import { fs } from "../../utils";
import * as Path from "path"
import * as types from "./mergeJs/index"
let mergeFile = (inPath, alias, callback) => {
  let type = Path.extname(inPath).substring(1);
  let handle;
  if (types[type]) {
    handle = types[type]
  } else {
    handle = types.file;
  }
  handle(inPath, alias, callback);
}
let mergeDir = (inPath, alias, callback) => {
  let files = fs.readDirSync(inPath);
  let all = files.map((file) => {
    return (cb) => {
      mergeJs(inPath + '/' + file, alias + '/' + file, cb);
    }
  });
  latte_lib.async.parallel(all, (err, data) => {
    if (err) { return callback(err); }
    callback(undefined, data.join('\n'));
  });
}
let mergeJs = (inPath, alias, callback) => {
  let stat = fs.statSync(inPath);
  if (stat.isFile()) {
    mergeFile(inPath, alias, callback);
  } else {
    mergeDir(inPath, alias, callback);
  }
}
export default function (method: Method, callback) {
  let param = method.params[0];
  mergeJs(param.inPath, param.alias, (err, data) => {
    if (err) {
      return callback(err);
    }
    fs.mkdirSync(Path.dirname(param.outPath));
    if (param.root) {
      var rootFile = fs.readFileSync(__dirname + "/mergeJs/root.js");
      data = rootFile + data;
    }
    if (param.main) {
      var mainFile = fs.readFileSync(param.main);
      data += "\n" + mainFile;
    }
    fs.writeFileSync(param.outPath, data, {
      encoding: "utf8"
    });
    callback();

  });
}