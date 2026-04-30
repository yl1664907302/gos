import { defineComponent, inject, provide, ref, toRef, watch } from 'vue';
const RangeContextKey = Symbol('RangeContextProps');
export const useProvideRange = props => {
  provide(RangeContextKey, props);
};
export const useInjectRange = () => {
  return inject(RangeContextKey, {
    rangedValue: ref(),
    hoverRangedValue: ref(),
    inRange: ref(),
    panelPosition: ref()
  });
};
export const RangeContextProvider = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'PanelContextProvider',
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const value = {
      rangedValue: ref(props.value.rangedValue),
      hoverRangedValue: ref(props.value.hoverRangedValue),
      inRange: ref(props.value.inRange),
      panelPosition: ref(props.value.panelPosition)
    };
    useProvideRange(value);
    toRef;
    watch(() => props.value, () => {
      Object.keys(props.value).forEach(key => {
        if (value[key]) {
          value[key].value = props.value[key];
        }
      });
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export default RangeContextKey;