'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
/**
 * Returns imports for document.
 */
function getCurrentDocumentImportPaths(symbolsList, currentPath) {
    for (let i = 0; i < symbolsList.length; i++) {
        if (symbolsList[i].document === currentPath) {
            return symbolsList[i].imports.map((x) => x.filepath);
        }
    }
    return [];
}
exports.getCurrentDocumentImportPaths = getCurrentDocumentImportPaths;
/**
 * Returns the path to the document, relative to the current document.
 */
function getDocumentPath(currentPath, symbolsPath) {
    const rootUri = path.dirname(currentPath);
    const docPath = path.relative(rootUri, symbolsPath);
    if (docPath === path.basename(currentPath)) {
        return 'current';
    }
    return docPath.replace(/\\/g, '/');
}
exports.getDocumentPath = getDocumentPath;
