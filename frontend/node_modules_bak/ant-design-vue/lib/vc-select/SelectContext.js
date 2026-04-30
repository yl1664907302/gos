"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSelectProps;
exports.useProvideSelectProps = useProvideSelectProps;
var _vue = require("vue");
/**
 * BaseSelect provide some parsed data into context.
 * You can use this hooks to get them.
 */

const SelectContextKey = Symbol('SelectContextKey');
function useProvideSelectProps(props) {
  return (0, _vue.provide)(SelectContextKey, props);
}
function useSelectProps() {
  return (0, _vue.inject)(SelectContextKey, {});
}