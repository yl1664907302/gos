"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideTabs = exports.useInjectTabs = exports.default = void 0;
var _vue = require("vue");
const TabsContextKey = Symbol('tabsContextKey');
const useProvideTabs = props => {
  (0, _vue.provide)(TabsContextKey, props);
};
exports.useProvideTabs = useProvideTabs;
const useInjectTabs = () => {
  return (0, _vue.inject)(TabsContextKey, {
    tabs: (0, _vue.ref)([]),
    prefixCls: (0, _vue.ref)()
  });
};
exports.useInjectTabs = useInjectTabs;
const TabsContextProvider = (0, _vue.defineComponent)({
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
    useProvideTabs((0, _vue.toRefs)(props));
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
var _default = exports.default = TabsContextProvider;