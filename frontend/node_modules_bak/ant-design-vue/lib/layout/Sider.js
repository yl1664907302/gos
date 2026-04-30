"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siderProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _isNumeric = _interopRequireDefault(require("../_util/isNumeric"));
var _BarsOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/BarsOutlined"));
var _RightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RightOutlined"));
var _LeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LeftOutlined"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _injectionKey = require("./injectionKey");
const dimensionMaxMap = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px',
  xxxl: '1999.98px'
};
const siderProps = () => ({
  prefixCls: String,
  collapsible: {
    type: Boolean,
    default: undefined
  },
  collapsed: {
    type: Boolean,
    default: undefined
  },
  defaultCollapsed: {
    type: Boolean,
    default: undefined
  },
  reverseArrow: {
    type: Boolean,
    default: undefined
  },
  zeroWidthTriggerStyle: {
    type: Object,
    default: undefined
  },
  trigger: _vueTypes.default.any,
  width: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
  collapsedWidth: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
  breakpoint: _vueTypes.default.oneOf((0, _type.tuple)('xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl')),
  theme: _vueTypes.default.oneOf((0, _type.tuple)('light', 'dark')).def('dark'),
  onBreakpoint: Function,
  onCollapse: Function
});
exports.siderProps = siderProps;
const generateId = (() => {
  let i = 0;
  return function () {
    let prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    i += 1;
    return `${prefix}${i}`;
  };
})();
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ALayoutSider',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(siderProps(), {
    collapsible: false,
    defaultCollapsed: false,
    reverseArrow: false,
    width: 200,
    collapsedWidth: 80
  }),
  emits: ['breakpoint', 'update:collapsed', 'collapse'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('layout-sider', props);
    const siderHook = (0, _vue.inject)(_injectionKey.SiderHookProviderKey, undefined);
    const collapsed = (0, _vue.shallowRef)(!!(props.collapsed !== undefined ? props.collapsed : props.defaultCollapsed));
    const below = (0, _vue.shallowRef)(false);
    (0, _vue.watch)(() => props.collapsed, () => {
      collapsed.value = !!props.collapsed;
    });
    (0, _vue.provide)(_injectionKey.SiderCollapsedKey, collapsed);
    const handleSetCollapsed = (value, type) => {
      if (props.collapsed === undefined) {
        collapsed.value = value;
      }
      emit('update:collapsed', value);
      emit('collapse', value, type);
    };
    // ========================= Responsive =========================
    const responsiveHandlerRef = (0, _vue.shallowRef)(mql => {
      below.value = mql.matches;
      emit('breakpoint', mql.matches);
      if (collapsed.value !== mql.matches) {
        handleSetCollapsed(mql.matches, 'responsive');
      }
    });
    let mql;
    function responsiveHandler(mql) {
      return responsiveHandlerRef.value(mql);
    }
    const uniqueId = generateId('ant-sider-');
    siderHook && siderHook.addSider(uniqueId);
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(() => props.breakpoint, () => {
        try {
          mql === null || mql === void 0 ? void 0 : mql.removeEventListener('change', responsiveHandler);
        } catch (error) {
          mql === null || mql === void 0 ? void 0 : mql.removeListener(responsiveHandler);
        }
        if (typeof window !== 'undefined') {
          const {
            matchMedia
          } = window;
          if (matchMedia && props.breakpoint && props.breakpoint in dimensionMaxMap) {
            mql = matchMedia(`(max-width: ${dimensionMaxMap[props.breakpoint]})`);
            try {
              mql.addEventListener('change', responsiveHandler);
            } catch (error) {
              mql.addListener(responsiveHandler);
            }
            responsiveHandler(mql);
          }
        }
      }, {
        immediate: true
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      try {
        mql === null || mql === void 0 ? void 0 : mql.removeEventListener('change', responsiveHandler);
      } catch (error) {
        mql === null || mql === void 0 ? void 0 : mql.removeListener(responsiveHandler);
      }
      siderHook && siderHook.removeSider(uniqueId);
    });
    const toggle = () => {
      handleSetCollapsed(!collapsed.value, 'clickTrigger');
    };
    return () => {
      var _a, _b;
      const pre = prefixCls.value;
      const {
        collapsedWidth,
        width,
        reverseArrow,
        zeroWidthTriggerStyle,
        trigger = (_a = slots.trigger) === null || _a === void 0 ? void 0 : _a.call(slots),
        collapsible,
        theme
      } = props;
      const rawWidth = collapsed.value ? collapsedWidth : width;
      // use "px" as fallback unit for width
      const siderWidth = (0, _isNumeric.default)(rawWidth) ? `${rawWidth}px` : String(rawWidth);
      // special trigger when collapsedWidth == 0
      const zeroWidthTrigger = parseFloat(String(collapsedWidth || 0)) === 0 ? (0, _vue.createVNode)("span", {
        "onClick": toggle,
        "class": (0, _classNames.default)(`${pre}-zero-width-trigger`, `${pre}-zero-width-trigger-${reverseArrow ? 'right' : 'left'}`),
        "style": zeroWidthTriggerStyle
      }, [trigger || (0, _vue.createVNode)(_BarsOutlined.default, null, null)]) : null;
      const iconObj = {
        expanded: reverseArrow ? (0, _vue.createVNode)(_RightOutlined.default, null, null) : (0, _vue.createVNode)(_LeftOutlined.default, null, null),
        collapsed: reverseArrow ? (0, _vue.createVNode)(_LeftOutlined.default, null, null) : (0, _vue.createVNode)(_RightOutlined.default, null, null)
      };
      const status = collapsed.value ? 'collapsed' : 'expanded';
      const defaultTrigger = iconObj[status];
      const triggerDom = trigger !== null ? zeroWidthTrigger || (0, _vue.createVNode)("div", {
        "class": `${pre}-trigger`,
        "onClick": toggle,
        "style": {
          width: siderWidth
        }
      }, [trigger || defaultTrigger]) : null;
      const divStyle = [attrs.style, {
        flex: `0 0 ${siderWidth}`,
        maxWidth: siderWidth,
        minWidth: siderWidth,
        width: siderWidth
      }];
      const siderCls = (0, _classNames.default)(pre, `${pre}-${theme}`, {
        [`${pre}-collapsed`]: !!collapsed.value,
        [`${pre}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
        [`${pre}-below`]: !!below.value,
        [`${pre}-zero-width`]: parseFloat(siderWidth) === 0
      }, attrs.class);
      return (0, _vue.createVNode)("aside", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": siderCls,
        "style": divStyle
      }), [(0, _vue.createVNode)("div", {
        "class": `${pre}-children`
      }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)]), collapsible || below.value && zeroWidthTrigger ? triggerDom : null]);
    };
  }
});