"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
const useDestroyed = () => {
  const destroyed = (0, _vue.shallowRef)(false);
  (0, _vue.onBeforeUnmount)(() => {
    destroyed.value = true;
  });
  return destroyed;
};
var _default = exports.default = useDestroyed;