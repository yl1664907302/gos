"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideMenu = exports.useProvideForceRender = exports.useProvideFirstLevel = exports.useInjectMenu = exports.useInjectForceRender = exports.useInjectFirstLevel = exports.default = exports.MenuFirstLevelContextKey = exports.MenuContextProvider = exports.MenuContextKey = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
const MenuContextKey = exports.MenuContextKey = Symbol('menuContextKey');
const useProvideMenu = props => {
  (0, _vue.provide)(MenuContextKey, props);
};
exports.useProvideMenu = useProvideMenu;
const useInjectMenu = () => {
  return (0, _vue.inject)(MenuContextKey);
};
exports.useInjectMenu = useInjectMenu;
const ForceRenderKey = Symbol('ForceRenderKey');
const useProvideForceRender = forceRender => {
  (0, _vue.provide)(ForceRenderKey, forceRender);
};
exports.useProvideForceRender = useProvideForceRender;
const useInjectForceRender = () => {
  return (0, _vue.inject)(ForceRenderKey, false);
};
exports.useInjectForceRender = useInjectForceRender;
const MenuFirstLevelContextKey = exports.MenuFirstLevelContextKey = Symbol('menuFirstLevelContextKey');
const useProvideFirstLevel = firstLevel => {
  (0, _vue.provide)(MenuFirstLevelContextKey, firstLevel);
};
exports.useProvideFirstLevel = useProvideFirstLevel;
const useInjectFirstLevel = () => {
  return (0, _vue.inject)(MenuFirstLevelContextKey, true);
};
exports.useInjectFirstLevel = useInjectFirstLevel;
const MenuContextProvider = exports.MenuContextProvider = (0, _vue.defineComponent)({
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
    const newContext = (0, _extends2.default)({}, menuContext);
    // 确保传入的属性不会动态增删
    // 不需要 watch 变化
    if (props.mode !== undefined) {
      newContext.mode = (0, _vue.toRef)(props, 'mode');
    }
    if (props.overflowDisabled !== undefined) {
      newContext.overflowDisabled = (0, _vue.toRef)(props, 'overflowDisabled');
    }
    useProvideMenu(newContext);
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
var _default = exports.default = useProvideMenu;