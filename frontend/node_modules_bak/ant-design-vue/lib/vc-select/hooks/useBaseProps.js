"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useBaseProps;
exports.useProvideBaseSelectProps = useProvideBaseSelectProps;
var _vue = require("vue");
/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

const BaseSelectContextKey = Symbol('BaseSelectContextKey');
function useProvideBaseSelectProps(props) {
  return (0, _vue.provide)(BaseSelectContextKey, props);
}
function useBaseProps() {
  return (0, _vue.inject)(BaseSelectContextKey, {});
}