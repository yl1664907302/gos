"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSupported = useSupported;
var _tryOnMounted = require("./tryOnMounted");
var _vue = require("vue");
function useSupported(callback) {
  let sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  const isSupported = (0, _vue.shallowRef)();
  const update = () => isSupported.value = Boolean(callback());
  update();
  (0, _tryOnMounted.tryOnMounted)(update, sync);
  return isSupported;
}