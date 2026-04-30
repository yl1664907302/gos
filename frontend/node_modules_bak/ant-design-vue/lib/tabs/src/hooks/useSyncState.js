"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSyncState;
var _vue = require("vue");
function useSyncState(defaultState, onChange) {
  const stateRef = (0, _vue.ref)(defaultState);
  function setState(updater) {
    const newValue = typeof updater === 'function' ? updater(stateRef.value) : updater;
    if (newValue !== stateRef.value) {
      onChange(newValue, stateRef.value);
    }
    stateRef.value = newValue;
  }
  return [stateRef, setState];
}