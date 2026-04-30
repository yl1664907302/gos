import { computed, inject, provide, defineComponent } from 'vue';
export const OVERFLOW_KEY = '$$__vc-menu-more__key';
const KeyPathContext = Symbol('KeyPathContext');
const useInjectKeyPath = () => {
  return inject(KeyPathContext, {
    parentEventKeys: computed(() => []),
    parentKeys: computed(() => []),
    parentInfo: {}
  });
};
const useProvideKeyPath = (eventKey, key, menuInfo) => {
  const {
    parentEventKeys,
    parentKeys
  } = useInjectKeyPath();
  const eventKeys = computed(() => [...parentEventKeys.value, eventKey]);
  const keys = computed(() => [...parentKeys.value, key]);
  provide(KeyPathContext, {
    parentEventKeys: eventKeys,
    parentKeys: keys,
    parentInfo: menuInfo
  });
  return keys;
};
const measure = Symbol('measure');
export const PathContext = defineComponent({
  compatConfig: {
    MODE: 3
  },
  setup(_props, _ref) {
    let {
      slots
    } = _ref;
    // 不需要响应式
    provide(measure, true);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export const useMeasure = () => {
  return inject(measure, false);
};
export { useProvideKeyPath, useInjectKeyPath, KeyPathContext };
export default useProvideKeyPath;