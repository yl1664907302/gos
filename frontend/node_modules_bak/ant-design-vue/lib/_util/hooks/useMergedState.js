"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMergedState;
var _vue = require("vue");
function useMergedState(defaultStateValue, option) {
  const {
    defaultValue,
    value = (0, _vue.ref)()
  } = option || {};
  let initValue = typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
  if (value.value !== undefined) {
    initValue = (0, _vue.unref)(value);
  }
  if (defaultValue !== undefined) {
    initValue = typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }
  const innerValue = (0, _vue.ref)(initValue);
  const mergedValue = (0, _vue.ref)(initValue);
  (0, _vue.watchEffect)(() => {
    let val = value.value !== undefined ? value.value : innerValue.value;
    if (option.postState) {
      val = option.postState(val);
    }
    mergedValue.value = val;
  });
  function triggerChange(newValue) {
    const preVal = mergedValue.value;
    innerValue.value = newValue;
    if ((0, _vue.toRaw)(mergedValue.value) !== newValue && option.onChange) {
      option.onChange(newValue, preVal);
    }
  }
  // Effect of reset value to `undefined`
  (0, _vue.watch)(value, () => {
    innerValue.value = value.value;
  });
  return [mergedValue, triggerChange];
}