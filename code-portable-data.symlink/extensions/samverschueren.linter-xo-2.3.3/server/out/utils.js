"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
function parseSeverity(severity) {
    switch (severity) {
        case 1:
            return vscode_languageserver_1.DiagnosticSeverity.Warning;
        case 2:
            return vscode_languageserver_1.DiagnosticSeverity.Error;
        default:
            return vscode_languageserver_1.DiagnosticSeverity.Error;
    }
}
function makeDiagnostic(problem) {
    const message = (problem.ruleId !== null)
        ? `${problem.message} (${problem.ruleId})`
        : `${problem.message}`;
    return {
        message,
        severity: parseSeverity(problem.severity),
        code: problem.ruleId,
        source: 'XO',
        range: {
            start: { line: problem.line - 1, character: problem.column - 1 },
            end: { line: problem.line - 1, character: problem.column - 1 }
        }
    };
}
exports.makeDiagnostic = makeDiagnostic;
function computeKey(diagnostic) {
    const range = diagnostic.range;
    return `[${range.start.line},${range.start.character},${range.end.line},${range.end.character}]-${diagnostic.code}`;
}
exports.computeKey = computeKey;
//# sourceMappingURL=utils.js.map