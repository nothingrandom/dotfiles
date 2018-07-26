"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("./settings");
const vscode_1 = require("./vscode");
const ThemeCommands = require("./../commands");
const messages_1 = require("./messages");
const icons = () => settings_1.isAutoApplyEnable() ? ThemeCommands.fixIcons() : messages_1.infoMessage();
const onIconsChanged = () => {
    const customSettings = settings_1.getCustomSettings();
    if (customSettings.fixIconsRunning) {
        return;
    }
    const currentIconsTheme = vscode_1.getCurrentThemeIconsID();
    if (settings_1.isMaterialThemeIcons(currentIconsTheme)) {
        return icons();
    }
};
const onThemeChanged = () => {
    const currentTheme = vscode_1.getCurrentThemeID();
    if (settings_1.isMaterialTheme(currentTheme)) {
        return icons();
    }
};
exports.onChangeConfiguration = (event) => {
    const isColorTheme = event.affectsConfiguration('workbench.colorTheme');
    const isIconTheme = event.affectsConfiguration('workbench.iconTheme');
    if (isIconTheme) {
        return onIconsChanged();
    }
    if (isColorTheme) {
        return onThemeChanged();
    }
};
//# sourceMappingURL=configuration-change.js.map