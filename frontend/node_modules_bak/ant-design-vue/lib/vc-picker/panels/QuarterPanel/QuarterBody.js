"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.QUARTER_COL_COUNT = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _dateUtil = require("../../utils/dateUtil");
var _RangeContext = require("../../RangeContext");
var _useCellClassName = _interopRequireDefault(require("../../hooks/useCellClassName"));
var _PanelBody = _interopRequireDefault(require("../PanelBody"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const QUARTER_COL_COUNT = exports.QUARTER_COL_COUNT = 4;
const QUARTER_ROW_COUNT = 1;
function QuarterBody(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    locale,
    value,
    viewDate,
    generateConfig
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
    isSameCell: (current, target) => (0, _dateUtil.isSameQuarter)(generateConfig, current, target),
    isInView: () => true,
    offsetCell: (date, offset) => generateConfig.addMonth(date, offset * 3)
  });
  const baseQuarter = generateConfig.setDate(generateConfig.setMonth(viewDate, 0), 1);
  return (0, _vue.createVNode)(_PanelBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "rowNum": QUARTER_ROW_COUNT,
    "colNum": QUARTER_COL_COUNT,
    "baseDate": baseQuarter,
    "getCellText": date => (0, _dateUtil.formatValue)(date, {
      locale,
      format: locale.quarterFormat || '[Q]Q',
      generateConfig
    }),
    "getCellClassName": getCellClassName,
    "getCellDate": (date, offset) => generateConfig.addMonth(date, offset * 3),
    "titleCell": date => (0, _dateUtil.formatValue)(date, {
      locale,
      format: 'YYYY-[Q]Q',
      generateConfig
    })
  }), null);
}
QuarterBody.displayName = 'QuarterBody';
QuarterBody.inheritAttrs = false;
var _default = exports.default = QuarterBody;