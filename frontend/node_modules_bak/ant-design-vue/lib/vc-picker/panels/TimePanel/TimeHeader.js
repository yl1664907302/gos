"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _Header = _interopRequireDefault(require("../Header"));
var _PanelContext = require("../../PanelContext");
var _dateUtil = require("../../utils/dateUtil");
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function TimeHeader(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    hideHeader
  } = (0, _PanelContext.useInjectPanel)();
  if (hideHeader.value) {
    return null;
  }
  const {
    prefixCls,
    generateConfig,
    locale,
    value,
    format
  } = props;
  const headerPrefixCls = `${prefixCls}-header`;
  return (0, _vue.createVNode)(_Header.default, {
    "prefixCls": headerPrefixCls
  }, {
    default: () => [value ? (0, _dateUtil.formatValue)(value, {
      locale,
      format,
      generateConfig
    }) : '\u00A0']
  });
}
TimeHeader.displayName = 'TimeHeader';
TimeHeader.inheritAttrs = false;
var _default = exports.default = TimeHeader;