"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useHoverValue;
var _raf = _interopRequireDefault(require("../../_util/raf"));
var _vue = require("vue");
var _useValueTexts = _interopRequireDefault(require("./useValueTexts"));
function useHoverValue(valueText, _ref) {
  let {
    formatList,
    generateConfig,
    locale
  } = _ref;
  const innerValue = (0, _vue.ref)(null);
  let rafId;
  function setValue(val) {
    let immediately = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _raf.default.cancel(rafId);
    if (immediately) {
      innerValue.value = val;
      return;
    }
    rafId = (0, _raf.default)(() => {
      innerValue.value = val;
    });
  }
  const [, firstText] = (0, _useValueTexts.default)(innerValue, {
    formatList,
    generateConfig,
    locale
  });
  function onEnter(date) {
    setValue(date);
  }
  function onLeave() {
    let immediately = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    setValue(null, immediately);
  }
  (0, _vue.watch)(valueText, () => {
    onLeave(true);
  });
  (0, _vue.onBeforeUnmount)(() => {
    _raf.default.cancel(rafId);
  });
  return [firstText, onEnter, onLeave];
}