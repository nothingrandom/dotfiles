/// <reference types="node" />
import * as fs from 'fs';
/**
 * Read file by specified filepath;
 */
export declare function readFile(filepath: string): Promise<string>;
/**
 * Read file by specified filepath;
 */
export declare function statFile(filepath: string): Promise<fs.Stats>;
