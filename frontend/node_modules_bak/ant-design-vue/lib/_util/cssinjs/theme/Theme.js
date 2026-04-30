"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _warning = _interopRequireDefault(require("../../warning"));
let uuid = 0;
/**
 * Theme with algorithms to derive tokens from design tokens.
 * Use `createTheme` first which will help to manage the theme instance cache.
 */
class Theme {
  constructor(derivatives) {
    this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
    this.id = uuid;
    if (derivatives.length === 0) {
      (0, _warning.default)(derivatives.length > 0, '[Ant Design Vue CSS-in-JS] Theme should have at least one derivative function.');
    }
    uuid += 1;
  }
  getDerivativeToken(token) {
    return this.derivatives.reduce((result, derivative) => derivative(token, result), undefined);
  }
}
exports.default = Theme;