import { computed } from 'vue';
import warning from '../../vc-util/warning';
export default function usePresets(presets, legacyRanges) {
  return computed(() => {
    if (presets === null || presets === void 0 ? void 0 : presets.value) {
      return presets.value;
    }
    if (legacyRanges === null || legacyRanges === void 0 ? void 0 : legacyRanges.value) {
      warning(false, '`ranges` is deprecated. Please use `presets` instead.');
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