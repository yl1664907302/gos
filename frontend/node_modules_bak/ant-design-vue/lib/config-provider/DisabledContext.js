"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProviderDisabled = exports.useInjectDisabled = void 0;
var _vue = require("vue");
const DisabledContextKey = Symbol('DisabledContextKey');
const useInjectDisabled = () => {
  return (0, _vue.inject)(DisabledContextKey, (0, _vue.ref)(undefined));
};
exports.useInjectDisabled = useInjectDisabled;
const useProviderDisabled = disabled => {
  const parentDisabled = useInjectDisabled();
  (0, _vue.provide)(DisabledContextKey, (0, _vue.computed)(() => {
    var _a;
    return (_a = disabled.value) !== null && _a !== void 0 ? _a : parentDisabled.value;
  }));
  return disabled;
};
exports.useProviderDisabled = useProviderDisabled;