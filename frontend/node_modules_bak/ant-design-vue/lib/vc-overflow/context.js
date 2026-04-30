"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInjectOverflowContext = exports.OverflowContextProvider = void 0;
var _vue = require("vue");
const OverflowContextProviderKey = Symbol('OverflowContextProviderKey');
const OverflowContextProvider = exports.OverflowContextProvider = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'OverflowContextProvider',
  inheritAttrs: false,
  props: {
    value: {
      type: Object
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    (0, _vue.provide)(OverflowContextProviderKey, (0, _vue.computed)(() => props.value));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const useInjectOverflowContext = () => {
  return (0, _vue.inject)(OverflowContextProviderKey, (0, _vue.computed)(() => null));
};
exports.useInjectOverflowContext = useInjectOverflowContext;