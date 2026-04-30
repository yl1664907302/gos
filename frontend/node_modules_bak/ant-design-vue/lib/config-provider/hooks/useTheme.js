"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTheme;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _internal = require("../../theme/internal");
var _vue = require("vue");
function useTheme(theme, parentTheme) {
  const themeConfig = (0, _vue.computed)(() => (theme === null || theme === void 0 ? void 0 : theme.value) || {});
  const parentThemeConfig = (0, _vue.computed)(() => themeConfig.value.inherit === false || !(parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.value) ? _internal.defaultConfig : parentTheme.value);
  const mergedTheme = (0, _vue.computed)(() => {
    if (!(theme === null || theme === void 0 ? void 0 : theme.value)) {
      return parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.value;
    }
    // Override
    const mergedComponents = (0, _extends2.default)({}, parentThemeConfig.value.components);
    Object.keys(theme.value.components || {}).forEach(componentName => {
      mergedComponents[componentName] = (0, _extends2.default)((0, _extends2.default)({}, mergedComponents[componentName]), theme.value.components[componentName]);
    });
    // Base token
    return (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, parentThemeConfig.value), themeConfig.value), {
      token: (0, _extends2.default)((0, _extends2.default)({}, parentThemeConfig.value.token), themeConfig.value.token),
      components: mergedComponents
    });
  });
  return mergedTheme;
}