"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MONTH_COL_COUNT = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _dateUtil = require("../../utils/dateUtil");
var _RangeContext = require("../../RangeContext");
var _useCellClassName = _interopRequireDefault(require("../../hooks/useCellClassName"));
var _PanelBody = _interopRequireDefault(require("../PanelBody"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const MONTH_COL_COUNT = exports.MONTH_COL_COUNT = 3;
const MONTH_ROW_COUNT = 4;
function MonthBody(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    locale,
    value,
    viewDate,
    generateConfig,
    monthCellRender
  } = props;
  const {
    rangedValue,
    hoverRangedValue
  } = (0, _RangeContext.useInjectRange)();
  const cellPrefixCls = `${prefixCls}-cell`;
  const getCellClassName = (0, _useCellClassName.default)({
    cellPrefixCls,
    value,
    generateConfig,
    rangedValue: rangedValue.value,
    hoverRangedValue: hoverRangedValue.value,
    isSameCell: (current, target) => (0, _dateUtil.isSameMonth)(generateConfig, current, target),
    isInView: () => true,
    offsetCell: (date, offset) => generateConfig.addMonth(date, offset)
  });
  const monthsLocale = locale.shortMonths || (generateConfig.locale.getShortMonths ? generateConfig.locale.getShortMonths(locale.locale) : []);
  const baseMonth = generateConfig.setMonth(viewDate, 0);
  const getCellNode = monthCellRender ? date => monthCellRender({
    current: date,
    locale
  }) : undefined;
  return (0, _vue.createVNode)(_PanelBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "rowNum": MONTH_ROW_COUNT,
    "colNum": MONTH_COL_COUNT,
    "baseDate": baseMonth,
    "getCellNode": getCellNode,
    "getCellText": date => locale.monthFormat ? (0, _dateUtil.formatValue)(date, {
      locale,
      format: locale.monthFormat,
      generateConfig
    }) : monthsLocale[generateConfig.getMonth(date)],
    "getCellClassName": getCellClassName,
    "getCellDate": generateConfig.addMonth,
    "titleCell": date => (0, _dateUtil.formatValue)(date, {
      locale,
      format: 'YYYY-MM',
      generateConfig
    })
  }), null);
}
MonthBody.displayName = 'MonthBody';
MonthBody.inheritAttrs = false;
var _default = exports.default = MonthBody;