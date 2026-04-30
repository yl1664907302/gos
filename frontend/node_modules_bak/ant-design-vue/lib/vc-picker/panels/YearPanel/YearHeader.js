"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Header = _interopRequireDefault(require("../Header"));
var _ = require(".");
var _PanelContext = require("../../PanelContext");
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function YearHeader(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    generateConfig,
    viewDate,
    onPrevDecade,
    onNextDecade,
    onDecadeClick
  } = props;
  const {
    hideHeader
  } = (0, _PanelContext.useInjectPanel)();
  if (hideHeader.value) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / _.YEAR_DECADE_COUNT) * _.YEAR_DECADE_COUNT;
  const endYear = startYear + _.YEAR_DECADE_COUNT - 1;
  return (0, _vue.createVNode)(_Header.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevDecade,
    "onSuperNext": onNextDecade
  }), {
    default: () => [(0, _vue.createVNode)("button", {
      "type": "button",
      "onClick": onDecadeClick,
      "class": `${prefixCls}-decade-btn`
    }, [startYear, (0, _vue.createTextVNode)("-"), endYear])]
  });
}
YearHeader.displayName = 'YearHeader';
YearHeader.inheritAttrs = false;
var _default = exports.default = YearHeader;