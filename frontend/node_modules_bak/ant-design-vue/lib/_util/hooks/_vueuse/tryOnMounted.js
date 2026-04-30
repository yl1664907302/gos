"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryOnMounted = tryOnMounted;
var _vue = require("vue");
// eslint-disable-next-line no-restricted-imports

/**
 * Call onMounted() if it's inside a component lifecycle, if not, just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
function tryOnMounted(fn) {
  let sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  if ((0, _vue.getCurrentInstance)()) (0, _vue.onMounted)(fn);else if (sync) fn();else (0, _vue.nextTick)(fn);
}