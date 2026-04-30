"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _ja_JP = _interopRequireDefault(require("../../vc-picker/locale/ja_JP"));
var _ja_JP2 = _interopRequireDefault(require("../../time-picker/locale/ja_JP"));
// Merge into a locale object
const locale = {
  lang: (0, _extends2.default)({
    placeholder: '日付を選択',
    yearPlaceholder: '年を選択',
    quarterPlaceholder: '四半期を選択',
    monthPlaceholder: '月を選択',
    weekPlaceholder: '週を選択',
    rangePlaceholder: ['開始日付', '終了日付'],
    rangeYearPlaceholder: ['開始年', '終了年'],
    rangeMonthPlaceholder: ['開始月', '終了月'],
    rangeQuarterPlaceholder: ['開始四半期', '終了四半期'],
    rangeWeekPlaceholder: ['開始週', '終了週']
  }, _ja_JP.default),
  timePickerLocale: (0, _extends2.default)({}, _ja_JP2.default)
};
// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
var _default = exports.default = locale;