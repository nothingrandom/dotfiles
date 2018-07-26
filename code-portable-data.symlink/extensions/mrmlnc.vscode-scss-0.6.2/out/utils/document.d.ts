import { ISymbols } from '../types/symbols';
/**
 * Returns imports for document.
 */
export declare function getCurrentDocumentImportPaths(symbolsList: ISymbols[], currentPath: string): string[];
/**
 * Returns the path to the document, relative to the current document.
 */
export declare function getDocumentPath(currentPath: string, symbolsPath: string): string;
