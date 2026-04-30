"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useMenuContext = require("./hooks/useMenuContext");
var _SubMenuList = _interopRequireDefault(require("./SubMenuList"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'InlineSubMenuList',
  inheritAttrs: false,
  props: {
    id: String,
    open: Boolean,
    keyPath: Array
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const fixedMode = (0, _vue.computed)(() => 'inline');
    const {
      motion,
      mode,
      defaultMotions
    } = (0, _useMenuContext.useInjectMenu)();
    const sameModeRef = (0, _vue.computed)(() => mode.value === fixedMode.value);
    const destroy = (0, _vue.ref)(!sameModeRef.value);
    const mergedOpen = (0, _vue.computed)(() => sameModeRef.value ? props.open : false);
    // ================================= Effect =================================
    // Reset destroy state when mode change back
    (0, _vue.watch)(mode, () => {
      if (sameModeRef.value) {
        destroy.value = false;
      }
    }, {
      flush: 'post'
    });
    const mergedMotion = (0, _vue.computed)(() => {
      var _a, _b;
      const m = motion.value || ((_a = defaultMotions.value) === null || _a === void 0 ? void 0 : _a[fixedMode.value]) || ((_b = defaultMotions.value) === null || _b === void 0 ? void 0 : _b.other);
      const res = typeof m === 'function' ? m() : m;
      return (0, _extends2.default)((0, _extends2.default)({}, res), {
        appear: props.keyPath.length <= 1
      });
    });
    return () => {
      var _a;
      if (destroy.value) {
        return null;
      }
      return (0, _vue.createVNode)(_useMenuContext.MenuContextProvider, {
        "mode": fixedMode.value
      }, {
        default: () => [(0, _vue.createVNode)(_vue.Transition, mergedMotion.value, {
          default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)(_SubMenuList.default, {
            "id": props.id
          }, {
            default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
          }), [[_vue.vShow, mergedOpen.value]])]
        })]
      });
    };
  }
});