"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Components: true,
  getTimeProps: true
};
exports.default = exports.Components = void 0;
exports.getTimeProps = getTimeProps;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _PickerButton = _interopRequireDefault(require("../PickerButton"));
var _PickerTag = _interopRequireDefault(require("../PickerTag"));
var _generateSinglePicker = _interopRequireDefault(require("./generateSinglePicker"));
var _generateRangePicker = _interopRequireDefault(require("./generateRangePicker"));
var _interface = require("./interface");
Object.keys(_interface).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _interface[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _interface[key];
    }
  });
});
const Components = exports.Components = {
  button: _PickerButton.default,
  rangeItem: _PickerTag.default
};
function toArray(list) {
  if (!list) {
    return [];
  }
  return Array.isArray(list) ? list : [list];
}
function getTimeProps(props) {
  const {
    format,
    picker,
    showHour,
    showMinute,
    showSecond,
    use12Hours
  } = props;
  const firstFormat = toArray(format)[0];
  const showTimeObj = (0, _extends2.default)({}, props);
  if (firstFormat && typeof firstFormat === 'string') {
    if (!firstFormat.includes('s') && showSecond === undefined) {
      showTimeObj.showSecond = false;
    }
    if (!firstFormat.includes('m') && showMinute === undefined) {
      showTimeObj.showMinute = false;
    }
    if (!firstFormat.includes('H') && !firstFormat.includes('h') && showHour === undefined) {
      showTimeObj.showHour = false;
    }
    if ((firstFormat.includes('a') || firstFormat.includes('A')) && use12Hours === undefined) {
      showTimeObj.use12Hours = true;
    }
  }
  if (picker === 'time') {
    return showTimeObj;
  }
  if (typeof firstFormat === 'function') {
    // format of showTime should use default when format is custom format function
    delete showTimeObj.format;
  }
  return {
    showTime: showTimeObj
  };
}
function generatePicker(generateConfig, extraProps) {
  // =========================== Picker ===========================
  const {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker
  } = (0, _generateSinglePicker.default)(generateConfig, extraProps);
  // ======================== Range Picker ========================
  const RangePicker = (0, _generateRangePicker.default)(generateConfig, extraProps);
  return {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker,
    RangePicker
  };
}
var _default = exports.default = generatePicker;