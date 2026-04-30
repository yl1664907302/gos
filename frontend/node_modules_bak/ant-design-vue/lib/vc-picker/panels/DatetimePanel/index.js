"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _DatePanel = _interopRequireDefault(require("../DatePanel"));
var _TimePanel = _interopRequireDefault(require("../TimePanel"));
var _miscUtil = require("../../utils/miscUtil");
var _timeUtil = require("../../utils/timeUtil");
var _KeyCode = _interopRequireDefault(require("../../../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const ACTIVE_PANEL = (0, _miscUtil.tuple)('date', 'time');
function DatetimePanel(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    operationRef,
    generateConfig,
    value,
    defaultValue,
    disabledTime,
    showTime,
    onSelect
  } = props;
  const panelPrefixCls = `${prefixCls}-datetime-panel`;
  const activePanel = (0, _vue.ref)(null);
  const dateOperationRef = (0, _vue.ref)({});
  const timeOperationRef = (0, _vue.ref)({});
  const timeProps = typeof showTime === 'object' ? (0, _extends2.default)({}, showTime) : {};
  // ======================= Keyboard =======================
  function getNextActive(offset) {
    const activeIndex = ACTIVE_PANEL.indexOf(activePanel.value) + offset;
    const nextActivePanel = ACTIVE_PANEL[activeIndex] || null;
    return nextActivePanel;
  }
  const onBlur = e => {
    if (timeOperationRef.value.onBlur) {
      timeOperationRef.value.onBlur(e);
    }
    activePanel.value = null;
  };
  operationRef.value = {
    onKeydown: event => {
      // Switch active panel
      if (event.which === _KeyCode.default.TAB) {
        const nextActivePanel = getNextActive(event.shiftKey ? -1 : 1);
        activePanel.value = nextActivePanel;
        if (nextActivePanel) {
          event.preventDefault();
        }
        return true;
      }
      // Operate on current active panel
      if (activePanel.value) {
        const ref = activePanel.value === 'date' ? dateOperationRef : timeOperationRef;
        if (ref.value && ref.value.onKeydown) {
          ref.value.onKeydown(event);
        }
        return true;
      }
      // Switch first active panel if operate without panel
      if ([_KeyCode.default.LEFT, _KeyCode.default.RIGHT, _KeyCode.default.UP, _KeyCode.default.DOWN].includes(event.which)) {
        activePanel.value = 'date';
        return true;
      }
      return false;
    },
    onBlur,
    onClose: onBlur
  };
  // ======================== Events ========================
  const onInternalSelect = (date, source) => {
    let selectedDate = date;
    if (source === 'date' && !value && timeProps.defaultValue) {
      // Date with time defaultValue
      selectedDate = generateConfig.setHour(selectedDate, generateConfig.getHour(timeProps.defaultValue));
      selectedDate = generateConfig.setMinute(selectedDate, generateConfig.getMinute(timeProps.defaultValue));
      selectedDate = generateConfig.setSecond(selectedDate, generateConfig.getSecond(timeProps.defaultValue));
    } else if (source === 'time' && !value && defaultValue) {
      selectedDate = generateConfig.setYear(selectedDate, generateConfig.getYear(defaultValue));
      selectedDate = generateConfig.setMonth(selectedDate, generateConfig.getMonth(defaultValue));
      selectedDate = generateConfig.setDate(selectedDate, generateConfig.getDate(defaultValue));
    }
    if (onSelect) {
      onSelect(selectedDate, 'mouse');
    }
  };
  // ======================== Render ========================
  const disabledTimes = disabledTime ? disabledTime(value || null) : {};
  return (0, _vue.createVNode)("div", {
    "class": (0, _classNames.default)(panelPrefixCls, {
      [`${panelPrefixCls}-active`]: activePanel.value
    })
  }, [(0, _vue.createVNode)(_DatePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "operationRef": dateOperationRef,
    "active": activePanel.value === 'date',
    "onSelect": date => {
      onInternalSelect((0, _timeUtil.setDateTime)(generateConfig, date, !value && typeof showTime === 'object' ? showTime.defaultValue : null), 'date');
    }
  }), null), (0, _vue.createVNode)(_TimePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "format": undefined
  }, timeProps), disabledTimes), {}, {
    "disabledTime": null,
    "defaultValue": undefined,
    "operationRef": timeOperationRef,
    "active": activePanel.value === 'time',
    "onSelect": date => {
      onInternalSelect(date, 'time');
    }
  }), null)]);
}
DatetimePanel.displayName = 'DatetimePanel';
DatetimePanel.inheritAttrs = false;
var _default = exports.default = DatetimePanel;