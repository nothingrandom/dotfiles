import { CompletionList, TextDocument } from 'vscode-languageserver';
import { ICache } from '../services/cache';
import { ISettings } from '../types/settings';
/**
 * Do Completion :)
 */
export declare function doCompletion(document: TextDocument, offset: number, settings: ISettings, cache: ICache): CompletionList;
