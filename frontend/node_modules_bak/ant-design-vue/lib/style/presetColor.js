"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genPresetColor = genPresetColor;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _interface = require("../theme/interface");
function genPresetColor(token, genCss) {
  return _interface.PresetColors.reduce((prev, colorKey) => {
    const lightColor = token[`${colorKey}-1`];
    const lightBorderColor = token[`${colorKey}-3`];
    const darkColor = token[`${colorKey}-6`];
    const textColor = token[`${colorKey}-7`];
    return (0, _extends2.default)((0, _extends2.default)({}, prev), genCss(colorKey, {
      lightColor,
      lightBorderColor,
      darkColor,
      textColor
    }));
  }, {});
}