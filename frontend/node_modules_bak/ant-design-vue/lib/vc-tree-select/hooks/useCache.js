"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
/**
 * This function will try to call requestIdleCallback if available to save performance.
 * No need `getLabel` here since already fetch on `rawLabeledValue`.
 */
var _default = values => {
  const cacheRef = (0, _vue.shallowRef)({
    valueLabels: new Map()
  });
  const mergedValues = (0, _vue.shallowRef)();
  (0, _vue.watch)(values, () => {
    mergedValues.value = (0, _vue.toRaw)(values.value);
  }, {
    immediate: true
  });
  const newFilledValues = (0, _vue.computed)(() => {
    const {
      valueLabels
    } = cacheRef.value;
    const valueLabelsCache = new Map();
    const filledValues = mergedValues.value.map(item => {
      var _a;
      const {
        value
      } = item;
      const mergedLabel = (_a = item.label) !== null && _a !== void 0 ? _a : valueLabels.get(value);
      // Save in cache
      valueLabelsCache.set(value, mergedLabel);
      return (0, _extends2.default)((0, _extends2.default)({}, item), {
        label: mergedLabel
      });
    });
    cacheRef.value.valueLabels = valueLabelsCache;
    return filledValues;
  });
  return [newFilledValues];
};
exports.default = _default;