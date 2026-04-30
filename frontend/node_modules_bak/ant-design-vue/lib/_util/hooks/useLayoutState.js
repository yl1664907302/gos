"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLayoutState = useLayoutState;
var _vue = require("vue");
var _raf = _interopRequireDefault(require("../raf"));
/**
 * Execute code before next frame but async
 */
function useLayoutState(defaultState) {
  const stateRef = (0, _vue.shallowRef)(defaultState);
  let tempState = stateRef.value;
  let updateBatchRef = [];
  const rafRef = (0, _vue.shallowRef)();
  function setFrameState(updater) {
    _raf.default.cancel(rafRef.value);
    updateBatchRef.push(updater);
    rafRef.value = (0, _raf.default)(() => {
      const prevBatch = updateBatchRef;
      // const prevState = stateRef.value;
      updateBatchRef = [];
      prevBatch.forEach(batchUpdater => {
        tempState = batchUpdater(tempState);
      });
      // if (tempState !== stateRef.value) {
      stateRef.value = tempState;
      // }
    });
  }
  (0, _vue.onBeforeUnmount)(() => {
    _raf.default.cancel(rafRef.value);
  });
  return [stateRef, setFrameState];
}