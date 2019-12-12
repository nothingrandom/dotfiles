import { ISymbols } from '../types/symbols';
import StorageService from '../services/storage';
/**
 * Returns Symbols from all documents.
 */
export declare function getSymbolsCollection(storage: StorageService): ISymbols[];
