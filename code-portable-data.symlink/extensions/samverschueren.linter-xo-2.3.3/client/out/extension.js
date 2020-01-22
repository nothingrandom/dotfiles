"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
var AllFixesRequest;
(function (AllFixesRequest) {
    AllFixesRequest.type = new vscode_languageclient_1.RequestType('textDocument/xo/allFixes');
})(AllFixesRequest || (AllFixesRequest = {}));
function activate(context) {
    const serverModule = context.asAbsolutePath(path.join('server', 'out', 'server.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6004'], cwd: process.cwd() };
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: { cwd: process.cwd() } },
        debug: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: debugOptions }
    };
    const clientOptions = {
        documentSelector: [
            { language: 'javascript', scheme: 'file' },
            { language: 'javascript', scheme: 'untitled' },
            { language: 'javascriptreact', scheme: 'file' },
            { language: 'javascriptreact', scheme: 'untitled' },
            { language: 'typescript', scheme: 'file' },
            { language: 'typescript', scheme: 'untitled' },
            { language: 'typescriptreact', scheme: 'file' },
            { language: 'typescriptreact', scheme: 'untitled' }
        ],
        synchronize: {
            configurationSection: 'xo',
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/package.json')
            ]
        }
    };
    const client = new vscode_languageclient_1.LanguageClient('XO Linter', serverOptions, clientOptions);
    function applyTextEdits(uri, documentVersion, edits) {
        const textEditor = vscode_1.window.activeTextEditor;
        if (textEditor && textEditor.document.uri.toString() === uri) { // tslint:disable-line:early-exit
            if (textEditor.document.version !== documentVersion) {
                vscode_1.window.showInformationMessage('XO fixes are outdated and can\'t be applied to the document.');
            }
            textEditor.edit(mutator => {
                for (const edit of edits) {
                    mutator.replace(client.protocol2CodeConverter.asRange(edit.range), edit.newText);
                }
            }).then(success => {
                if (!success) {
                    vscode_1.window.showErrorMessage('Failed to apply XO fixes to the document. Please consider opening an issue with steps to reproduce.');
                }
            });
        }
    }
    function fixAllProblems() {
        const textEditor = vscode_1.window.activeTextEditor;
        if (!textEditor) {
            return;
        }
        const uri = textEditor.document.uri.toString();
        client.sendRequest(AllFixesRequest.type, { textDocument: { uri } }).then(result => {
            if (result) {
                applyTextEdits(uri, result.documentVersion, result.edits);
            }
        }, () => {
            vscode_1.window.showErrorMessage('Failed to apply XO fixes to the document. Please consider opening an issue with steps to reproduce.');
        });
    }
    context.subscriptions.push(new vscode_languageclient_1.SettingMonitor(client, 'xo.enable').start(), vscode_1.commands.registerCommand('xo.fix', fixAllProblems));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map