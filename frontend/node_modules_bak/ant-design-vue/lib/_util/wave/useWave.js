"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useWave;
var _vue = require("vue");
var _propsUtil = require("../props-util");
var _WaveEffect = _interopRequireDefault(require("./WaveEffect"));
function useWave(className, wave) {
  const instance = (0, _vue.getCurrentInstance)();
  let stopWave;
  function showWave() {
    var _a;
    const node = (0, _propsUtil.findDOMNode)(instance);
    stopWave === null || stopWave === void 0 ? void 0 : stopWave();
    if (((_a = wave === null || wave === void 0 ? void 0 : wave.value) === null || _a === void 0 ? void 0 : _a.disabled) || !node) {
      return;
    }
    stopWave = (0, _WaveEffect.default)(node, className.value);
  }
  (0, _vue.onBeforeUnmount)(() => {
    stopWave === null || stopWave === void 0 ? void 0 : stopWave();
  });
  return showWave;
}