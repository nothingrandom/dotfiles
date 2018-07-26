'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
/**
 * Read file by specified filepath;
 */
function readFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.toString());
        });
    });
}
exports.readFile = readFile;
/**
 * Read file by specified filepath;
 */
function statFile(filepath) {
    return new Promise((resolve, reject) => {
        fs.stat(filepath, (err, stat) => {
            if (err) {
                return reject(err);
            }
            resolve(stat);
        });
    });
}
exports.statFile = statFile;
