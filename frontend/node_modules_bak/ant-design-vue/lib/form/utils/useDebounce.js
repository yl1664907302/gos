"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useDebounce;
var _vue = require("vue");
function useDebounce(value) {
  const cacheValue = (0, _vue.shallowRef)(value.value.slice());
  let timeout = null;
  (0, _vue.watchEffect)(() => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cacheValue.value = value.value;
    }, value.value.length ? 0 : 10);
  });
  return cacheValue;
}