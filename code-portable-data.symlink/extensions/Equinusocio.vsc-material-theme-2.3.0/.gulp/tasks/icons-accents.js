"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const gulp = require("gulp");
const gutil = require("gulp-util");
const path = require("path");
const log_1 = require("./../consts/log");
const files_1 = require("./../../extensions/consts/files");
const paths_1 = require("./../../extensions/consts/paths");
const fs_1 = require("./../../extensions/helpers/fs");
const BASE_ICON_THEME_PATH = path.join(process.cwd(), paths_1.default.THEMES, './Material-Theme-Icons.json');
const DEFAULTS = fs_1.getDefaultValues();
/**
 * Normalizes icon path
 */
function normalizeIconPath(iconPath) {
    return path.join(process.cwd(), paths_1.default.ICONS, iconPath);
}
/**
 * Replaces a file name with the accented filename
 */
function replaceNameWithAccent(name, accentName) {
    return name.replace('.svg', `.accent.${accentName}.svg`);
}
/**
 * Replaces a SVG colour
 */
function replaceSVGColour(filecontent, colour) {
    return filecontent.replace(new RegExp('#(80CBC4)', 'i'), ($0, $1) => {
        const newColour = colour.replace('#', '');
        console.log(`Replacing colour ${$1} with ${newColour}`);
        return $0.replace($1, newColour);
    });
}
exports.replaceSVGColour = replaceSVGColour;
/**
 * Replaces white spaces in accents' names
 */
function replaceWhiteSpaces(input) {
    return input.replace(/\s+/g, '-');
}
/**
 * Writes a new svg file
 */
function writeSVGIcon(fromFile, toFile, accent) {
    const fileContent = fs.readFileSync(normalizeIconPath(fromFile), files_1.CHARSET);
    const content = replaceSVGColour(fileContent, DEFAULTS.accents[accent]);
    const pathToFile = normalizeIconPath(toFile);
    gutil.log(gutil.colors.gray(`Accented icon ${pathToFile} created with colour ${accent} (${DEFAULTS.accents[accent]})`));
    fs.writeFileSync(pathToFile, content);
}
// Exports task to index.ts
exports.default = gulp.task('build:icons.accents', cb => {
    let basetheme;
    try {
        basetheme = require(BASE_ICON_THEME_PATH);
        Object.keys(DEFAULTS.accents).forEach(key => {
            const iconName = replaceWhiteSpaces(key);
            const themecopy = JSON.parse(JSON.stringify(basetheme));
            const themePath = path.join(paths_1.default.THEMES, `./Material-Theme-Icons-${key}.json`);
            fs_1.getAccentableIcons().forEach(accentableIconName => {
                gutil.log(gutil.colors.gray(`Preparing ${accentableIconName} accented icon`));
                const iconOriginDefinition = basetheme.iconDefinitions[accentableIconName];
                const iconCopyDefinition = themecopy.iconDefinitions[accentableIconName];
                if (iconOriginDefinition !== undefined && typeof iconOriginDefinition.iconPath === 'string' && iconCopyDefinition !== undefined && typeof iconCopyDefinition.iconPath === 'string') {
                    iconCopyDefinition.iconPath = replaceNameWithAccent(iconOriginDefinition.iconPath, iconName);
                    writeSVGIcon(iconOriginDefinition.iconPath, iconCopyDefinition.iconPath, key);
                }
                else {
                    gutil.log(gutil.colors.yellow(`Icon ${accentableIconName} not found`));
                }
            });
            // themecopy.iconDefinitions._folder_open.iconPath = replaceNameWithAccent(basetheme.iconDefinitions._folder_open.iconPath, iconName);
            // themecopy.iconDefinitions._folder_open_build.iconPath = replaceNameWithAccent(basetheme.iconDefinitions._folder_open_build.iconPath, iconName);
            // writeSVGIcon(basetheme.iconDefinitions._folder_open.iconPath, themecopy.iconDefinitions._folder_open.iconPath, key);
            // writeSVGIcon(basetheme.iconDefinitions._folder_open_build.iconPath, themecopy.iconDefinitions._folder_open_build.iconPath, key);
            // fs.writeFileSync(themePath, JSON.stringify(themecopy));
            // addContributeIconTheme(id, label, themepathJSON, PACKAGE_JSON);
            gutil.log(gutil.colors.green(log_1.MESSAGE_GENERATED, themePath));
        });
        // writePackageJSON(PACKAGE_JSON);
    }
    catch (error) {
        // http://ragefaces.memesoftware.com/faces/large/misc-le-fu-l.png
        gutil.log(gutil.colors.red(log_1.MESSAGE_ICON_ACCENTS_ERROR));
        cb(error);
        return;
    }
    cb();
});
//# sourceMappingURL=icons-accents.js.map