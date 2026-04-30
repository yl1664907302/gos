"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
function createContext(defaultValue) {
  const contextKey = Symbol('contextKey');
  const useProvide = (props, newProps) => {
    const mergedProps = (0, _vue.reactive)({});
    (0, _vue.provide)(contextKey, mergedProps);
    (0, _vue.watchEffect)(() => {
      (0, _extends2.default)(mergedProps, props, newProps || {});
    });
    return mergedProps;
  };
  const useInject = () => {
    return (0, _vue.inject)(contextKey, defaultValue) || {};
  };
  return {
    useProvide,
    useInject
  };
}
var _default = exports.default = createContext;