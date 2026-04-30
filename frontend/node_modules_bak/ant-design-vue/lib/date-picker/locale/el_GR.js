"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _el_GR = _interopRequireDefault(require("../../vc-picker/locale/el_GR"));
var _el_GR2 = _interopRequireDefault(require("../../time-picker/locale/el_GR"));
// Merge into a locale object
const locale = {
  lang: (0, _extends2.default)({
    placeholder: 'Επιλέξτε ημερομηνία',
    rangePlaceholder: ['Αρχική ημερομηνία', 'Τελική ημερομηνία']
  }, _el_GR.default),
  timePickerLocale: (0, _extends2.default)({}, _el_GR2.default)
};
// All settings at:
// https://github.com/ant-design/ant-design/issues/424
var _default = exports.default = locale;