import { Hover, TextDocument } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import { ICache } from '../services/cache';
/**
 * Do Hover :)
 */
export declare function doHover(document: TextDocument, offset: number, cache: ICache, settings: ISettings): Hover;
