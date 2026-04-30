"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _ta_IN = _interopRequireDefault(require("../../vc-picker/locale/ta_IN"));
var _ta_IN2 = _interopRequireDefault(require("../../time-picker/locale/ta_IN"));
// Tamil Locale added to rc-calendar

// Merge into a locale object
const locale = {
  lang: (0, _extends2.default)({
    placeholder: 'தேதியைத் தேர்ந்தெடுக்கவும்',
    rangePlaceholder: ['தொடக்க தேதி', 'கடைசி தேதி']
  }, _ta_IN.default),
  timePickerLocale: (0, _extends2.default)({}, _ta_IN2.default)
};
// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
var _default = exports.default = locale;