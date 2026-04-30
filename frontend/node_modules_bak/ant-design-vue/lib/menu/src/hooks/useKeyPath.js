"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideKeyPath = exports.useMeasure = exports.useInjectKeyPath = exports.default = exports.PathContext = exports.OVERFLOW_KEY = exports.KeyPathContext = void 0;
var _vue = require("vue");
const OVERFLOW_KEY = exports.OVERFLOW_KEY = '$$__vc-menu-more__key';
const KeyPathContext = exports.KeyPathContext = Symbol('KeyPathContext');
const useInjectKeyPath = () => {
  return (0, _vue.inject)(KeyPathContext, {
    parentEventKeys: (0, _vue.computed)(() => []),
    parentKeys: (0, _vue.computed)(() => []),
    parentInfo: {}
  });
};
exports.useInjectKeyPath = useInjectKeyPath;
const useProvideKeyPath = (eventKey, key, menuInfo) => {
  const {
    parentEventKeys,
    parentKeys
  } = useInjectKeyPath();
  const eventKeys = (0, _vue.computed)(() => [...parentEventKeys.value, eventKey]);
  const keys = (0, _vue.computed)(() => [...parentKeys.value, key]);
  (0, _vue.provide)(KeyPathContext, {
    parentEventKeys: eventKeys,
    parentKeys: keys,
    parentInfo: menuInfo
  });
  return keys;
};
exports.useProvideKeyPath = useProvideKeyPath;
const measure = Symbol('measure');
const PathContext = exports.PathContext = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  setup(_props, _ref) {
    let {
      slots
    } = _ref;
    // 不需要响应式
    (0, _vue.provide)(measure, true);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const useMeasure = () => {
  return (0, _vue.inject)(measure, false);
};
exports.useMeasure = useMeasure;
var _default = exports.default = useProvideKeyPath;