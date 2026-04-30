"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePresets;
var _vue = require("vue");
var _warning = _interopRequireDefault(require("../../vc-util/warning"));
function usePresets(presets, legacyRanges) {
  return (0, _vue.computed)(() => {
    if (presets === null || presets === void 0 ? void 0 : presets.value) {
      return presets.value;
    }
    if (legacyRanges === null || legacyRanges === void 0 ? void 0 : legacyRanges.value) {
      (0, _warning.default)(false, '`ranges` is deprecated. Please use `presets` instead.');
      const rangeLabels = Object.keys(legacyRanges.value);
      return rangeLabels.map(label => {
        const range = legacyRanges.value[label];
        const newValues = typeof range === 'function' ? range() : range;
        return {
          label,
          value: newValues
        };
      });
    }
    return [];
  });
}