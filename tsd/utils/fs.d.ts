/// <reference types="node" />
import * as Fs from "fs";
declare let mkdirSync: (path: string, options?: any) => any;
declare let readFileSync: (filePath: string) => string;
declare let writeFileSync: (filePath: string, data: string, options?: any) => void;
declare let readDirSync: (dirPath: string) => any[];
declare let statSync: (filename: any) => Fs.Stats;
declare let writeFile: (filePath: string, data: string, options?: any, callback?: (error: any) => void) => void;
declare let unlink: (path: string, callback?: (error: any) => void) => void;
declare let rmDir: (path: string, callback?: (error: any) => void) => void;
declare let rm: (path: string, callback: (error: any) => void) => void;
export { mkdirSync, readFileSync, writeFileSync, statSync, readDirSync, writeFile, unlink, rmDir, rm };
