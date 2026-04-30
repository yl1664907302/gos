"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLayoutState = useLayoutState;
exports.useTimeoutLock = useTimeoutLock;
var _raf = _interopRequireDefault(require("../../_util/raf"));
var _vue = require("vue");
function useLayoutState(defaultState) {
  const stateRef = (0, _vue.shallowRef)(defaultState);
  let rafId;
  const updateBatchRef = (0, _vue.shallowRef)([]);
  function setFrameState(updater) {
    updateBatchRef.value.push(updater);
    _raf.default.cancel(rafId);
    rafId = (0, _raf.default)(() => {
      const prevBatch = updateBatchRef.value;
      // const prevState = stateRef.value;
      updateBatchRef.value = [];
      prevBatch.forEach(batchUpdater => {
        stateRef.value = batchUpdater(stateRef.value);
      });
    });
  }
  (0, _vue.onBeforeUnmount)(() => {
    _raf.default.cancel(rafId);
  });
  return [stateRef, setFrameState];
}
/** Lock frame, when frame pass reset the lock. */
function useTimeoutLock(defaultState) {
  const frameRef = (0, _vue.ref)(defaultState || null);
  const timeoutRef = (0, _vue.ref)();
  function cleanUp() {
    clearTimeout(timeoutRef.value);
  }
  function setState(newState) {
    frameRef.value = newState;
    cleanUp();
    timeoutRef.value = setTimeout(() => {
      frameRef.value = null;
      timeoutRef.value = undefined;
    }, 100);
  }
  function getState() {
    return frameRef.value;
  }
  (0, _vue.onBeforeUnmount)(() => {
    cleanUp();
  });
  return [setState, getState];
}