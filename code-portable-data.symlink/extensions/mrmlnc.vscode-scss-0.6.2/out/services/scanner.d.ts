import { ICache } from './cache';
import { ISymbols } from '../types/symbols';
import { ISettings } from '../types/settings';
/**
 * Returns all Symbols in the opened workspase.
 */
export declare function doScanner(root: string, cache: ICache, settings: ISettings): Promise<ISymbols[]>;
