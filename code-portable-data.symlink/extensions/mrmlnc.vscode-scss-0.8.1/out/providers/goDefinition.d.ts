import { TextDocument, Location } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import StorageService from '../services/storage';
/**
 * Do Go Definition :)
 */
export declare function goDefinition(document: TextDocument, offset: number, storage: StorageService, settings: ISettings): Promise<Location>;
