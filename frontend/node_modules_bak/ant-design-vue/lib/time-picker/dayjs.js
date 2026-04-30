"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TimeRangePicker = exports.TimePicker = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _timePicker = _interopRequireDefault(require("./time-picker"));
var _dayjs = _interopRequireDefault(require("../vc-picker/generate/dayjs"));
const {
  TimePicker,
  TimeRangePicker
} = (0, _timePicker.default)(_dayjs.default);
/* istanbul ignore next */
exports.TimeRangePicker = TimeRangePicker;
exports.TimePicker = TimePicker;
var _default = exports.default = (0, _extends2.default)(TimePicker, {
  TimePicker,
  TimeRangePicker,
  install: app => {
    app.component(TimePicker.name, TimePicker);
    app.component(TimeRangePicker.name, TimeRangePicker);
    return app;
  }
});