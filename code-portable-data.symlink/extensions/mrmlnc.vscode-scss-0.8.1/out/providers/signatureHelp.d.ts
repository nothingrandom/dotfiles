import { SignatureHelp, TextDocument } from 'vscode-languageserver';
import { ISettings } from '../types/settings';
import StorageService from '../services/storage';
/**
 * Do Signature Help :)
 */
export declare function doSignatureHelp(document: TextDocument, offset: number, storage: StorageService, settings: ISettings): SignatureHelp;
