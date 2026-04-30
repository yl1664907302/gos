"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFrameSetState;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _raf = _interopRequireDefault(require("../../../_util/raf"));
var _vue = require("vue");
function useFrameSetState(initial) {
  const frame = (0, _vue.ref)(null);
  const state = (0, _vue.reactive)((0, _extends2.default)({}, initial));
  const queue = (0, _vue.ref)([]);
  const setFrameState = newState => {
    if (frame.value === null) {
      queue.value = [];
      frame.value = (0, _raf.default)(() => {
        let memoState;
        queue.value.forEach(queueState => {
          memoState = (0, _extends2.default)((0, _extends2.default)({}, memoState), queueState);
        });
        (0, _extends2.default)(state, memoState);
        frame.value = null;
      });
    }
    queue.value.push(newState);
  };
  (0, _vue.onMounted)(() => {
    frame.value && _raf.default.cancel(frame.value);
  });
  return [state, setFrameState];
}