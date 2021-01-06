'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3Configuration = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const os = require("os");
class Proto3Configuration {
    constructor() {
        this._configSection = 'protoc';
        this._config = vscode.workspace.getConfiguration(this._configSection);
        vscode.workspace.onDidChangeConfiguration(event => {
            this._config = vscode.workspace.getConfiguration(this._configSection);
        });
        this._configResolver = new ConfigurationResolver();
    }
    static Instance() {
        if (Proto3Configuration._instance == null) {
            this._instance = new Proto3Configuration();
        }
        return Proto3Configuration._instance;
    }
    getProtocPath(protocInPath) {
        let protoc = protocInPath ? 'protoc' : '?';
        return this._configResolver.resolve(this._config.get('path', protoc));
    }
    getProtoSourcePath() {
        let activeEditor = vscode.window.activeTextEditor;
        let activeEditorUri = activeEditor.document.uri;
        let activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditorUri);
        return this._configResolver.resolve(this._config.get('compile_all_path', activeWorkspaceFolder.uri.path));
    }
    getProtocArgs() {
        return this._configResolver.resolve(this._config.get('options', []));
    }
    getProtocArgFiles() {
        return this.getProtocArgs().filter(arg => !arg.startsWith('-'));
    }
    getProtocOptions() {
        return this.getProtocArgs().filter(arg => arg.startsWith('-'));
    }
    getProtoPathOptions() {
        return this.getProtocOptions()
            .filter(opt => opt.startsWith('--proto_path') || opt.startsWith('-I'));
    }
    getAllProtoPaths() {
        return this.getProtocArgFiles().concat(ProtoFinder.fromDir(this.getProtoSourcePath()));
    }
    getTmpJavaOutOption() {
        return '--java_out=' + os.tmpdir();
    }
    compileOnSave() {
        return this._config.get('compile_on_save', false);
    }
}
exports.Proto3Configuration = Proto3Configuration;
Proto3Configuration._instance = null;
class ProtoFinder {
    static fromDir(root) {
        let search = function (dir) {
            let files = fs.readdirSync(dir);
            let protos = files.filter(file => file.endsWith('.proto'))
                .map(file => path.join(path.relative(root, dir), file));
            files.map(file => path.join(dir, file))
                .filter(file => fs.statSync(file).isDirectory())
                .forEach(subDir => {
                protos = protos.concat(search(subDir));
            });
            return protos;
        };
        return search(root);
    }
}
// Workaround to substitute variable keywords in the configuration value until
// workbench/services/configurationResolver is available on Extention API.
//
// 
// Some codes are copied from:
// src/vs/workbench/services/configurationResolver/node/configurationResolverService.ts
class ConfigurationResolver {
    constructor() {
        Object.keys(process.env).forEach(key => {
            this[`env.${key}`] = process.env[key];
        });
    }
    resolve(value) {
        if (typeof value === 'string') {
            return this.resolveString(value);
        }
        else if (this.isArray(value)) {
            return this.resolveArray(value);
        }
        return value;
    }
    isArray(array) {
        if (Array.isArray) {
            return Array.isArray(array);
        }
        if (array && typeof (array.length) === 'number' && array.constructor === Array) {
            return true;
        }
        return false;
    }
    resolveArray(value) {
        return value.map(s => this.resolveString(s));
    }
    resolveString(value) {
        let regexp = /\$\{(.*?)\}/g;
        const originalValue = value;
        const resolvedString = value.replace(regexp, (match, name) => {
            let newValue = this[name];
            if (typeof newValue === 'string') {
                return newValue;
            }
            else {
                return match && match.indexOf('env.') > 0 ? '' : match;
            }
        });
        return this.resolveConfigVariable(resolvedString, originalValue);
    }
    resolveConfigVariable(value, originalValue) {
        let regexp = /\$\{config\.(.+?)\}/g;
        return value.replace(regexp, (match, name) => {
            let config = vscode.workspace.getConfiguration();
            let newValue;
            try {
                const keys = name.split('.');
                if (!keys || keys.length <= 0) {
                    return '';
                }
                while (keys.length > 1) {
                    const key = keys.shift();
                    if (!config || !config.hasOwnProperty(key)) {
                        return '';
                    }
                    config = config[key];
                }
                newValue = config && config.hasOwnProperty(keys[0]) ? config[keys[0]] : '';
            }
            catch (e) {
                return '';
            }
            if (typeof newValue === 'string') {
                // Prevent infinite recursion and also support nested references (or tokens)
                return newValue === originalValue ? '' : this.resolveString(newValue);
            }
            else {
                return this.resolve(newValue) + '';
            }
        });
    }
    get workspaceRoot() {
        return vscode.workspace.rootPath;
    }
    get workspaceFolder() {
        let activeEditor = vscode.window.activeTextEditor;
        let activeEditorUri = activeEditor.document.uri;
        let activeWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditorUri);
        return activeWorkspaceFolder.uri.path;
    }
}
//# sourceMappingURL=proto3Configuration.js.map