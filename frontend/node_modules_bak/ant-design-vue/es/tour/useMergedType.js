import { ref, computed, watch } from 'vue';
/**
 * returns the merged type of a step or the default type.
 */
const useMergedType = _ref => {
  let {
    defaultType,
    steps,
    current,
    defaultCurrent
  } = _ref;
  const innerCurrent = ref(defaultCurrent === null || defaultCurrent === void 0 ? void 0 : defaultCurrent.value);
  const mergedCurrent = computed(() => current === null || current === void 0 ? void 0 : current.value);
  watch(mergedCurrent, val => {
    innerCurrent.value = val !== null && val !== void 0 ? val : defaultCurrent === null || defaultCurrent === void 0 ? void 0 : defaultCurrent.value;
  }, {
    immediate: true
  });
  const updateInnerCurrent = val => {
    innerCurrent.value = val;
  };
  const innerType = computed(() => {
    var _a, _b;
    return typeof innerCurrent.value === 'number' ? steps && ((_b = (_a = steps.value) === null || _a === void 0 ? void 0 : _a[innerCurrent.value]) === null || _b === void 0 ? void 0 : _b.type) : defaultType === null || defaultType === void 0 ? void 0 : defaultType.value;
  });
  const currentMergedType = computed(() => {
    var _a;
    return (_a = innerType.value) !== null && _a !== void 0 ? _a : defaultType === null || defaultType === void 0 ? void 0 : defaultType.value;
  });
  return {
    currentMergedType,
    updateInnerCurrent
  };
};
export default useMergedType;