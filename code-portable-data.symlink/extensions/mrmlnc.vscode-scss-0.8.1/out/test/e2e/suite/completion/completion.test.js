"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const util_1 = require("../util");
const helper_1 = require("./helper");
describe('SCSS Completion Test', () => {
    vscode.window.showInformationMessage('Start all tests.');
    const docUri = util_1.getDocUri('main.scss');
    before(async () => {
        util_1.showFile(docUri);
        await util_1.sleep(10000);
    });
    it('Offers variable completions', async () => {
        await helper_1.testCompletion(docUri, util_1.position(5, 11), ['$color', '$fonts']);
    });
    it('Offers completions from tilde imports', async () => {
        await helper_1.testCompletion(docUri, util_1.position(11, 11), ['$tilde']);
    });
    it('Offers completions from partial file', async () => {
        await helper_1.testCompletion(docUri, util_1.position(17, 11), ['$partial']);
    });
});
//# sourceMappingURL=completion.test.js.map