"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
function extendsObject() {
  const result = (0, _extends2.default)({}, arguments.length <= 0 ? undefined : arguments[0]);
  for (let i = 1; i < arguments.length; i++) {
    const obj = i < 0 || arguments.length <= i ? undefined : arguments[i];
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (val !== undefined) {
          result[key] = val;
        }
      });
    }
  }
  return result;
}
var _default = exports.default = extendsObject;