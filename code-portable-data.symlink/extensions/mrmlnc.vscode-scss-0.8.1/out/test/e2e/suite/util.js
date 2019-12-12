"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
/**
 * Line and Char as shown in lowerright of VS Code
 */
function position(line, char) {
    return new vscode.Position(line - 1, char - 1);
}
exports.position = position;
function getDocPath(p) {
    return path.resolve(__dirname, '../../../../fixtures/e2e', p);
}
exports.getDocPath = getDocPath;
function getDocUri(p) {
    return vscode.Uri.file(getDocPath(p));
}
exports.getDocUri = getDocUri;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
async function showFile(docUri) {
    const doc = await vscode.workspace.openTextDocument(docUri);
    return await vscode.window.showTextDocument(doc);
}
exports.showFile = showFile;
//# sourceMappingURL=util.js.map