'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3Import = void 0;
const path = require("path");
const vscode = require("vscode");
var Proto3Import;
(function (Proto3Import) {
    Proto3Import.importStatementRegex = new RegExp(/^\s*import\s+('|")(.+\.proto)('|")\s*;\s*$/gim);
    Proto3Import.getImportedFilePathsOnDocument = (document) => {
        const fullDocument = document.getText();
        let importStatement;
        let importPaths = [];
        while (importStatement = Proto3Import.importStatementRegex.exec(fullDocument)) {
            const protoFileName = importStatement[2];
            const searchPath = path.join(vscode.workspace.rootPath, '**', protoFileName);
            importPaths.push(searchPath);
        }
        return importPaths;
    };
})(Proto3Import = exports.Proto3Import || (exports.Proto3Import = {}));
//# sourceMappingURL=proto3Import.js.map