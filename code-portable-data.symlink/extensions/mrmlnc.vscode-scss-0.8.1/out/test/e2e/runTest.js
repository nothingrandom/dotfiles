"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_test_1 = require("vscode-test");
async function main() {
    try {
        // The folder containing the Extension Manifest package.json
        // Passed to `--extensionDevelopmentPath`
        const extensionDevelopmentPath = path.resolve(__dirname, '../../../');
        // The path to the extension test script
        // Passed to --extensionTestsPath
        const extensionTestsPath = path.resolve(__dirname, './suite/index');
        const workspaceDir = path.resolve(__dirname, '../../../fixtures/e2e');
        // Download VS Code, unzip it and run the integration test
        await vscode_test_1.runTests({ version: '1.40.0', extensionDevelopmentPath, extensionTestsPath, launchArgs: [workspaceDir] });
    }
    catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}
main();
//# sourceMappingURL=runTest.js.map