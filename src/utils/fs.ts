import * as Fs from "fs"
import * as Path from "path"

let mkdirSync = (path: string, options?) => {
  if (Fs.existsSync(path)) {
    return null;
  }
  if (!Fs.existsSync(Path.dirname(path))) {
    var error = mkdirSync(Path.dirname(path), options);
    if (error) { return error; }
  }
  return Fs.mkdirSync(path, options);
}
let readFileSync = (filePath: string): string => {
  return Fs.readFileSync(filePath).toString();
}
let writeFileSync = (filePath: string, data: string, options?: any) => {
  return Fs.writeFileSync(filePath, data, options);
}
let readDirSync = (dirPath: string): any[] => {
  return Fs.readdirSync(dirPath);
}
let statSync = function (filename): Fs.Stats {
  return Fs.statSync(filename);
}
let writeFile = (filePath: string, data: string, options?, callback?: (error) => void) => {
  return Fs.writeFile(filePath, data, options, callback);
}
let unlink = (path: string, callback?: (error) => void) => {
  return Fs.unlink(path, callback);
}
let rmDir = (path: string, callback?: (error) => void) => {
  return Fs.rmdir(path, callback);
}
let deleteFolderRecursive = (path) => {
  if (Fs.existsSync(path)) {
    Fs.readdirSync(path).forEach(function (file) {
      var curPath = path + "/" + file;
      if (Fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        Fs.unlinkSync(curPath);
      }
    });
    Fs.rmdirSync(path);
  }
};
let rm = (path: string, callback: (error) => void) => {
  if (!Fs.existsSync(path)) {
    return callback(undefined);
  }
  let stat = Fs.statSync(path);
  if (stat.isFile()) {
    Fs.unlink(path, callback);
  } else {
    try {
      deleteFolderRecursive(path);
    } catch (err) {
      return callback(err);
    }
    callback(undefined);
  }
}
export {
  mkdirSync,
  readFileSync,
  writeFileSync,
  statSync,
  readDirSync,
  writeFile,
  unlink,
  rmDir,
  rm
}