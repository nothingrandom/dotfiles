"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_languageserver_1 = require("vscode-languageserver");
const fs_1 = require("../utils/fs");
const parser_1 = require("./parser");
class ScannerService {
    constructor(_storage, _settings) {
        this._storage = _storage;
        this._settings = _settings;
    }
    async scan(files, recursive = true) {
        const iterator = new Set(files);
        for (let filepath of iterator) {
            // Cast to the system file path style
            filepath = path.normalize(filepath);
            const originalFilepath = filepath;
            let isExistFile = await this._fileExists(filepath);
            const partialFilepath = this._formatPartialFilepath(filepath);
            const isPartialFile = filepath === partialFilepath;
            if (!isExistFile && !isPartialFile) {
                filepath = partialFilepath;
                isExistFile = await this._fileExists(filepath);
            }
            if (!isExistFile) {
                this._storage.delete(originalFilepath);
                this._storage.delete(partialFilepath);
                continue;
            }
            const content = await this._readFile(filepath);
            const document = vscode_languageserver_1.TextDocument.create(originalFilepath, 'scss', 1, content);
            const { symbols } = parser_1.parseDocument(document, null, this._settings);
            this._storage.set(filepath, Object.assign(Object.assign({}, symbols), { filepath }));
            if (!recursive || !this._settings.scanImportedFiles) {
                continue;
            }
            for (const symbol of symbols.imports) {
                if (symbol.dynamic || symbol.css) {
                    continue;
                }
                iterator.add(symbol.filepath);
            }
        }
    }
    _readFile(filepath) {
        return fs_1.readFile(filepath);
    }
    _fileExists(filepath) {
        return fs_1.fileExists(filepath);
    }
    _formatPartialFilepath(filepath) {
        const original = path.parse(filepath);
        return path.format(Object.assign(Object.assign({}, original), { base: '_' + original.base }));
    }
}
exports.default = ScannerService;
//# sourceMappingURL=scanner.js.map