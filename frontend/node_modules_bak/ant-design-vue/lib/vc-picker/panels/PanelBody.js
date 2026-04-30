"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _PanelContext = require("../PanelContext");
var _timeUtil = require("../utils/timeUtil");
var _dateUtil = require("../utils/dateUtil");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _useMergeProps = _interopRequireDefault(require("../hooks/useMergeProps"));
function PanelBody(_props) {
  const {
    prefixCls,
    disabledDate,
    onSelect,
    picker,
    rowNum,
    colNum,
    prefixColumn,
    rowClassName,
    baseDate,
    getCellClassName,
    getCellText,
    getCellNode,
    getCellDate,
    generateConfig,
    titleCell,
    headerCells
  } = (0, _useMergeProps.default)(_props);
  const {
    onDateMouseenter,
    onDateMouseleave,
    mode
  } = (0, _PanelContext.useInjectPanel)();
  const cellPrefixCls = `${prefixCls}-cell`;
  // =============================== Body ===============================
  const rows = [];
  for (let i = 0; i < rowNum; i += 1) {
    const row = [];
    let rowStartDate;
    for (let j = 0; j < colNum; j += 1) {
      const offset = i * colNum + j;
      const currentDate = getCellDate(baseDate, offset);
      const disabled = (0, _dateUtil.getCellDateDisabled)({
        cellDate: currentDate,
        mode: mode.value,
        disabledDate,
        generateConfig
      });
      if (j === 0) {
        rowStartDate = currentDate;
        if (prefixColumn) {
          row.push(prefixColumn(rowStartDate));
        }
      }
      const title = titleCell && titleCell(currentDate);
      row.push((0, _vue.createVNode)("td", {
        "key": j,
        "title": title,
        "class": (0, _classNames.default)(cellPrefixCls, (0, _extends2.default)({
          [`${cellPrefixCls}-disabled`]: disabled,
          [`${cellPrefixCls}-start`]: getCellText(currentDate) === 1 || picker === 'year' && Number(title) % 10 === 0,
          [`${cellPrefixCls}-end`]: title === (0, _timeUtil.getLastDay)(generateConfig, currentDate) || picker === 'year' && Number(title) % 10 === 9
        }, getCellClassName(currentDate))),
        "onClick": e => {
          e.stopPropagation();
          if (!disabled) {
            onSelect(currentDate);
          }
        },
        "onMouseenter": () => {
          if (!disabled && onDateMouseenter) {
            onDateMouseenter(currentDate);
          }
        },
        "onMouseleave": () => {
          if (!disabled && onDateMouseleave) {
            onDateMouseleave(currentDate);
          }
        }
      }, [getCellNode ? getCellNode(currentDate) : (0, _vue.createVNode)("div", {
        "class": `${cellPrefixCls}-inner`
      }, [getCellText(currentDate)])]));
    }
    rows.push((0, _vue.createVNode)("tr", {
      "key": i,
      "class": rowClassName && rowClassName(rowStartDate)
    }, [row]));
  }
  return (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-body`
  }, [(0, _vue.createVNode)("table", {
    "class": `${prefixCls}-content`
  }, [headerCells && (0, _vue.createVNode)("thead", null, [(0, _vue.createVNode)("tr", null, [headerCells])]), (0, _vue.createVNode)("tbody", null, [rows])])]);
}
PanelBody.displayName = 'PanelBody';
PanelBody.inheritAttrs = false;
var _default = exports.default = PanelBody;