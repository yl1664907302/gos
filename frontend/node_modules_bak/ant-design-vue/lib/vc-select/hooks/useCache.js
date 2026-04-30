"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
/**
 * Cache `value` related LabeledValue & options.
 */
var _default = (labeledValues, valueOptions) => {
  const cacheRef = (0, _vue.shallowRef)({
    values: new Map(),
    options: new Map()
  });
  const filledLabeledValues = (0, _vue.computed)(() => {
    const {
      values: prevValueCache,
      options: prevOptionCache
    } = cacheRef.value;
    // Fill label by cache
    const patchedValues = labeledValues.value.map(item => {
      var _a;
      if (item.label === undefined) {
        return (0, _extends2.default)((0, _extends2.default)({}, item), {
          label: (_a = prevValueCache.get(item.value)) === null || _a === void 0 ? void 0 : _a.label
        });
      }
      return item;
    });
    // Refresh cache
    const valueCache = new Map();
    const optionCache = new Map();
    patchedValues.forEach(item => {
      valueCache.set(item.value, item);
      optionCache.set(item.value, valueOptions.value.get(item.value) || prevOptionCache.get(item.value));
    });
    cacheRef.value.values = valueCache;
    cacheRef.value.options = optionCache;
    return patchedValues;
  });
  const getOption = val => valueOptions.value.get(val) || cacheRef.value.options.get(val);
  return [filledLabeledValues, getOption];
};
exports.default = _default;