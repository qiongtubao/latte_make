import { fs } from "../../../utils";
import * as latte_lib from "latte_lib"
export default function (file, alias, callback) {
  let fileData = fs.readFileSync(file);
  let templateData = fs.readFileSync(__dirname + '/template');
  return callback(null, latte_lib.format.templateStringFormat(templateData, {
    path: alias,
    data: "module.exports = '" + fileData.toString().replace(/[\n]/g, "\\n").replace(/'/g, '\"').toString() + "';"
  }));
}