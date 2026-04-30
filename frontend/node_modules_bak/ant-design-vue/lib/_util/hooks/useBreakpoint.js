"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _responsiveObserve = _interopRequireDefault(require("../../_util/responsiveObserve"));
function useBreakpoint() {
  const screens = (0, _vue.shallowRef)({});
  let token = null;
  const responsiveObserve = (0, _responsiveObserve.default)();
  (0, _vue.onMounted)(() => {
    token = responsiveObserve.value.subscribe(supportScreens => {
      screens.value = supportScreens;
    });
  });
  (0, _vue.onUnmounted)(() => {
    responsiveObserve.value.unsubscribe(token);
  });
  return screens;
}
var _default = exports.default = useBreakpoint;