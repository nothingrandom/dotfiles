import { SignatureHelp, TextDocument } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import { ICache } from '../services/cache';
/**
 * Do Signature Help :)
 */
export declare function doSignatureHelp(document: TextDocument, offset: number, cache: ICache, settings: ISettings): SignatureHelp;
