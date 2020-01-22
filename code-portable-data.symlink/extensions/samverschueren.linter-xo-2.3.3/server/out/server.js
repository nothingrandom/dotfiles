"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const utils_1 = require("./utils");
const fixes_1 = require("./fixes");
const package_1 = require("./package");
const buffered_message_queue_1 = require("./buffered-message-queue");
var AllFixesRequest;
(function (AllFixesRequest) {
    AllFixesRequest.type = new vscode_languageserver_1.RequestType('textDocument/xo/allFixes');
})(AllFixesRequest || (AllFixesRequest = {}));
var ValidateNotification;
(function (ValidateNotification) {
    ValidateNotification.type = new vscode_languageserver_1.NotificationType('xo/validate');
})(ValidateNotification || (ValidateNotification = {}));
class Linter {
    constructor() {
        this.codeActions = Object.create(null);
        this.connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
        this.documents = new vscode_languageserver_1.TextDocuments();
        this.messageQueue = new buffered_message_queue_1.default(this.connection);
        this.messageQueue.onNotification(ValidateNotification.type, document => {
            this.validateSingle(document);
        }, document => {
            return document.version;
        });
        // Listen for text document create, change
        this.documents.listen(this.connection);
        // Validate document if it changed
        this.documents.onDidChangeContent(event => {
            this.messageQueue.addNotificationMessage(ValidateNotification.type, event.document, event.document.version);
        });
        this.messageQueue.registerRequest(vscode_languageserver_1.DocumentFormattingRequest.type, params => {
            const doc = this.documents.get(params.textDocument.uri);
            if (!doc) {
                return null;
            }
            return this.connection.workspace.getConfiguration('xo').then(config => {
                if (!config || !config.enable || !config.format || !config.format.enable) {
                    return null;
                }
                const fixes = this.computeAllFixes(params.textDocument.uri);
                return fixes && fixes.edits;
            });
        });
        // Clear the diagnostics when document is closed
        this.documents.onDidClose(event => {
            this.connection.sendDiagnostics({
                uri: event.document.uri,
                diagnostics: []
            });
        });
        this.connection.onInitialize(this.initialize.bind(this));
        this.connection.onDidChangeConfiguration(params => {
            const settings = params.settings;
            this.options = settings.xo ? settings.xo.options || {} : {};
            this.validateMany(this.documents.all());
        });
        this.connection.onDidChangeWatchedFiles(() => {
            this.validateMany(this.documents.all());
        });
        this.connection.onRequest(AllFixesRequest.type, params => {
            return this.computeAllFixes(params.textDocument.uri);
        });
    }
    listen() {
        this.connection.listen();
    }
    initialize(params) {
        this.workspaceRoot = params.rootPath;
        this.package = new package_1.Package(this.workspaceRoot);
        return this.resolveModule();
    }
    resolveModule() {
        const result = {
            capabilities: {
                textDocumentSync: this.documents.syncKind,
                documentFormattingProvider: true
            }
        };
        if (this.lib) {
            return Promise.resolve(result);
        }
        return vscode_languageserver_1.Files.resolveModule(this.workspaceRoot, 'xo').then((xo) => {
            if (!xo.lintText) {
                return new vscode_languageserver_1.ResponseError(99, 'The XO library doesn\'t export a lintText method.', { retry: false });
            }
            this.lib = xo;
            return result;
        }, () => {
            if (this.package.isDependency('xo')) {
                throw new vscode_languageserver_1.ResponseError(99, 'Failed to load XO library. Make sure XO is installed in your workspace folder using \'npm install xo\' and then press Retry.', { retry: true });
            }
            return result;
        });
    }
    validateMany(documents) {
        const tracker = new vscode_languageserver_1.ErrorMessageTracker();
        const promises = documents.map(document => {
            return this.validate(document).then(() => {
                // Do nothing
            }, err => {
                tracker.add(this.getMessage(err, document));
            });
        });
        return Promise.all(promises)
            .then(() => {
            tracker.sendErrors(this.connection);
        });
    }
    validateSingle(document) {
        return this.validate(document)
            .then(() => {
            // Do nothing
        }, (err) => {
            this.connection.window.showErrorMessage(this.getMessage(err, document));
        });
    }
    validate(document) {
        if (!this.package.isDependency('xo')) {
            // Do not validate if `xo` is not a dependency
            return Promise.resolve();
        }
        return this.resolveModule()
            .then(() => {
            const uri = document.uri;
            const fsPath = vscode_uri_1.default.parse(document.uri).fsPath;
            if (!fsPath) {
                return;
            }
            const contents = document.getText();
            const options = this.options;
            options.cwd = this.workspaceRoot;
            options.filename = fsPath;
            const report = this.runLint(contents, options);
            // Clean previously computed code actions.
            this.codeActions[uri] = undefined;
            const results = report.results;
            if (results.length === 0 || !results[0].messages) {
                return;
            }
            const diagnostics = results[0].messages.map((problem) => {
                const diagnostic = utils_1.makeDiagnostic(problem);
                this.recordCodeAction(document, diagnostic, problem);
                return diagnostic;
            });
            this.connection.sendDiagnostics({ uri, diagnostics });
        });
    }
    runLint(contents, options) {
        const cwd = process.cwd();
        let report;
        try {
            process.chdir(options.cwd);
            report = this.lib.lintText(contents, options);
        }
        finally {
            if (cwd !== process.cwd()) {
                process.chdir(cwd);
            }
        }
        return report;
    }
    recordCodeAction(document, diagnostic, problem) {
        if (!problem.fix || !problem.ruleId) {
            return;
        }
        const uri = document.uri;
        let edits = this.codeActions[uri];
        if (!edits) {
            edits = Object.create(null);
            this.codeActions[uri] = edits;
        }
        edits[utils_1.computeKey(diagnostic)] = {
            label: `Fix this ${problem.ruleId} problem`,
            documentVersion: document.version,
            ruleId: problem.ruleId,
            edit: problem.fix
        };
    }
    getMessage(err, document) {
        if (typeof err.message === 'string' || err.message instanceof String) {
            return err.message;
        }
        return `An unknown error occurred while validating file: ${vscode_uri_1.default.parse(document.uri).fsPath}`;
    }
    computeAllFixes(uri) {
        let result = null;
        const textDocument = this.documents.get(uri);
        const edits = this.codeActions[uri];
        function createTextEdit(editInfo) {
            return vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(textDocument.positionAt(editInfo.edit.range[0]), textDocument.positionAt(editInfo.edit.range[1])), editInfo.edit.text || '');
        }
        if (edits) {
            const fixes = new fixes_1.Fixes(edits);
            if (!fixes.isEmpty()) {
                result = {
                    documentVersion: fixes.getDocumentVersion(),
                    edits: fixes.getOverlapFree().map(createTextEdit)
                };
            }
        }
        return result;
    }
}
new Linter().listen();
//# sourceMappingURL=server.js.map