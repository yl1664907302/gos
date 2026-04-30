"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = genComponentStyleHook;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _cssinjs = require("../../_util/cssinjs");
var _style = require("../../style");
var _internal = require("../internal");
var _vue = require("vue");
var _context = require("../../config-provider/context");
/* eslint-disable no-redeclare */

function genComponentStyleHook(component, styleFn, getDefaultToken) {
  return _prefixCls => {
    const prefixCls = (0, _vue.computed)(() => _prefixCls === null || _prefixCls === void 0 ? void 0 : _prefixCls.value);
    const [theme, token, hashId] = (0, _internal.useToken)();
    const {
      getPrefixCls,
      iconPrefixCls
    } = (0, _context.useConfigContextInject)();
    const rootPrefixCls = (0, _vue.computed)(() => getPrefixCls());
    const sharedInfo = (0, _vue.computed)(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: ['Shared', rootPrefixCls.value]
      };
    });
    // Generate style for all a tags in antd component.
    (0, _cssinjs.useStyleRegister)(sharedInfo, () => [{
      // Link
      '&': (0, _style.genLinkStyle)(token.value)
    }]);
    const componentInfo = (0, _vue.computed)(() => {
      return {
        theme: theme.value,
        token: token.value,
        hashId: hashId.value,
        path: [component, prefixCls.value, iconPrefixCls.value]
      };
    });
    return [(0, _cssinjs.useStyleRegister)(componentInfo, () => {
      const {
        token: proxyToken,
        flush
      } = (0, _internal.statisticToken)(token.value);
      const defaultComponentToken = typeof getDefaultToken === 'function' ? getDefaultToken(proxyToken) : getDefaultToken;
      const mergedComponentToken = (0, _extends2.default)((0, _extends2.default)({}, defaultComponentToken), token.value[component]);
      const componentCls = `.${prefixCls.value}`;
      const mergedToken = (0, _internal.mergeToken)(proxyToken, {
        componentCls,
        prefixCls: prefixCls.value,
        iconCls: `.${iconPrefixCls.value}`,
        antCls: `.${rootPrefixCls.value}`
      }, mergedComponentToken);
      const styleInterpolation = styleFn(mergedToken, {
        hashId: hashId.value,
        prefixCls: prefixCls.value,
        rootPrefixCls: rootPrefixCls.value,
        iconPrefixCls: iconPrefixCls.value,
        overrideComponentToken: token.value[component]
      });
      flush(component, mergedComponentToken);
      return [(0, _style.genCommonStyle)(token.value, prefixCls.value), styleInterpolation];
    }), hashId];
  };
}