'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_languageserver_1 = require("vscode-languageserver");
const vscode_css_languageservice_1 = require("vscode-css-languageservice");
const symbols_1 = require("../parser/symbols");
const ast_1 = require("../utils/ast");
// RegExp's
const reReferenceCommentGlobal = /\/\/\s*<reference\s*path=["'](.*)['"]\s*\/?>/g;
const reReferenceComment = /\/\/\s*<reference\s*path=["'](.*)['"]\s*\/?>/;
const reDynamicPath = /#{}\*/;
// SCSS Language Service
const ls = vscode_css_languageservice_1.getSCSSLanguageService();
ls.configure({
    lint: false,
    validate: false
});
/**
 * Returns all Symbols in a single document.
 */
function parseDocument(document, offset = null, settings) {
    let symbols;
    try {
        symbols = symbols_1.findSymbols(document.getText());
    }
    catch (err) {
        if (settings.showErrors) {
            throw err;
        }
        symbols = {
            variables: [],
            mixins: [],
            functions: [],
            imports: []
        };
    }
    // Set path for document in Symbols collection
    symbols.document = vscode_languageserver_1.Files.uriToFilePath(document.uri) || document.uri;
    // Get `<reference *> comments from document
    const references = document.getText().match(reReferenceCommentGlobal);
    if (references) {
        references.forEach((x) => {
            const filepath = reReferenceComment.exec(x)[1];
            symbols.imports.push({
                css: filepath.substr(-4) === '.css',
                dynamic: reDynamicPath.test(filepath),
                filepath: filepath,
                reference: true
            });
        });
    }
    let ast = null;
    if (offset) {
        ast = ls.parseStylesheet(document);
        const scopedSymbols = symbols_1.findSymbolsAtOffset(ast, offset);
        symbols.variables = symbols.variables.concat(scopedSymbols.variables);
        symbols.mixins = symbols.mixins.concat(scopedSymbols.mixins);
    }
    symbols.imports = symbols.imports.map((x) => {
        x.filepath = path.join(path.dirname(symbols.document), x.filepath);
        if (!x.css && x.filepath.substr(-5) !== '.scss') {
            x.filepath += '.scss';
        }
        return x;
    });
    symbols.variables = symbols.variables.map((x) => {
        x.position = document.positionAt(x.offset);
        return x;
    });
    symbols.mixins = symbols.mixins.map((x) => {
        x.position = document.positionAt(x.offset);
        return x;
    });
    symbols.functions = symbols.functions.map((x) => {
        x.position = document.positionAt(x.offset);
        return x;
    });
    return {
        symbols,
        node: offset ? ast_1.getNodeAtOffset(ast, offset) : null
    };
}
exports.parseDocument = parseDocument;
