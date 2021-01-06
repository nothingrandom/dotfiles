'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3DefinitionProvider = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const fg = require("fast-glob");
const proto3ScopeGuesser_1 = require("./proto3ScopeGuesser");
const proto3Import_1 = require("./proto3Import");
const proto3Primitive_1 = require("./proto3Primitive");
class Proto3DefinitionProvider {
    provideDefinition(document, position, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const scope = proto3ScopeGuesser_1.guessScope(document, position.line);
            if (scope.kind === proto3ScopeGuesser_1.Proto3ScopeKind.Comment) {
                return;
            }
            const targetRange = document.getWordRangeAtPosition(position);
            const targetDefinition = document.getText(targetRange);
            if (proto3Primitive_1.Proto3Primitive.isTypePrimitive(targetDefinition)) {
                return;
            }
            const lineText = document.lineAt(position).text;
            const importRegExp = new RegExp(`^\\s*import\\s+(\'|")((\\w+\/)*${targetDefinition})(\'|")\\s*;.*$`, 'i');
            const matchedGroups = importRegExp.exec(lineText);
            if (matchedGroups && matchedGroups.length == 5) {
                const importFilePath = matchedGroups[2];
                const location = this.findImportDefinition(importFilePath);
                if (location) {
                    return location;
                }
                vscode.window.showErrorMessage(`Could not find ${targetDefinition} definition.`);
            }
            const messageOrEnumPattern = `\\s*(\\w+\\.)*\\w+\\s*`;
            const messageFieldPattern = `\\s+\\w+\\s*=\\s*\\d+;.*`;
            const rpcReqOrRspPattern = `\\s*\\(\\s*(stream\\s+)?${messageOrEnumPattern}\\s*\\)\\s*`;
            const messageRegExp = new RegExp(`^\\s*(repeated){0,1}(${messageOrEnumPattern})${messageFieldPattern}$`, 'i');
            const messageInMap = new RegExp(`^\\s*map\\s*<${messageOrEnumPattern},${messageOrEnumPattern}>${messageFieldPattern}$`, 'i');
            const messageInRpcRegExp = new RegExp(`^\\s*rpc\\s*\\w+${rpcReqOrRspPattern}returns${rpcReqOrRspPattern}[;{].*$`, 'i');
            if (messageRegExp.test(lineText) || messageInRpcRegExp.test(lineText) || messageInMap.test(lineText)) {
                const location = this.findEnumOrMessageDefinition(document, targetDefinition);
                if (location) {
                    return location;
                }
                vscode.window.showErrorMessage(`Could not find ${targetDefinition} definition.`);
            }
            return undefined;
        });
    }
    findEnumOrMessageDefinition(document, target) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchPaths = proto3Import_1.Proto3Import.getImportedFilePathsOnDocument(document);
            const files = [
                document.uri.fsPath,
                ...(yield fg.async(searchPaths))
            ];
            for (const file of files) {
                const data = fs.readFileSync(file.toString());
                const lines = data.toString().split('\n');
                for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                    const line = lines[lineIndex];
                    const messageDefinitionRegexMatch = new RegExp(`\\s*(message|enum)\\s*${target}\\s*{`).exec(line);
                    if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
                        const uri = vscode.Uri.file(file.toString());
                        const range = this.getTargetLocationInline(lineIndex, line, target, messageDefinitionRegexMatch);
                        return new vscode.Location(uri, range);
                    }
                }
            }
        });
    }
    findImportDefinition(importFileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fg.async(path.join(vscode.workspace.rootPath, '**', importFileName));
            const importPath = files[0].toString();
            // const data = fs.readFileSync(importPath);
            // const lines = data.toString().split('\n');
            // const lastLine = lines[lines.length  - 1];
            const uri = vscode.Uri.file(importPath);
            const definitionStartPosition = new vscode.Position(0, 0);
            const definitionEndPosition = new vscode.Position(0, 0);
            const range = new vscode.Range(definitionStartPosition, definitionEndPosition);
            return new vscode.Location(uri, range);
        });
    }
    getTargetLocationInline(lineIndex, line, target, definitionRegexMatch) {
        const matchedStr = definitionRegexMatch[0];
        const index = line.indexOf(matchedStr) + matchedStr.indexOf(target);
        const definitionStartPosition = new vscode.Position(lineIndex, index);
        const definitionEndPosition = new vscode.Position(lineIndex, index + target.length);
        return new vscode.Range(definitionStartPosition, definitionEndPosition);
    }
}
exports.Proto3DefinitionProvider = Proto3DefinitionProvider;
//# sourceMappingURL=proto3Definition.js.map