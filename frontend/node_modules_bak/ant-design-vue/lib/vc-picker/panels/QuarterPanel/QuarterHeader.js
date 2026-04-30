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
function QuarterHeader(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    viewDate,
    onNextYear,
    onPrevYear,
    onYearClick
  } = props;
  const {
    hideHeader
  } = (0, _PanelContext.useInjectPanel)();
  if (hideHeader.value) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  return (0, _vue.createVNode)(_Header.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevYear,
    "onSuperNext": onNextYear
  }), {
    default: () => [(0, _vue.createVNode)("button", {
      "type": "button",
      "onClick": onYearClick,
      "class": `${prefixCls}-year-btn`
    }, [(0, _dateUtil.formatValue)(viewDate, {
      locale,
      format: locale.yearFormat,
      generateConfig
    })])]
  });
}
QuarterHeader.displayName = 'QuarterHeader';
QuarterHeader.inheritAttrs = false;
var _default = exports.default = QuarterHeader;