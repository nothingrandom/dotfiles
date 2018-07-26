import { SymbolInformation } from 'vscode-languageserver';
import { ICache } from '../services/cache';
/**
 * All Symbol Definitions in Folder :)
 */
export declare function searchWorkspaceSymbol(query: string, cache: ICache, root: string): SymbolInformation[];
