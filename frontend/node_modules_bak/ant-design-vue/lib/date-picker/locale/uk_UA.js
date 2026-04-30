"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _uk_UA = _interopRequireDefault(require("../../vc-picker/locale/uk_UA"));
var _uk_UA2 = _interopRequireDefault(require("../../time-picker/locale/uk_UA"));
// Merge into a locale object
const locale = {
  lang: (0, _extends2.default)({
    placeholder: 'Оберіть дату',
    rangePlaceholder: ['Початкова дата', 'Кінцева дата']
  }, _uk_UA.default),
  timePickerLocale: (0, _extends2.default)({}, _uk_UA2.default)
};
// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
var _default = exports.default = locale;