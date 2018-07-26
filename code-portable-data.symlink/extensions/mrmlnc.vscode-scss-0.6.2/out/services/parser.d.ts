import { TextDocument } from 'vscode-languageserver';
import { IDocument } from '../types/symbols';
import { ISettings } from '../types/settings';
/**
 * Returns all Symbols in a single document.
 */
export declare function parseDocument(document: TextDocument, offset: number, settings: ISettings): IDocument;
