"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WeekPicker = exports.RangePicker = exports.QuarterPicker = exports.MonthPicker = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _moment = _interopRequireDefault(require("../vc-picker/generate/moment"));
var _generatePicker = _interopRequireDefault(require("./generatePicker"));
const {
  DatePicker,
  WeekPicker,
  MonthPicker,
  YearPicker,
  TimePicker,
  QuarterPicker,
  RangePicker
} = (0, _generatePicker.default)(_moment.default);
/* istanbul ignore next */
exports.RangePicker = RangePicker;
exports.QuarterPicker = QuarterPicker;
exports.MonthPicker = MonthPicker;
exports.WeekPicker = WeekPicker;
var _default = exports.default = (0, _extends2.default)(DatePicker, {
  WeekPicker,
  MonthPicker,
  YearPicker,
  RangePicker,
  TimePicker,
  QuarterPicker,
  install: app => {
    app.component(DatePicker.name, DatePicker);
    app.component(RangePicker.name, RangePicker);
    app.component(MonthPicker.name, MonthPicker);
    app.component(WeekPicker.name, WeekPicker);
    app.component(QuarterPicker.name, QuarterPicker);
    return app;
  }
});