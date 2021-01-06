'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proto3Scope = exports.Proto3ScopeKind = exports.guessScope = void 0;
const MSG_BEGIN = /\s*message\s+(\w*)\s*\{.*/;
const ENUM_BEGIN = /\s*enum\s+(\w*)\s*\{.*/;
const SERVICE_BEGIN = /\s*service\s+(\w*)\s*\{.*/;
const SCOPE_END = /\s*\}.*/;
function guessScope(doc, cursorLineNum) {
    return new ScopeGuesser(cursorLineNum).guess(doc);
}
exports.guessScope = guessScope;
var Proto3ScopeKind;
(function (Proto3ScopeKind) {
    Proto3ScopeKind[Proto3ScopeKind["Comment"] = 0] = "Comment";
    Proto3ScopeKind[Proto3ScopeKind["Proto"] = 1] = "Proto";
    Proto3ScopeKind[Proto3ScopeKind["Message"] = 2] = "Message";
    Proto3ScopeKind[Proto3ScopeKind["Enum"] = 3] = "Enum";
    Proto3ScopeKind[Proto3ScopeKind["Service"] = 4] = "Service";
})(Proto3ScopeKind = exports.Proto3ScopeKind || (exports.Proto3ScopeKind = {}));
class Proto3Scope {
    constructor(kind, lineFrom) {
        this.kind = kind;
        this.children = [];
        this.lineFrom = lineFrom;
    }
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }
}
exports.Proto3Scope = Proto3Scope;
class ScopeGuesser {
    constructor(cursorLineNum) {
        this.syntax = 2;
        this.cursorLineNum = cursorLineNum;
    }
    guess(doc) {
        this.enterScope(Proto3ScopeKind.Proto, 0);
        for (var i = 0; i < doc.lineCount; i++) {
            var line = doc.lineAt(i);
            if (!line.isEmptyOrWhitespace) {
                let lineText = line.text;
                if (this.currentScope.kind == Proto3ScopeKind.Comment) {
                    if (lineText.match(/.*\*\/\s*$/)) {
                        this.exitScope(i); // exit block comment
                    }
                }
                else if (lineText.match(/^\s*\/\*.*/)) {
                    this.enterScope(Proto3ScopeKind.Comment, i); // enter block comment
                }
                else if (lineText.match(/^\s*\/\//)) {
                    continue; // skip line comments
                }
                else if (lineText.match(/^\s*syntax\s*=\s*"proto3"\s*;/)) {
                    this.syntax = 3;
                }
                else if (lineText.match(MSG_BEGIN)) {
                    this.enterScope(Proto3ScopeKind.Message, i);
                }
                else if (lineText.match(ENUM_BEGIN)) {
                    this.enterScope(Proto3ScopeKind.Enum, i);
                }
                else if (lineText.match(SERVICE_BEGIN)) {
                    this.enterScope(Proto3ScopeKind.Service, i);
                }
                else if (lineText.match(SCOPE_END)) {
                    this.exitScope(i);
                }
            }
        }
        this.exitScope(doc.lineCount);
        this.scopeAtCursor.syntax = this.syntax;
        return this.scopeAtCursor;
    }
    enterScope(kind, lineNum) {
        let newScope = new Proto3Scope(kind, lineNum);
        if (this.currentScope) {
            this.currentScope.addChild(newScope);
        }
        this.currentScope = newScope;
    }
    exitScope(lineNum) {
        this.currentScope.lineTo = lineNum;
        if (!this.scopeAtCursor) {
            if (this.currentScope.lineFrom <= this.cursorLineNum
                && this.currentScope.lineTo >= this.cursorLineNum) {
                this.scopeAtCursor = this.currentScope;
            }
        }
        if (this.currentScope.parent) {
            this.currentScope = this.currentScope.parent;
        }
    }
}
//# sourceMappingURL=proto3ScopeGuesser.js.map