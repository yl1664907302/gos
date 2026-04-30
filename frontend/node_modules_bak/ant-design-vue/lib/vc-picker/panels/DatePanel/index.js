"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _DateBody = _interopRequireDefault(require("./DateBody"));
var _DateHeader = _interopRequireDefault(require("./DateHeader"));
var _dateUtil = require("../../utils/dateUtil");
var _uiUtil = require("../../utils/uiUtil");
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const DATE_ROW_COUNT = 6;
function DatePanel(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    panelName = 'date',
    keyboardConfig,
    active,
    operationRef,
    generateConfig,
    value,
    viewDate,
    onViewDateChange,
    onPanelChange,
    onSelect
  } = props;
  const panelPrefixCls = `${prefixCls}-${panelName}-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => (0, _uiUtil.createKeydownHandler)(event, (0, _extends2.default)({
      onLeftRight: diff => {
        onSelect(generateConfig.addDate(value || viewDate, diff), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addDate(value || viewDate, diff * _dateUtil.WEEK_DAY_COUNT), 'key');
      },
      onPageUpDown: diff => {
        onSelect(generateConfig.addMonth(value || viewDate, diff), 'key');
      }
    }, keyboardConfig))
  };
  // ==================== View Operation ====================
  const onYearChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  const onMonthChange = diff => {
    const newDate = generateConfig.addMonth(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  return (0, _vue.createVNode)("div", {
    "class": (0, _classNames.default)(panelPrefixCls, {
      [`${panelPrefixCls}-active`]: active
    })
  }, [(0, _vue.createVNode)(_DateHeader.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": prefixCls,
    "value": value,
    "viewDate": viewDate,
    "onPrevYear": () => {
      onYearChange(-1);
    },
    "onNextYear": () => {
      onYearChange(1);
    },
    "onPrevMonth": () => {
      onMonthChange(-1);
    },
    "onNextMonth": () => {
      onMonthChange(1);
    },
    "onMonthClick": () => {
      onPanelChange('month', viewDate);
    },
    "onYearClick": () => {
      onPanelChange('year', viewDate);
    }
  }), null), (0, _vue.createVNode)(_DateBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "onSelect": date => onSelect(date, 'mouse'),
    "prefixCls": prefixCls,
    "value": value,
    "viewDate": viewDate,
    "rowCount": DATE_ROW_COUNT
  }), null)]);
}
DatePanel.displayName = 'DatePanel';
DatePanel.inheritAttrs = false;
var _default = exports.default = DatePanel;