import _extends from "@babel/runtime/helpers/esm/extends";
import { shallowRef, computed } from 'vue';
/**
 * Cache `value` related LabeledValue & options.
 */
export default ((labeledValues, valueOptions) => {
  const cacheRef = shallowRef({
    values: new Map(),
    options: new Map()
  });
  const filledLabeledValues = computed(() => {
    const {
      values: prevValueCache,
      options: prevOptionCache
    } = cacheRef.value;
    // Fill label by cache
    const patchedValues = labeledValues.value.map(item => {
      var _a;
      if (item.label === undefined) {
        return _extends(_extends({}, item), {
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
});