"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideFloatButtonGroupContext = exports.useInjectFloatButtonGroupContext = void 0;
var _vue = require("vue");
const contextKey = Symbol('floatButtonGroupContext');
const useProvideFloatButtonGroupContext = props => {
  (0, _vue.provide)(contextKey, props);
  return props;
};
exports.useProvideFloatButtonGroupContext = useProvideFloatButtonGroupContext;
const useInjectFloatButtonGroupContext = () => {
  return (0, _vue.inject)(contextKey, {
    shape: (0, _vue.ref)()
  });
};
exports.useInjectFloatButtonGroupContext = useInjectFloatButtonGroupContext;