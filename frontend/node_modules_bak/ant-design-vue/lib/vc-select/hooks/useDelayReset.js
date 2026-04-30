"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useDelayReset;
var _vue = require("vue");
/**
 * Similar with `useLock`, but this hook will always execute last value.
 * When set to `true`, it will keep `true` for a short time even if `false` is set.
 */
function useDelayReset() {
  let timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  const bool = (0, _vue.shallowRef)(false);
  let delay;
  const cancelLatest = () => {
    clearTimeout(delay);
  };
  (0, _vue.onMounted)(() => {
    cancelLatest();
  });
  const delaySetBool = (value, callback) => {
    cancelLatest();
    delay = setTimeout(() => {
      bool.value = value;
      if (callback) {
        callback();
      }
    }, timeout);
  };
  return [bool, delaySetBool, cancelLatest];
}