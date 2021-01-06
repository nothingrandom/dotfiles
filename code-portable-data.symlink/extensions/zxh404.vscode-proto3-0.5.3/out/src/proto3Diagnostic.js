'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3LanguageDiagnosticProvider = void 0;
const vscode = require("vscode");
const path = require("path");
class Proto3LanguageDiagnosticProvider {
    constructor(compiler) {
        this.errors = vscode.languages.createDiagnosticCollection("languageErrors");
        this.compiler = compiler;
    }
    createDiagnostics(doc) {
        this.compiler.compileProtoToTmp(doc.fileName, stderr => {
            if (stderr) {
                this.analyzeErrors(stderr, doc);
            }
            else {
                this.errors.delete(doc.uri);
            }
        });
    }
    analyzeErrors(stderr, doc) {
        let shortFileName = path.parse(doc.fileName).name;
        let diagnostics = stderr.split('\n')
            .filter(line => line.includes(shortFileName))
            .map(line => this.parseErrorLine(line, doc))
            .filter(diagnostic => diagnostic != null);
        this.errors.set(doc.uri, diagnostics);
    }
    parseErrorLine(errline, doc) {
        let errorInfo = errline.match(/\w+\.proto:(\d+):(\d+):\s*(.*)/);
        if (!errorInfo) {
            return null;
        }
        let startLine = parseInt(errorInfo[1]) - 1;
        let startCol = parseInt(errorInfo[2]) - 1;
        // protoc calculates tab width (eight spaces) and returns colunm number.
        let line = doc.lineAt(startLine);
        let startChar = 0;
        let col = 0;
        for (var c of line.text) {
            col += (c === "\t" ? (8 - col % 8) : 1);
            startChar += 1;
            if (col >= startCol) {
                break;
            }
        }
        let endChar = line.text.length;
        let tokenEnd = line.text.substr(startChar).match(/[\s;{}\[\],<>()=]/);
        if (tokenEnd) {
            endChar = startChar + tokenEnd.index;
        }
        let range = new vscode.Range(startLine, startChar, startLine, endChar);
        let msg = errorInfo[3];
        return new vscode.Diagnostic(range, msg, vscode.DiagnosticSeverity.Error);
    }
}
exports.Proto3LanguageDiagnosticProvider = Proto3LanguageDiagnosticProvider;
//# sourceMappingURL=proto3Diagnostic.js.map