(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accents_selector_1 = require("./lib/accents-selector");
const run = () => {
    bind();
    const { config, defaults } = window.bootstrap;
    accents_selector_1.default('[data-setting="accentSelector"]', defaults.accents, config.accent);
    console.log(defaults);
    console.log(config);
};
const bind = () => {
    document.querySelector('#fixIconsCTA').addEventListener('click', () => {
        console.log('Test click');
    });
};
run();

},{"./lib/accents-selector":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templateSingleAccent = (accentName, accentColor) => {
    const dashAccentName = accentName.toLowerCase().replace(/ /gi, '-');
    return `
    <label for="${dashAccentName}" data-color="${accentColor}">${accentName}</label>
    <input type="radio" name="accents" id="${dashAccentName}" value="${dashAccentName}" />
  `;
};
exports.default = (containerSelector, accentsObject, currentAccent) => {
    const container = document.querySelector(containerSelector);
    for (const accentKey of Object.keys(accentsObject)) {
        const el = document.createElement('div');
        el.innerHTML = templateSingleAccent(accentKey, accentsObject[accentKey]);
        if (accentKey === currentAccent) {
            el.setAttribute('selected', 'true');
            el.querySelector('input').setAttribute('checked', 'checked');
        }
        container.appendChild(el);
    }
};

},{}]},{},[1]);
