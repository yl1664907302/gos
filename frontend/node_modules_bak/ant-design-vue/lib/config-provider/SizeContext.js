"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProviderSize = exports.useInjectSize = void 0;
var _vue = require("vue");
const SizeContextKey = Symbol('SizeContextKey');
const useInjectSize = () => {
  return (0, _vue.inject)(SizeContextKey, (0, _vue.ref)(undefined));
};
exports.useInjectSize = useInjectSize;
const useProviderSize = size => {
  const parentSize = useInjectSize();
  (0, _vue.provide)(SizeContextKey, (0, _vue.computed)(() => size.value || parentSize.value));
  return size;
};
exports.useProviderSize = useProviderSize;