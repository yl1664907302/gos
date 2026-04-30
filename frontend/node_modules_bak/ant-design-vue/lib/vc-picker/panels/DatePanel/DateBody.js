"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _dateUtil = require("../../utils/dateUtil");
var _useCellClassName = _interopRequireDefault(require("../../hooks/useCellClassName"));
var _PanelBody = _interopRequireDefault(require("../PanelBody"));
var _RangeContext = require("../../RangeContext");
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function DateBody(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    generateConfig,
    prefixColumn,
    locale,
    rowCount,
    viewDate,
    value,
    dateRender
  } = props;
  const {
    rangedValue,
    hoverRangedValue
  } = (0, _RangeContext.useInjectRange)();
  const baseDate = (0, _dateUtil.getWeekStartDate)(locale.locale, generateConfig, viewDate);
  const cellPrefixCls = `${prefixCls}-cell`;
  const weekFirstDay = generateConfig.locale.getWeekFirstDay(locale.locale);
  const today = generateConfig.getNow();
  // ============================== Header ==============================
  const headerCells = [];
  const weekDaysLocale = locale.shortWeekDays || (generateConfig.locale.getShortWeekDays ? generateConfig.locale.getShortWeekDays(locale.locale) : []);
  if (prefixColumn) {
    headerCells.push((0, _vue.createVNode)("th", {
      "key": "empty",
      "aria-label": "empty cell"
    }, null));
  }
  for (let i = 0; i < _dateUtil.WEEK_DAY_COUNT; i += 1) {
    headerCells.push((0, _vue.createVNode)("th", {
      "key": i
    }, [weekDaysLocale[(i + weekFirstDay) % _dateUtil.WEEK_DAY_COUNT]]));
  }
  // =============================== Body ===============================
  const getCellClassName = (0, _useCellClassName.default)({
    cellPrefixCls,
    today,
    value,
    generateConfig,
    rangedValue: prefixColumn ? null : rangedValue.value,
    hoverRangedValue: prefixColumn ? null : hoverRangedValue.value,
    isSameCell: (current, target) => (0, _dateUtil.isSameDate)(generateConfig, current, target),
    isInView: date => (0, _dateUtil.isSameMonth)(generateConfig, date, viewDate),
    offsetCell: (date, offset) => generateConfig.addDate(date, offset)
  });
  const getCellNode = dateRender ? date => dateRender({
    current: date,
    today
  }) : undefined;
  return (0, _vue.createVNode)(_PanelBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "rowNum": rowCount,
    "colNum": _dateUtil.WEEK_DAY_COUNT,
    "baseDate": baseDate,
    "getCellNode": getCellNode,
    "getCellText": generateConfig.getDate,
    "getCellClassName": getCellClassName,
    "getCellDate": generateConfig.addDate,
    "titleCell": date => (0, _dateUtil.formatValue)(date, {
      locale,
      format: 'YYYY-MM-DD',
      generateConfig
    }),
    "headerCells": headerCells
  }), null);
}
DateBody.displayName = 'DateBody';
DateBody.inheritAttrs = false;
DateBody.props = ['prefixCls', 'generateConfig', 'value?', 'viewDate', 'locale', 'rowCount', 'onSelect', 'dateRender?', 'disabledDate?',
// Used for week panel
'prefixColumn?', 'rowClassName?'];
var _default = exports.default = DateBody;