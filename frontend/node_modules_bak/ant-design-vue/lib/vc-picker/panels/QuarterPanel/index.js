"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _QuarterHeader = _interopRequireDefault(require("./QuarterHeader"));
var _QuarterBody = _interopRequireDefault(require("./QuarterBody"));
var _uiUtil = require("../../utils/uiUtil");
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function QuarterPanel(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    operationRef,
    onViewDateChange,
    generateConfig,
    value,
    viewDate,
    onPanelChange,
    onSelect
  } = props;
  const panelPrefixCls = `${prefixCls}-quarter-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => (0, _uiUtil.createKeydownHandler)(event, {
      onLeftRight: diff => {
        onSelect(generateConfig.addMonth(value || viewDate, diff * 3), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addYear(value || viewDate, diff), 'key');
      }
    })
  };
  // ==================== View Operation ====================
  const onYearChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  return (0, _vue.createVNode)("div", {
    "class": panelPrefixCls
  }, [(0, _vue.createVNode)(_QuarterHeader.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": prefixCls,
    "onPrevYear": () => {
      onYearChange(-1);
    },
    "onNextYear": () => {
      onYearChange(1);
    },
    "onYearClick": () => {
      onPanelChange('year', viewDate);
    }
  }), null), (0, _vue.createVNode)(_QuarterBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": prefixCls,
    "onSelect": date => {
      onSelect(date, 'mouse');
    }
  }), null)]);
}
QuarterPanel.displayName = 'QuarterPanel';
QuarterPanel.inheritAttrs = false;
var _default = exports.default = QuarterPanel;