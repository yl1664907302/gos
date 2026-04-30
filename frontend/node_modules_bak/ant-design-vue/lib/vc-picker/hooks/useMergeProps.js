"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMergeProps;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
// 仅用在函数式组件中，不用考虑响应式问题
function useMergeProps(props) {
  const attrs = (0, _vue.useAttrs)();
  return (0, _extends2.default)((0, _extends2.default)({}, props), attrs);
}