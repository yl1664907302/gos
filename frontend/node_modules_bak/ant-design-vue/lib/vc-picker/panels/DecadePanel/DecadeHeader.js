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
function DecadeHeader(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    generateConfig,
    viewDate,
    onPrevDecades,
    onNextDecades
  } = props;
  const {
    hideHeader
  } = (0, _PanelContext.useInjectPanel)();
  if (hideHeader) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / _.DECADE_DISTANCE_COUNT) * _.DECADE_DISTANCE_COUNT;
  const endYear = startYear + _.DECADE_DISTANCE_COUNT - 1;
  return (0, _vue.createVNode)(_Header.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevDecades,
    "onSuperNext": onNextDecades
  }), {
    default: () => [startYear, (0, _vue.createTextVNode)("-"), endYear]
  });
}
DecadeHeader.displayName = 'DecadeHeader';
DecadeHeader.inheritAttrs = false;
var _default = exports.default = DecadeHeader;