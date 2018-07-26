"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
const vscode_1 = require("vscode");
const exec = require('child_process').exec;
const findParentDir = require('find-parent-dir');
const { errorBackgroundColor, warningBackgroundColor, languages, statusBarText, showHighlights, runOnTextChange, configDir, } = vscode_1.workspace.getConfiguration('scssLint');
const errorDecorationType = vscode_1.window.createTextEditorDecorationType({
    backgroundColor: errorBackgroundColor,
    overviewRulerColor: errorBackgroundColor,
    overviewRulerLane: 2,
});
const warningDecorationType = vscode_1.window.createTextEditorDecorationType({
    backgroundColor: warningBackgroundColor,
    overviewRulerColor: warningBackgroundColor,
    overviewRulerLane: 2,
});
const isWindows = /^win/.test(process.platform);
const SEPARATOR = isWindows ? '\\' : '/';
const DIR_END_CHAR = isWindows ? SEPARATOR : ''; // need \\ for windows
const Q = isWindows ? '' : '"';
const CONFIG_OBJ = isWindows ? { env: { NL: '^& echo.', AMP: '^^^&', PIPE: '^^^|', CHEV: '^^^>' } } : null;
const getDocCopy = (docText) => (isWindows ?
    docText.replace(/\r\n/g, '%NL%').replace(/\&/g, '%AMP%').replace(/\|/g, '%PIPE%').replace(/\>/g, '%CHEV%') :
    docText.replace(/\\/g, '\\\\\\').replace(/\`/g, '\\`').replace(/\$/g, '\\$').replace(/\"/g, '\\"'));
// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
function activate(context) {
    // create a new error finder
    let errorFinder = new ErrorFinder();
    let controller = new ErrorFinderController(errorFinder);
    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(errorFinder);
}
exports.activate = activate;
class ErrorFinder {
    constructor() {
        this._diagnosticCollection = vscode_1.languages.createDiagnosticCollection();
        this._statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left);
    }
    finderErrors() {
        // Create as needed
        if (!this._statusBarItem)
            return;
        // Get the current text editor
        const editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        let doc = editor.document;
        // Only find errors if doc languageId is in languages array
        if (~languages.indexOf(doc.languageId)) {
            const dir = (vscode_1.workspace.rootPath || '') + SEPARATOR; // workspace.rootPath may be null on windows
            const fileName = doc.fileName.replace(dir, '');
            const docCopy = getDocCopy(doc.getText());
            let configFileDir = configDir;
            let configCmd = configFileDir ? `-c "${configFileDir + '.scss-lint.yml'}" ` : '';
            let cmd = `cd "${dir}" && echo ${Q}${docCopy}${Q}| scss-lint ${configCmd} --stdin-file-path="${fileName}"`;
            if (!configDir) {
                // Find and set nearest config file
                try {
                    const startingDir = doc.fileName.substring(0, doc.fileName.lastIndexOf(SEPARATOR));
                    configFileDir = findParentDir.sync(startingDir, '.scss-lint.yml') + DIR_END_CHAR;
                    configCmd = configFileDir && configFileDir !== 'null' ? `-c "${configFileDir + '.scss-lint.yml'}" ` : '';
                    cmd = `echo ${Q}${docCopy}${Q}| scss-lint ${configCmd} --stdin-file-path="${doc.fileName}"`;
                }
                catch (err) {
                    console.error('error', err);
                }
            }
            exec(cmd, CONFIG_OBJ, (err, stdout) => {
                const lines = stdout.toString().split('\n');
                const { exits, errors, warnings, diagnostics, } = lines.reduce((a, line) => {
                    let info, severity;
                    line = line.trim();
                    if (~line.indexOf('[E]')) {
                        info = line.match(/[^:]*:(\d+):(\d+) \[E\] (.*)$/);
                        severity = vscode_1.DiagnosticSeverity.Error;
                    }
                    else if (~line.indexOf('[W]')) {
                        info = line.match(/[^:]*:(\d+):(\d+) \[W\] (.*)$/);
                        severity = vscode_1.DiagnosticSeverity.Warning;
                    }
                    else if (line) {
                        info = [1, 1, 1, 'Error running scss-lint: ' + line];
                    }
                    else {
                        return a;
                    }
                    const lineNum = parseInt(info[1], 10) - 1;
                    const startPos = parseInt(info[2], 10) - 1;
                    const message = info[3];
                    const range = new vscode_1.Range(lineNum, startPos, lineNum + 1, 0);
                    if (severity === vscode_1.DiagnosticSeverity.Error) {
                        a.errors.push({ range, message });
                        a.diagnostics.push(new vscode_1.Diagnostic(range, message, severity));
                    }
                    else if (severity === vscode_1.DiagnosticSeverity.Warning) {
                        a.warnings.push({ range, message });
                        a.diagnostics.push(new vscode_1.Diagnostic(range, message, severity));
                    }
                    else {
                        severity === vscode_1.DiagnosticSeverity.Error;
                        a.exits.push(new vscode_1.Diagnostic(range, message, severity));
                    }
                    return a;
                }, {
                    exits: [],
                    errors: [],
                    warnings: [],
                    diagnostics: [],
                });
                if (editor === vscode_1.window.activeTextEditor) {
                    if (showHighlights) {
                        editor.setDecorations(errorDecorationType, errors);
                        editor.setDecorations(warningDecorationType, warnings);
                    }
                    const configUri = vscode_1.Uri.parse(configFileDir + '.scss-lint.yml').with({ scheme: 'file' });
                    this._diagnosticCollection.set(configUri, exits);
                    this._diagnosticCollection.set(doc.uri, diagnostics);
                    // Update the status bar
                    this._statusBarItem.text = eval(statusBarText);
                    this._statusBarItem.show();
                }
            });
        }
        else {
            this._statusBarItem.hide();
        }
    }
    dispose() {
        this._statusBarItem.dispose();
    }
}
class ErrorFinderController {
    constructor(errorFinder) {
        this._errorFinder = errorFinder;
        // subscribe to selection change and editor activation events
        let subscriptions = [];
        vscode_1.workspace.onDidSaveTextDocument(this._onEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        if (runOnTextChange) {
            vscode_1.workspace.onDidChangeTextDocument(this._onEvent, this, subscriptions);
        }
        // update the error finder for the current file
        this._errorFinder.finderErrors();
        // create a combined disposable from both event subscriptions
        this._disposable = vscode_1.Disposable.from(...subscriptions);
    }
    dispose() {
        this._disposable.dispose();
    }
    _onEvent() {
        this._errorFinder.finderErrors();
    }
}
//# sourceMappingURL=extension.js.map