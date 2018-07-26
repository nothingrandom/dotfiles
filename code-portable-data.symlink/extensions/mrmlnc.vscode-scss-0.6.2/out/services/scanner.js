'use strict';
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
const readdir = require("readdir-enhanced");
const micromatch = require("micromatch");
const vscode_languageserver_1 = require("vscode-languageserver");
const parser_1 = require("./parser");
const fs_1 = require("../utils/fs");
// RegExp's
const reGlobBaseName = /^\*\*\/([\w\.-]+)\/?$/;
/**
 * Returns Symbols for specified document.
 */
function makeSymbolsForDocument(cache, entry, settings) {
    return fs_1.readFile(entry.filepath).then((data) => {
        const doc = vscode_languageserver_1.TextDocument.create(entry.filepath, 'scss', 1, data);
        const { symbols } = parser_1.parseDocument(doc, null, settings);
        symbols.ctime = entry.ctime;
        cache.set(entry.filepath, symbols);
        return symbols;
    });
}
/**
 * Create IFile interface.
 */
function makeEntryFile(filepath, ctime) {
    return {
        filepath: filepath,
        dir: path.dirname(filepath),
        ctime
    };
}
/**
 * Returns Symbols from Imported files.
 */
function scannerImportedFiles(cache, symbolsList, settings) {
    let nesting = 0;
    function recurse(accum, list) {
        const importedFiles = [];
        // Prevent an infinite recursion and very deep `@import`
        if (list.length === 0 || (nesting === settings.scanImportedFilesDepth)) {
            return Promise.resolve(accum);
        }
        list.forEach((item) => {
            item.imports.forEach((x) => {
                // Not include dynamic paths
                if (x.dynamic || x.css) {
                    return;
                }
                // Not include in list Symbols from parent Symbols
                for (let i = 0; i < symbolsList.length; i++) {
                    if (symbolsList[i].document === x.filepath) {
                        return;
                    }
                }
                importedFiles.push(x.filepath);
            });
        });
        if (importedFiles.length === 0) {
            return Promise.resolve(accum);
        }
        return Promise.all(importedFiles.map((filepath) => {
            return fs_1.statFile(filepath).then((stat) => {
                const entry = makeEntryFile(filepath, stat.ctime);
                const cached = cache.get(filepath);
                if (cached && cached.ctime.getTime() >= entry.ctime.getTime()) {
                    return cached;
                }
                return makeSymbolsForDocument(cache, entry, settings);
            });
        })).then((resultList) => {
            nesting++;
            return recurse(accum.concat(resultList), resultList);
        });
    }
    return recurse([], symbolsList);
}
/**
 * Filter for files that are found by the scanner.
 */
function scannerFilter(stat, excludePatterns) {
    if (excludePatterns && micromatch(stat.path, excludePatterns).length !== 0) {
        return false;
    }
    else if (stat.isFile()) {
        return stat.path.slice(-5) === '.scss';
    }
    return true;
}
/**
 * Returns all Symbols in the opened workspase.
 */
function doScanner(root, cache, settings) {
    const listOfPromises = [];
    // Expand **/name to  **/name + **/name/** like VS Code
    const excludePatterns = settings.scannerExclude;
    if (settings.scannerExclude) {
        settings.scannerExclude.forEach((pattern) => {
            if (reGlobBaseName.test(pattern)) {
                excludePatterns.push(pattern + '/**');
            }
        });
    }
    // Update Cahce for all files
    return new Promise((resolve, reject) => {
        const stream = readdir.readdirStreamStat(root, {
            basePath: path.resolve(root),
            filter: (stat) => scannerFilter(stat, excludePatterns),
            deep: settings.scannerDepth
        });
        stream.on('data', () => {
            // Silence
        });
        stream.on('file', (stat) => {
            const entry = makeEntryFile(stat.path, stat.ctime);
            // Return Cache if it exists and not outdated
            const cached = cache.get(entry.filepath);
            if (cached && cached.ctime.getTime() >= entry.ctime.getTime()) {
                listOfPromises.push(cached);
                return;
            }
            listOfPromises.push(makeSymbolsForDocument(cache, entry, settings));
        });
        stream.on('error', (err) => {
            if (settings.showErrors) {
                reject(err);
            }
        });
        stream.on('end', () => __awaiter(this, void 0, void 0, function* () {
            let projectSymbols = [];
            let importedSymbols = [];
            try {
                projectSymbols = yield Promise.all(listOfPromises);
                if (settings.scanImportedFiles) {
                    importedSymbols = yield scannerImportedFiles(cache, projectSymbols, settings);
                }
            }
            catch (err) {
                if (settings.showErrors) {
                    reject(err);
                }
            }
            return resolve(projectSymbols.concat(importedSymbols));
        }));
    });
}
exports.doScanner = doScanner;
