"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gulp = require("gulp");
const path = require("path");
const fs = require("fs");
const files_1 = require("./../../extensions/consts/files");
const paths_1 = require("./../../extensions/consts/paths");
const fs_1 = require("./../../extensions/helpers/fs");
const PACKAGE_JSON = fs_1.getPackageJSON();
const variants = fs_1.getDefaultValues().themeVariantsColours;
const writeIconVariant = (filepath, destpath, colour) => {
    const regexp = new RegExp('(#4a616c)', 'i');
    const finalFilePath = path.join(process.cwd(), paths_1.default.ICONS, filepath);
    const finalDestpath = path.join(process.cwd(), paths_1.default.ICONS, destpath);
    fs.writeFileSync(finalDestpath, fs.readFileSync(finalFilePath, files_1.CHARSET)
        .replace(regexp, ($0, $1) => $0.replace($1, colour)), { encoding: files_1.CHARSET });
};
exports.default = gulp.task('build:icons.variants', callback => {
    try {
        Object.keys(variants).forEach(variantName => {
            PACKAGE_JSON.contributes.iconThemes.forEach(contribute => {
                const regexpCheck = new RegExp(Object.keys(variants).join('|'), 'i');
                if (regexpCheck.test(contribute.path) || regexpCheck.test(contribute.id)) {
                    return;
                }
                const basepath = path.join(process.cwd(), contribute.path);
                const basetheme = require(basepath);
                const theme = JSON.parse(JSON.stringify(basetheme));
                const variant = variants[variantName];
                fs_1.getVariantIcons().forEach(iconName => {
                    const basethemeIcon = basetheme.iconDefinitions[iconName];
                    const themeIcon = theme.iconDefinitions[iconName];
                    if (themeIcon !== undefined) {
                        themeIcon.iconPath = themeIcon.iconPath.replace('.svg', `${variantName}.svg`);
                    }
                    if (basethemeIcon !== undefined && themeIcon !== undefined) {
                        writeIconVariant(basethemeIcon.iconPath, themeIcon.iconPath, variant);
                    }
                });
            });
        });
    }
    catch (error) {
        callback(error);
        return;
    }
    callback();
});
//# sourceMappingURL=icons-variants.js.map