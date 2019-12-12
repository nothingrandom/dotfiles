import * as vscode from 'vscode';
/**
 * Line and Char as shown in lowerright of VS Code
 */
export declare function position(line: number, char: number): vscode.Position;
export declare function getDocPath(p: string): string;
export declare function getDocUri(p: string): vscode.Uri;
export declare function sleep(ms: number): Promise<unknown>;
export declare function showFile(docUri: vscode.Uri): Promise<vscode.TextEditor>;
