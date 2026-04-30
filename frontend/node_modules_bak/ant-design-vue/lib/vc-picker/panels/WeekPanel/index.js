"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _DatePanel = _interopRequireDefault(require("../DatePanel"));
var _dateUtil = require("../../utils/dateUtil");
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function WeekPanel(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    value
  } = props;
  // Render additional column
  const cellPrefixCls = `${prefixCls}-cell`;
  const prefixColumn = date => (0, _vue.createVNode)("td", {
    "key": "week",
    "class": (0, _classNames.default)(cellPrefixCls, `${cellPrefixCls}-week`)
  }, [generateConfig.locale.getWeek(locale.locale, date)]);
  // Add row className
  const rowPrefixCls = `${prefixCls}-week-panel-row`;
  const rowClassName = date => (0, _classNames.default)(rowPrefixCls, {
    [`${rowPrefixCls}-selected`]: (0, _dateUtil.isSameWeek)(generateConfig, locale.locale, value, date)
  });
  return (0, _vue.createVNode)(_DatePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "panelName": "week",
    "prefixColumn": prefixColumn,
    "rowClassName": rowClassName,
    "keyboardConfig": {
      onLeftRight: null
    }
  }), null);
}
WeekPanel.displayName = 'WeekPanel';
WeekPanel.inheritAttrs = false;
var _default = exports.default = WeekPanel;