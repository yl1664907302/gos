"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DECADE_COL_COUNT = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _ = require(".");
var _PanelBody = _interopRequireDefault(require("../PanelBody"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const DECADE_COL_COUNT = exports.DECADE_COL_COUNT = 3;
const DECADE_ROW_COUNT = 4;
function DecadeBody(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const DECADE_UNIT_DIFF_DES = _.DECADE_UNIT_DIFF - 1;
  const {
    prefixCls,
    viewDate,
    generateConfig
  } = props;
  const cellPrefixCls = `${prefixCls}-cell`;
  const yearNumber = generateConfig.getYear(viewDate);
  const decadeYearNumber = Math.floor(yearNumber / _.DECADE_UNIT_DIFF) * _.DECADE_UNIT_DIFF;
  const startDecadeYear = Math.floor(yearNumber / _.DECADE_DISTANCE_COUNT) * _.DECADE_DISTANCE_COUNT;
  const endDecadeYear = startDecadeYear + _.DECADE_DISTANCE_COUNT - 1;
  const baseDecadeYear = generateConfig.setYear(viewDate, startDecadeYear - Math.ceil((DECADE_COL_COUNT * DECADE_ROW_COUNT * _.DECADE_UNIT_DIFF - _.DECADE_DISTANCE_COUNT) / 2));
  const getCellClassName = date => {
    const startDecadeNumber = generateConfig.getYear(date);
    const endDecadeNumber = startDecadeNumber + DECADE_UNIT_DIFF_DES;
    return {
      [`${cellPrefixCls}-in-view`]: startDecadeYear <= startDecadeNumber && endDecadeNumber <= endDecadeYear,
      [`${cellPrefixCls}-selected`]: startDecadeNumber === decadeYearNumber
    };
  };
  return (0, _vue.createVNode)(_PanelBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "rowNum": DECADE_ROW_COUNT,
    "colNum": DECADE_COL_COUNT,
    "baseDate": baseDecadeYear,
    "getCellText": date => {
      const startDecadeNumber = generateConfig.getYear(date);
      return `${startDecadeNumber}-${startDecadeNumber + DECADE_UNIT_DIFF_DES}`;
    },
    "getCellClassName": getCellClassName,
    "getCellDate": (date, offset) => generateConfig.addYear(date, offset * _.DECADE_UNIT_DIFF)
  }), null);
}
DecadeBody.displayName = 'DecadeBody';
DecadeBody.inheritAttrs = false;
var _default = exports.default = DecadeBody;