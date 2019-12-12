import { Hover, TextDocument } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import StorageService from '../services/storage';
/**
 * Do Hover :)
 */
export declare function doHover(document: TextDocument, offset: number, storage: StorageService, settings: ISettings): Hover;
