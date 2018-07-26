import { TextDocument, Location } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import { ICache } from '../services/cache';
/**
 * Do Go Definition :)
 */
export declare function goDefinition(document: TextDocument, offset: number, cache: ICache, settings: ISettings): Promise<Location>;
