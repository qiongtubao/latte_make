import * as ts from "typescript"
import { Method } from "..";
export default function (method: Method, callback) {
  let program = ts.createProgram({
    rootNames: [method.params[0].inPath],
    options: {
      outDir: method.params[0].outPath
    }
  });
  let result = program.emit();
  console.log(method.params[0])
  if (result.emitSkipped && result.diagnostics.length > 0) {
    callback(ts.ExitStatus.DiagnosticsPresent_OutputsSkipped);
  } else if (result.diagnostics.length > 0) {
    callback(ts.ExitStatus.DiagnosticsPresent_OutputsGenerated);
  }
  callback();
}