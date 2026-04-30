"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = eagerComputed;
var _vue = require("vue");
function eagerComputed(fn) {
  const result = (0, _vue.shallowRef)();
  (0, _vue.watchEffect)(() => {
    result.value = fn();
  }, {
    flush: 'sync' // needed so updates are immediate.
  });
  return result;
}