'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const path = require("path");
const vscode = require("vscode");
const cp = require("child_process");
const proto3Suggest_1 = require("./proto3Suggest");
const proto3Diagnostic_1 = require("./proto3Diagnostic");
const proto3Compiler_1 = require("./proto3Compiler");
const proto3Mode_1 = require("./proto3Mode");
const proto3Definition_1 = require("./proto3Definition");
const proto3Configuration_1 = require("./proto3Configuration");
function activate(ctx) {
    ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(proto3Mode_1.PROTO3_MODE, new proto3Suggest_1.Proto3CompletionItemProvider(), '.', '\"'));
    ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(proto3Mode_1.PROTO3_MODE, new proto3Definition_1.Proto3DefinitionProvider()));
    const compiler = new proto3Compiler_1.Proto3Compiler();
    const diagnosticProvider = new proto3Diagnostic_1.Proto3LanguageDiagnosticProvider(compiler);
    vscode.workspace.onDidSaveTextDocument(event => {
        if (event.languageId == 'proto3') {
            diagnosticProvider.createDiagnostics(event);
            if (proto3Configuration_1.Proto3Configuration.Instance().compileOnSave()) {
                compiler.compileActiveProto();
            }
        }
    });
    ctx.subscriptions.push(vscode.commands.registerCommand('proto3.compile.one', () => {
        compiler.compileActiveProto();
    }));
    ctx.subscriptions.push(vscode.commands.registerCommand('proto3.compile.all', () => {
        compiler.compileAllProtos();
    }));
    //console.log('Congratulations, your extension "vscode-pb3" is now active!');
    vscode.languages.setLanguageConfiguration(proto3Mode_1.PROTO3_MODE.language, {
        indentationRules: {
            // ^(.*\*/)?\s*\}.*$
            decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/,
            // ^.*\{[^}'']*$
            increaseIndentPattern: /^.*\{[^}'']*$/
        },
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)(\.proto){0,1}/g,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['<', '>'],
        ],
        __electricCharacterSupport: {
            brackets: [
                { tokenType: 'delimiter.curly.ts', open: '{', close: '}', isElectric: true },
                { tokenType: 'delimiter.square.ts', open: '[', close: ']', isElectric: true },
                { tokenType: 'delimiter.paren.ts', open: '(', close: ')', isElectric: true }
            ]
        },
        __characterPairSupport: {
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '`', close: '`', notIn: ['string'] },
                { open: '"', close: '"', notIn: ['string'] },
                { open: '\'', close: '\'', notIn: ['string', 'comment'] }
            ]
        }
    });
    vscode.languages.registerDocumentFormattingEditProvider('proto3', {
        provideDocumentFormattingEdits(document) {
            let args = [];
            let opts = { input: document.getText() };
            // In order for clang-format to find the correct formatting file we need to have cwd set appropriately
            switch (document.uri.scheme) {
                case "untitled": // File has not yet been saved to disk use workspace path
                    opts['cwd'] = vscode.workspace.rootPath;
                    args.push(`--assume-filename=untitled.proto`);
                    break;
                case "file": // File is on disk use it's directory
                    opts['cwd'] = path.dirname(document.uri.fsPath);
                    args.push(`--assume-filename=${document.uri.fsPath}`);
                    break;
            }
            let style = vscode.workspace.getConfiguration('clang-format').get('style');
            style = style && style.trim();
            if (style)
                args.push(`-style=${style}`);
            let stdout = cp.execFileSync('clang-format', args, opts);
            return [new vscode.TextEdit(document.validateRange(new vscode.Range(0, 0, Infinity, Infinity)), stdout ? stdout.toString() : '')];
        },
    });
}
exports.activate = activate;
function deactivate() {
    //
}
//# sourceMappingURL=proto3Main.js.map