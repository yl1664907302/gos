"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Header = _interopRequireDefault(require("../Header"));
var _PanelContext = require("../../PanelContext");
var _dateUtil = require("../../utils/dateUtil");
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function DateHeader(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    viewDate,
    onNextMonth,
    onPrevMonth,
    onNextYear,
    onPrevYear,
    onYearClick,
    onMonthClick
  } = props;
  const {
    hideHeader
  } = (0, _PanelContext.useInjectPanel)();
  if (hideHeader.value) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  const monthsLocale = locale.shortMonths || (generateConfig.locale.getShortMonths ? generateConfig.locale.getShortMonths(locale.locale) : []);
  const month = generateConfig.getMonth(viewDate);
  // =================== Month & Year ===================
  const yearNode = (0, _vue.createVNode)("button", {
    "type": "button",
    "key": "year",
    "onClick": onYearClick,
    "tabindex": -1,
    "class": `${prefixCls}-year-btn`
  }, [(0, _dateUtil.formatValue)(viewDate, {
    locale,
    format: locale.yearFormat,
    generateConfig
  })]);
  const monthNode = (0, _vue.createVNode)("button", {
    "type": "button",
    "key": "month",
    "onClick": onMonthClick,
    "tabindex": -1,
    "class": `${prefixCls}-month-btn`
  }, [locale.monthFormat ? (0, _dateUtil.formatValue)(viewDate, {
    locale,
    format: locale.monthFormat,
    generateConfig
  }) : monthsLocale[month]]);
  const monthYearNodes = locale.monthBeforeYear ? [monthNode, yearNode] : [yearNode, monthNode];
  return (0, _vue.createVNode)(_Header.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevYear,
    "onPrev": onPrevMonth,
    "onNext": onNextMonth,
    "onSuperNext": onNextYear
  }), {
    default: () => [monthYearNodes]
  });
}
DateHeader.displayName = 'DateHeader';
DateHeader.inheritAttrs = false;
var _default = exports.default = DateHeader;