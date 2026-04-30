import _extends from "@babel/runtime/helpers/esm/extends";
import { defineComponent, inject, provide, toRef } from 'vue';
const MenuContextKey = Symbol('menuContextKey');
const useProvideMenu = props => {
  provide(MenuContextKey, props);
};
const useInjectMenu = () => {
  return inject(MenuContextKey);
};
const ForceRenderKey = Symbol('ForceRenderKey');
export const useProvideForceRender = forceRender => {
  provide(ForceRenderKey, forceRender);
};
export const useInjectForceRender = () => {
  return inject(ForceRenderKey, false);
};
const MenuFirstLevelContextKey = Symbol('menuFirstLevelContextKey');
const useProvideFirstLevel = firstLevel => {
  provide(MenuFirstLevelContextKey, firstLevel);
};
const useInjectFirstLevel = () => {
  return inject(MenuFirstLevelContextKey, true);
};
const MenuContextProvider = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'MenuContextProvider',
  inheritAttrs: false,
  props: {
    mode: {
      type: String,
      default: undefined
    },
    overflowDisabled: {
      type: Boolean,
      default: undefined
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const menuContext = useInjectMenu();
    const newContext = _extends({}, menuContext);
    // 确保传入的属性不会动态增删
    // 不需要 watch 变化
    if (props.mode !== undefined) {
      newContext.mode = toRef(props, 'mode');
    }
    if (props.overflowDisabled !== undefined) {
      newContext.overflowDisabled = toRef(props, 'overflowDisabled');
    }
    useProvideMenu(newContext);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export { useProvideMenu, MenuContextKey, useInjectMenu, MenuFirstLevelContextKey, useProvideFirstLevel, useInjectFirstLevel, MenuContextProvider };
export default useProvideMenu;