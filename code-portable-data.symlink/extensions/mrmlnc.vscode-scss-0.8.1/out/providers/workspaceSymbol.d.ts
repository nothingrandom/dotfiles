import { SymbolInformation } from 'vscode-languageserver';
import StorageService from '../services/storage';
/**
 * All Symbol Definitions in Folder :)
 */
export declare function searchWorkspaceSymbol(query: string, storage: StorageService, root: string): SymbolInformation[];
