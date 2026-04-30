import { computed, defineComponent, inject, provide } from 'vue';
const OverflowContextProviderKey = Symbol('OverflowContextProviderKey');
export const OverflowContextProvider = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'OverflowContextProvider',
  inheritAttrs: false,
  props: {
    value: {
      type: Object
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    provide(OverflowContextProviderKey, computed(() => props.value));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export const useInjectOverflowContext = () => {
  return inject(OverflowContextProviderKey, computed(() => null));
};