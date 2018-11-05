
import { fs } from "../../../utils";
import * as latte_lib from "latte_lib"
export default function (file, alias, callback) {
  let fileData = fs.readFileSync(file);
  //  let templateData = fs.readFileSync(__dirname + '/template');
  return callback(null, ['(function(define) {\'use strict\'',
    '\tdefine("' + alias + '", ["require", "exports", "module", "window","__filename", "__dirname"], function(require, exports, module, window, __filename, __dirname) {',
    "\t\t" + fileData.toString().split("\n").join("\n\t\t"),
    '\t});',
    '})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });'].join("\n")
  );
}