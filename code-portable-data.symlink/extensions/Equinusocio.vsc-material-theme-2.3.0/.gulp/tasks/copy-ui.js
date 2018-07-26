"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const gulp = require("gulp");
const paths_1 = require("../../extensions/consts/paths");
const fs_1 = require("../../extensions/helpers/fs");
/**
 * For each ThemeIconVariant create a Material-Theme-Icons-{variant}.json
 * depends on default Material-Theme-Icons.json
 */
exports.default = gulp.task('build:copy-ui', callback => {
    try {
        fs_1.ensureDir(path.resolve(paths_1.PATHS.UI));
        fs.copyFileSync(path.join(paths_1.PATHS.SRC, 'webviews', 'ui', 'settings', 'settings.html'), path.join(paths_1.PATHS.UI, 'settings.html'));
        fs.copyFileSync(path.join(paths_1.PATHS.SRC, 'webviews', 'ui', 'settings', 'style.css'), path.join(paths_1.PATHS.UI, 'settings.css'));
    }
    catch (error) {
        return callback(error);
    }
    callback();
});
//# sourceMappingURL=copy-ui.js.map