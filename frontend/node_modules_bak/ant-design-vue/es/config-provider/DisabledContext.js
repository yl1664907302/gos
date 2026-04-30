import { computed, inject, ref, provide } from 'vue';
const DisabledContextKey = Symbol('DisabledContextKey');
export const useInjectDisabled = () => {
  return inject(DisabledContextKey, ref(undefined));
};
export const useProviderDisabled = disabled => {
  const parentDisabled = useInjectDisabled();
  provide(DisabledContextKey, computed(() => {
    var _a;
    return (_a = disabled.value) !== null && _a !== void 0 ? _a : parentDisabled.value;
  }));
  return disabled;
};