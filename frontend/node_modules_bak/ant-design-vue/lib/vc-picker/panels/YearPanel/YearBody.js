"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.YEAR_COL_COUNT = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _ = require(".");
var _useCellClassName = _interopRequireDefault(require("../../hooks/useCellClassName"));
var _dateUtil = require("../../utils/dateUtil");
var _RangeContext = require("../../RangeContext");
var _PanelBody = _interopRequireDefault(require("../PanelBody"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const YEAR_COL_COUNT = exports.YEAR_COL_COUNT = 3;
const YEAR_ROW_COUNT = 4;
function YearBody(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    value,
    viewDate,
    locale,
    generateConfig
  } = props;
  const {
    rangedValue,
    hoverRangedValue
  } = (0, _RangeContext.useInjectRange)();
  const yearPrefixCls = `${prefixCls}-cell`;
  // =============================== Year ===============================
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / _.YEAR_DECADE_COUNT) * _.YEAR_DECADE_COUNT;
  const endYear = startYear + _.YEAR_DECADE_COUNT - 1;
  const baseYear = generateConfig.setYear(viewDate, startYear - Math.ceil((YEAR_COL_COUNT * YEAR_ROW_COUNT - _.YEAR_DECADE_COUNT) / 2));
  const isInView = date => {
    const currentYearNumber = generateConfig.getYear(date);
    return startYear <= currentYearNumber && currentYearNumber <= endYear;
  };
  const getCellClassName = (0, _useCellClassName.default)({
    cellPrefixCls: yearPrefixCls,
    value,
    generateConfig,
    rangedValue: rangedValue.value,
    hoverRangedValue: hoverRangedValue.value,
    isSameCell: (current, target) => (0, _dateUtil.isSameYear)(generateConfig, current, target),
    isInView,
    offsetCell: (date, offset) => generateConfig.addYear(date, offset)
  });
  return (0, _vue.createVNode)(_PanelBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "rowNum": YEAR_ROW_COUNT,
    "colNum": YEAR_COL_COUNT,
    "baseDate": baseYear,
    "getCellText": generateConfig.getYear,
    "getCellClassName": getCellClassName,
    "getCellDate": generateConfig.addYear,
    "titleCell": date => (0, _dateUtil.formatValue)(date, {
      locale,
      format: 'YYYY',
      generateConfig
    })
  }), null);
}
YearBody.displayName = 'YearBody';
YearBody.inheritAttrs = false;
var _default = exports.default = YearBody;