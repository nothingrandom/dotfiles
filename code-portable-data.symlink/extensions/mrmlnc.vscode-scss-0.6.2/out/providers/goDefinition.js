'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_uri_1 = require("vscode-uri");
const nodes_1 = require("../types/nodes");
const parser_1 = require("../services/parser");
const symbols_1 = require("../utils/symbols");
const document_1 = require("../utils/document");
function samePosition(a, b) {
    return a.line === b.line && a.character === b.character;
}
/**
 * Returns the Symbol, if it present in the documents.
 */
function getSymbols(symbolList, identifier, currentPath) {
    const list = [];
    symbolList.forEach((symbols) => {
        const fsPath = document_1.getDocumentPath(currentPath, symbols.document);
        symbols[identifier.type].forEach((item) => {
            if (item.name === identifier.name && !samePosition(item.position, identifier.position)) {
                list.push({
                    document: symbols.document,
                    path: fsPath,
                    info: item
                });
            }
        });
    });
    return list;
}
/**
 * Do Go Definition :)
 */
function goDefinition(document, offset, cache, settings) {
    const documentPath = vscode_languageserver_1.Files.uriToFilePath(document.uri) || document.uri;
    if (!documentPath) {
        return Promise.resolve(null);
    }
    const resource = parser_1.parseDocument(document, offset, settings);
    const hoverNode = resource.node;
    if (!hoverNode || !hoverNode.type) {
        return Promise.resolve(null);
    }
    let identifier = null;
    if (hoverNode.type === nodes_1.NodeType.VariableName) {
        const parent = hoverNode.getParent();
        if (parent.type !== nodes_1.NodeType.FunctionParameter && parent.type !== nodes_1.NodeType.VariableDeclaration) {
            identifier = {
                name: hoverNode.getName(),
                position: document.positionAt(hoverNode.offset),
                type: 'variables'
            };
        }
    }
    else if (hoverNode.type === nodes_1.NodeType.Identifier) {
        let i = 0;
        let node = hoverNode;
        while (node.type !== nodes_1.NodeType.MixinReference && node.type !== nodes_1.NodeType.Function && i !== 2) {
            node = node.getParent();
            i++;
        }
        if (node && (node.type === nodes_1.NodeType.MixinReference || node.type === nodes_1.NodeType.Function)) {
            let type = 'mixins';
            if (node.type === nodes_1.NodeType.Function) {
                type = 'functions';
            }
            identifier = {
                name: node.getName(),
                position: document.positionAt(node.offset),
                type
            };
        }
    }
    if (!identifier) {
        return Promise.resolve(null);
    }
    // Symbols from Cache
    resource.symbols.ctime = new Date();
    cache.set(resource.symbols.document, resource.symbols);
    const symbolsList = symbols_1.getSymbolsCollection(cache);
    // Symbols
    const candidates = getSymbols(symbolsList, identifier, documentPath);
    if (candidates.length === 0) {
        return Promise.resolve(null);
    }
    const definition = candidates[0];
    const symbol = vscode_languageserver_1.Location.create(vscode_uri_1.default.file(definition.document).toString(), {
        start: definition.info.position,
        end: {
            line: definition.info.position.line,
            character: definition.info.position.character + definition.info.name.length
        }
    });
    return Promise.resolve(symbol);
}
exports.goDefinition = goDefinition;
