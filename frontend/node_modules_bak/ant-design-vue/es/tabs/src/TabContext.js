import { provide, inject, defineComponent, toRefs, ref } from 'vue';
const TabsContextKey = Symbol('tabsContextKey');
export const useProvideTabs = props => {
  provide(TabsContextKey, props);
};
export const useInjectTabs = () => {
  return inject(TabsContextKey, {
    tabs: ref([]),
    prefixCls: ref()
  });
};
const TabsContextProvider = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'TabsContextProvider',
  inheritAttrs: false,
  props: {
    tabs: {
      type: Object,
      default: undefined
    },
    prefixCls: {
      type: String,
      default: undefined
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useProvideTabs(toRefs(props));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export default TabsContextProvider;