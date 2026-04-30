"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _cssinjs = require("../../_util/cssinjs");
var _style = require("../../style");
var _internal = require("../../theme/internal");
var _vue = require("vue");
const useStyle = iconPrefixCls => {
  const [theme, token] = (0, _internal.useToken)();
  // Generate style for icons
  return (0, _cssinjs.useStyleRegister)((0, _vue.computed)(() => ({
    theme: theme.value,
    token: token.value,
    hashId: '',
    path: ['ant-design-icons', iconPrefixCls.value]
  })), () => [{
    [`.${iconPrefixCls.value}`]: (0, _extends2.default)((0, _extends2.default)({}, (0, _style.resetIcon)()), {
      [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
        display: 'block'
      }
    })
  }]);
};
var _default = exports.default = useStyle;