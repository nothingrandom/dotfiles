"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const gulp = require("gulp");
const path_1 = require("path");
const fs_1 = require("./../../extensions/helpers/fs");
const paths_1 = require("../../extensions/consts/paths");
const files_1 = require("../../extensions/consts/files");
/**
 * For each ThemeIconVariant create a Material-Theme-Icons-{variant}.json
 * depends on default Material-Theme-Icons.json
 */
exports.default = gulp.task('build:icons.variants-json', callback => {
    try {
        const variants = fs_1.getDefaultValues().themeIconVariants;
        const defaults = fs.readFileSync(path_1.resolve(`${paths_1.PATHS.THEMES}/Material-Theme-Icons.json`), 'utf8');
        Object.keys(variants).forEach(variantName => {
            const jsonDefaults = JSON.parse(defaults);
            fs_1.getVariantIcons().forEach(iconname => {
                const newIconPath = jsonDefaults.iconDefinitions[iconname].iconPath.replace('.svg', `${variantName}.svg`);
                jsonDefaults.iconDefinitions[iconname].iconPath = newIconPath;
                fs.writeFileSync(`${paths_1.PATHS.THEMES}/Material-Theme-Icons-${variantName}.json`, JSON.stringify(jsonDefaults), { encoding: files_1.CHARSET });
            });
        });
    }
    catch (error) {
        return callback(error);
    }
    callback();
});
//# sourceMappingURL=icons-variants-json.js.map