"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideRadioOptionTypeContext = exports.useProvideRadioGroupContext = exports.useInjectRadioOptionTypeContext = exports.useInjectRadioGroupContext = void 0;
var _vue = require("vue");
const radioGroupContextKey = Symbol('radioGroupContextKey');
const useProvideRadioGroupContext = props => {
  (0, _vue.provide)(radioGroupContextKey, props);
};
exports.useProvideRadioGroupContext = useProvideRadioGroupContext;
const useInjectRadioGroupContext = () => {
  return (0, _vue.inject)(radioGroupContextKey, undefined);
};
exports.useInjectRadioGroupContext = useInjectRadioGroupContext;
const radioOptionTypeContextKey = Symbol('radioOptionTypeContextKey');
const useProvideRadioOptionTypeContext = props => {
  (0, _vue.provide)(radioOptionTypeContextKey, props);
};
exports.useProvideRadioOptionTypeContext = useProvideRadioOptionTypeContext;
const useInjectRadioOptionTypeContext = () => {
  return (0, _vue.inject)(radioOptionTypeContextKey, undefined);
};
exports.useInjectRadioOptionTypeContext = useInjectRadioOptionTypeContext;