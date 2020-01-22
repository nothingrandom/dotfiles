"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const loadJsonFile = require("load-json-file");
class Package {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
    }
    isDependency(name) {
        try {
            // tslint:disable-next-line no-unnecessary-type-assertion
            const pkg = loadJsonFile.sync(path.join(this.workspaceRoot, 'package.json'));
            const deps = pkg.dependencies || {};
            const devDeps = pkg.devDependencies || {};
            return Boolean(deps[name] || devDeps[name]);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
    }
}
exports.Package = Package;
//# sourceMappingURL=package.js.map