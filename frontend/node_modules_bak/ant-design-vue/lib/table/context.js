"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideTableContext = exports.useProvideSlots = exports.useInjectTableContext = exports.useInjectSlots = void 0;
var _vue = require("vue");
const SlotsContextKey = Symbol('SlotsContextProps');
const useProvideSlots = props => {
  (0, _vue.provide)(SlotsContextKey, props);
};
exports.useProvideSlots = useProvideSlots;
const useInjectSlots = () => {
  return (0, _vue.inject)(SlotsContextKey, (0, _vue.computed)(() => ({})));
};
exports.useInjectSlots = useInjectSlots;
const ContextKey = Symbol('ContextProps');
const useProvideTableContext = props => {
  (0, _vue.provide)(ContextKey, props);
};
exports.useProvideTableContext = useProvideTableContext;
const useInjectTableContext = () => {
  return (0, _vue.inject)(ContextKey, {
    onResizeColumn: () => {}
  });
};
exports.useInjectTableContext = useInjectTableContext;