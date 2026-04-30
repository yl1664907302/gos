import _extends from "@babel/runtime/helpers/esm/extends";
import { watch, toRaw, computed, shallowRef } from 'vue';
/**
 * This function will try to call requestIdleCallback if available to save performance.
 * No need `getLabel` here since already fetch on `rawLabeledValue`.
 */
export default (values => {
  const cacheRef = shallowRef({
    valueLabels: new Map()
  });
  const mergedValues = shallowRef();
  watch(values, () => {
    mergedValues.value = toRaw(values.value);
  }, {
    immediate: true
  });
  const newFilledValues = computed(() => {
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
      return _extends(_extends({}, item), {
        label: mergedLabel
      });
    });
    cacheRef.value.valueLabels = valueLabelsCache;
    return filledValues;
  });
  return [newFilledValues];
});