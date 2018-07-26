"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const gulp = require("gulp");
const execa = require("execa");
const rimraf = require("rimraf");
const ncp_1 = require("ncp");
const pCopy = (src, dest) => new Promise((resolve, reject) => ncp_1.ncp(src, dest, err => err ? reject(err) : resolve()));
const pRm = (dir) => new Promise((resolve, reject) => rimraf(dir, (err) => err ? reject(err) : resolve()));
/**
 * Get remote Material Icons
 */
exports.default = gulp.task('build:get-remote-icons', callback => {
    const src = 'ssh://equinsuocha@vs-ssh.visualstudio.com:22/vsc-material-theme-icons/_ssh/vsc-material-theme-icons';
    const tmpDest = './_tmp-output-remote-icons';
    const dest = './src/icons/svgs';
    execa('git', [
        'clone',
        '--depth=1',
        src,
        tmpDest
    ])
        .then(() => pCopy(path.join(tmpDest, dest), dest))
        .then(() => pRm(tmpDest))
        .then(() => callback())
        .catch((err) => callback(err.message));
});
//# sourceMappingURL=get-remote-icons.js.map