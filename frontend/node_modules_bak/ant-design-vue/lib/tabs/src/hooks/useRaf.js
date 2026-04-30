"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useRaf;
exports.useRafState = useRafState;
var _vue = require("vue");
var _raf = _interopRequireDefault(require("../../../_util/raf"));
function useRaf(callback) {
  const rafRef = (0, _vue.shallowRef)();
  const removedRef = (0, _vue.shallowRef)(false);
  function trigger() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (!removedRef.value) {
      _raf.default.cancel(rafRef.value);
      rafRef.value = (0, _raf.default)(() => {
        callback(...args);
      });
    }
  }
  (0, _vue.onBeforeUnmount)(() => {
    removedRef.value = true;
    _raf.default.cancel(rafRef.value);
  });
  return trigger;
}
function useRafState(defaultState) {
  const batchRef = (0, _vue.shallowRef)([]);
  const state = (0, _vue.shallowRef)(typeof defaultState === 'function' ? defaultState() : defaultState);
  const flushUpdate = useRaf(() => {
    let value = state.value;
    batchRef.value.forEach(callback => {
      value = callback(value);
    });
    batchRef.value = [];
    state.value = value;
  });
  function updater(callback) {
    batchRef.value.push(callback);
    flushUpdate();
  }
  return [state, updater];
}