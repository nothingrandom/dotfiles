'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3Compiler = void 0;
const vscode = require("vscode");
const path = require("path");
const cp = require("child_process");
const proto3Configuration_1 = require("./proto3Configuration");
class Proto3Compiler {
    constructor() {
        this._config = proto3Configuration_1.Proto3Configuration.Instance();
        try {
            cp.execFileSync("protoc", ["-h"]);
            this._isProtocInPath = true;
        }
        catch (e) {
            this._isProtocInPath = false;
        }
    }
    compileAllProtos() {
        let args = this._config.getProtocOptions();
        // Compile in batch produces errors. Must be 1 by 1.
        this._config.getAllProtoPaths().forEach(proto => {
            this.runProtoc(args.concat(proto), undefined, (stdout, stderr) => {
                vscode.window.showErrorMessage(stderr);
            });
        });
    }
    compileActiveProto() {
        let editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId == 'proto3') {
            let fileName = editor.document.fileName;
            let args = this._config.getProtocOptions().concat(fileName);
            this.runProtoc(args, undefined, (stdout, stderr) => {
                vscode.window.showErrorMessage(stderr);
            });
        }
    }
    compileProtoToTmp(fileName, callback) {
        let proto = path.relative(vscode.workspace.rootPath, fileName);
        let args = this._config.getProtoPathOptions()
            .concat(this._config.getTmpJavaOutOption(), proto);
        this.runProtoc(args, undefined, (stdout, stderr) => {
            if (callback) {
                callback(stderr);
            }
        });
    }
    runProtoc(args, opts, callback) {
        let protocPath = this._config.getProtocPath(this._isProtocInPath);
        if (protocPath == "?") {
            return; // protoc is not configured
        }
        if (!opts) {
            opts = {};
        }
        opts = Object.assign(opts, { cwd: vscode.workspace.rootPath });
        cp.execFile(protocPath, args, opts, (err, stdout, stderr) => {
            if (err && stdout.length == 0 && stderr.length == 0) {
                // Assume the OS error if no messages to buffers because
                // "err" does not provide error type info.
                vscode.window.showErrorMessage(err.message);
                console.error(err);
                return;
            }
            if (callback) {
                callback(stdout, stderr);
            }
        });
    }
}
exports.Proto3Compiler = Proto3Compiler;
//# sourceMappingURL=proto3Compiler.js.map