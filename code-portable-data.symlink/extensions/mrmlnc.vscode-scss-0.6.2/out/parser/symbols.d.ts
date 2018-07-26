import { INode } from '../types/nodes';
import { ISymbols } from '../types/symbols';
/**
 * Get all suggestions in file.
 */
export declare function findSymbols(text: string): ISymbols;
/**
 * Get Symbols by offset position.
 */
export declare function findSymbolsAtOffset(parsedDocument: INode, offset: number): ISymbols;
