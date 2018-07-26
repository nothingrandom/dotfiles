'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const cache_1 = require("./services/cache");
const scanner_1 = require("./services/scanner");
const completion_1 = require("./providers/completion");
const hover_1 = require("./providers/hover");
const signatureHelp_1 = require("./providers/signatureHelp");
const goDefinition_1 = require("./providers/goDefinition");
const workspaceSymbol_1 = require("./providers/workspaceSymbol");
// Cache Storage
const cache = cache_1.getCacheStorage();
// Common variables
let workspaceRoot;
let settings;
let activeDocumentUri;
// Create a connection for the server
const connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);
// Create a simple text document manager. The text document manager
// _supports full document sync only
const documents = new vscode_languageserver_1.TextDocuments();
// Make the text document manager listen on the connection
// _for open, change and close text document events
documents.listen(connection);
// After the server has started the client sends an initilize request. The server receives
// _in the passed params the rootPath of the workspace plus the client capabilites
connection.onInitialize((params) => {
    workspaceRoot = params.rootPath;
    settings = params.initializationOptions.settings;
    activeDocumentUri = params.initializationOptions.activeEditorUri;
    return scanner_1.doScanner(workspaceRoot, cache, settings).then(() => {
        return {
            capabilities: {
                textDocumentSync: documents.syncKind,
                completionProvider: { resolveProvider: false },
                signatureHelpProvider: {
                    triggerCharacters: ['(', ',', ';']
                },
                hoverProvider: true,
                definitionProvider: true,
                workspaceSymbolProvider: true
            }
        };
    }).catch((err) => {
        if (settings.showErrors) {
            connection.window.showErrorMessage(err);
        }
    });
});
// Update settings
connection.onDidChangeConfiguration((params) => {
    settings = params.settings.scss;
});
// Update cache
connection.onDidChangeWatchedFiles((event) => {
    // We do not need to update the Cache if the current document has been updated
    if (event.changes.length === 1 && activeDocumentUri === event.changes[0].uri) {
        return;
    }
    return scanner_1.doScanner(workspaceRoot, cache, settings).then((symbols) => {
        return cache_1.invalidateCacheStorage(cache, symbols);
    });
});
connection.onRequest('changeActiveDocument', (data) => {
    activeDocumentUri = data.uri;
});
connection.onCompletion((textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    const offset = document.offsetAt(textDocumentPosition.position);
    return completion_1.doCompletion(document, offset, settings, cache);
});
connection.onHover((textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    const offset = document.offsetAt(textDocumentPosition.position);
    return hover_1.doHover(document, offset, cache, settings);
});
connection.onSignatureHelp((textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    const offset = document.offsetAt(textDocumentPosition.position);
    return signatureHelp_1.doSignatureHelp(document, offset, cache, settings);
});
connection.onDefinition((textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    const offset = document.offsetAt(textDocumentPosition.position);
    return goDefinition_1.goDefinition(document, offset, cache, settings);
});
connection.onWorkspaceSymbol((workspaceSymbolParams) => {
    return workspaceSymbol_1.searchWorkspaceSymbol(workspaceSymbolParams.query, cache, workspaceRoot);
});
// Dispose cache
connection.onShutdown(() => {
    cache.dispose();
});
// Listen on the connection
connection.listen();
