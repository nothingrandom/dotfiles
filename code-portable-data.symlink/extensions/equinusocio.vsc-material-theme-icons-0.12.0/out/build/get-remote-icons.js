"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const execa = require("execa");
const rimraf = require("rimraf");
const ncp_1 = require("ncp");
const pCopy = (src, dest) => new Promise((resolve, reject) => ncp_1.ncp(src, dest, err => err ? reject(err) : resolve()));
const pRm = (dir) => new Promise((resolve, reject) => rimraf(dir, (err) => err ? reject(err) : resolve()));
/**
 * Get remote Material Icons
 */
exports.default = () => __awaiter(this, void 0, void 0, function* () {
    const src = 'ssh://equinsuocha@vs-ssh.visualstudio.com:22/vsc-material-theme-icons/_ssh/vsc-material-theme-icons';
    const tmpDest = './_tmp-output-remote-icons';
    const dest = './src/icons/svgs';
    yield execa('git', [
        'clone',
        '--depth=1',
        src,
        tmpDest
    ]);
    yield pCopy(path.join(tmpDest, dest), dest);
    yield pRm(tmpDest);
});
//# sourceMappingURL=get-remote-icons.js.map