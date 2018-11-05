import * as Fs from "fs"

import Copy from '../task/tasks/copy'
export default function (config, callback) {
    let result = Fs.existsSync(__dirname + '/../../template/' + config.params[0]);
    if (!result) {
        return callback(`not find ${config.params[0]} template`);
    }
    Copy({
        method: "copy",
        params: [__dirname + '/../../template/' + config.params[0], config.params[1] || './', {}]
    }, callback);
}