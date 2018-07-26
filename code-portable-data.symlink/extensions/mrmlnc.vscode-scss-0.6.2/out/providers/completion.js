'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const nodes_1 = require("../types/nodes");
const parser_1 = require("../services/parser");
const symbols_1 = require("../utils/symbols");
const document_1 = require("../utils/document");
const string_1 = require("../utils/string");
// RegExp's
const rePropertyValue = /.*:\s*/;
const reEmptyPropertyValue = /.*:\s*$/;
const reQuotedValueInString = /['"](?:[^'"\\]|\\.)*['"]/g;
const reMixinReference = /.*@include\s+(.*)/;
const reComment = /^(\/(\/|\*)|\*)/;
const reQuotes = /['"]/;
/**
 * Returns `true` if the path is not present in the document.
 */
function isImplicitly(symbolsDocument, documentPath, documentImports) {
    return symbolsDocument !== documentPath && documentImports.indexOf(symbolsDocument) === -1;
}
/**
 * Return Mixin as string.
 */
function makeMixinDocumentation(symbol) {
    const args = symbol.parameters.map((item) => `${item.name}: ${item.value}`).join(', ');
    return `${symbol.name}(${args}) {\u2026}`;
}
/**
 * Skip suggestions for parent Mixin inside Mixins.
 */
function mixinSuggestionsFilter(mixin, node) {
    if (!node) {
        return false;
    }
    while (node.type !== nodes_1.NodeType.Stylesheet) {
        if (node.type === nodes_1.NodeType.MixinDeclaration) {
            const identifier = node.getIdentifier();
            if (identifier && identifier.getText() === mixin.name) {
                return true;
            }
        }
        node = node.getParent();
    }
    return false;
}
/**
 * Check context for Variables suggestions.
 */
function checkVariableContext(word, isInterpolation, isPropertyValue, isEmptyValue, isQuotes) {
    if (isPropertyValue && !isEmptyValue && !isQuotes) {
        return word.includes('$');
    }
    else if (isQuotes) {
        return isInterpolation;
    }
    return word[0] === '$' || isInterpolation || isEmptyValue;
}
/**
  * Check context for Mixins suggestions.
  */
function checkMixinContext(textBeforeWord, isPropertyValue) {
    return !isPropertyValue && reMixinReference.test(textBeforeWord);
}
/**
  * Check context for Function suggestions.
  */
function checkFunctionContext(textBeforeWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes, settings) {
    if (isPropertyValue && !isEmptyValue && !isQuotes) {
        const lastChar = textBeforeWord.substr(-2, 1);
        return settings.suggestFunctionsInStringContextAfterSymbols.indexOf(lastChar) !== -1;
    }
    else if (isQuotes) {
        return isInterpolation;
    }
    return false;
}
/**
 * Do Completion :)
 */
function doCompletion(document, offset, settings, cache) {
    const completions = vscode_languageserver_1.CompletionList.create([], false);
    const documentPath = vscode_languageserver_1.Files.uriToFilePath(document.uri) || document.uri;
    if (!documentPath) {
        return null;
    }
    const resource = parser_1.parseDocument(document, offset, settings);
    // Update Cache for current document
    cache.set(documentPath, resource.symbols);
    const symbolsList = symbols_1.getSymbolsCollection(cache);
    const documentImports = document_1.getCurrentDocumentImportPaths(symbolsList, documentPath);
    const currentWord = string_1.getCurrentWord(document.getText(), offset);
    const textBeforeWord = string_1.getTextBeforePosition(document.getText(), offset);
    // Drop suggestions inside `//` and `/* */` comments
    if (reComment.test(textBeforeWord.trim())) {
        return completions;
    }
    // Is "#{INTERPOLATION}"
    const isInterpolation = currentWord.includes('#{');
    // Information about current position
    const isPropertyValue = rePropertyValue.test(textBeforeWord);
    const isEmptyValue = reEmptyPropertyValue.test(textBeforeWord);
    const isQuotes = reQuotes.test(textBeforeWord.replace(reQuotedValueInString, ''));
    // Check contexts
    const isVariableContext = checkVariableContext(currentWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes);
    const isFunctionContext = checkFunctionContext(textBeforeWord, isInterpolation, isPropertyValue, isEmptyValue, isQuotes, settings);
    const isMixinContext = checkMixinContext(textBeforeWord, isPropertyValue);
    // Variables
    if (settings.suggestVariables && isVariableContext) {
        symbolsList.forEach((symbols) => {
            const fsPath = document_1.getDocumentPath(documentPath, symbols.document);
            const isImplicitlyImport = isImplicitly(symbols.document, documentPath, documentImports);
            symbols.variables.forEach((variable) => {
                // Add 'implicitly' prefix for Path if the file imported implicitly
                let detailPath = fsPath;
                if (isImplicitlyImport && settings.implicitlyLabel) {
                    detailPath = settings.implicitlyLabel + ' ' + detailPath;
                }
                // Add 'argument from MIXIN_NAME' suffix if Variable is Mixin argument
                let detailText = detailPath;
                if (variable.mixin) {
                    detailText = `argument from ${variable.mixin}, ${detailText}`;
                }
                completions.items.push({
                    label: variable.name,
                    kind: vscode_languageserver_1.CompletionItemKind.Variable,
                    detail: detailText,
                    documentation: string_1.getLimitedString(variable.value)
                });
            });
        });
    }
    // Mixins
    if (settings.suggestMixins && isMixinContext) {
        symbolsList.forEach((symbols) => {
            const fsPath = document_1.getDocumentPath(documentPath, symbols.document);
            const isImplicitlyImport = isImplicitly(symbols.document, documentPath, documentImports);
            symbols.mixins.forEach((mixin) => {
                if (mixinSuggestionsFilter(mixin, resource.node)) {
                    return;
                }
                // Add 'implicitly' prefix for Path if the file imported implicitly
                let detailPath = fsPath;
                if (isImplicitlyImport && settings.implicitlyLabel) {
                    detailPath = settings.implicitlyLabel + ' ' + detailPath;
                }
                completions.items.push({
                    label: mixin.name,
                    kind: vscode_languageserver_1.CompletionItemKind.Function,
                    detail: detailPath,
                    documentation: makeMixinDocumentation(mixin),
                    insertText: mixin.name
                });
            });
        });
    }
    // Functions
    if (settings.suggestFunctions && isFunctionContext) {
        symbolsList.forEach((symbols) => {
            const fsPath = document_1.getDocumentPath(documentPath, symbols.document);
            const isImplicitlyImport = isImplicitly(symbols.document, documentPath, documentImports);
            symbols.functions.forEach((func) => {
                // Add 'implicitly' prefix for Path if the file imported implicitly
                let detailPath = fsPath;
                if (isImplicitlyImport && settings.implicitlyLabel) {
                    detailPath = settings.implicitlyLabel + ' ' + detailPath;
                }
                completions.items.push({
                    label: func.name,
                    kind: vscode_languageserver_1.CompletionItemKind.Interface,
                    detail: detailPath,
                    documentation: makeMixinDocumentation(func),
                    insertText: func.name
                });
            });
        });
    }
    return completions;
}
exports.doCompletion = doCompletion;
