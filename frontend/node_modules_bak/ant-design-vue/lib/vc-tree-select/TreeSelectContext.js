"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useInjectSelectContext;
exports.useProvideSelectContext = useProvideSelectContext;
var _vue = require("vue");
const TreeSelectContextPropsKey = Symbol('TreeSelectContextPropsKey');
function useProvideSelectContext(props) {
  return (0, _vue.provide)(TreeSelectContextPropsKey, props);
}
function useInjectSelectContext() {
  return (0, _vue.inject)(TreeSelectContextPropsKey, {});
}