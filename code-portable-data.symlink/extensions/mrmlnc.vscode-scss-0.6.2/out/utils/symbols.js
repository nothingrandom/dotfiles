'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns Symbols from all documents.
 */
function getSymbolsCollection(cache) {
    return cache.keys().map((filepath) => cache.get(filepath));
}
exports.getSymbolsCollection = getSymbolsCollection;
