import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import classNames from '../_util/classNames';
import { inject, defineComponent, shallowRef, watch, onMounted, onBeforeUnmount, provide } from 'vue';
import PropTypes from '../_util/vue-types';
import { tuple } from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import isNumeric from '../_util/isNumeric';
import BarsOutlined from "@ant-design/icons-vue/es/icons/BarsOutlined";
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import LeftOutlined from "@ant-design/icons-vue/es/icons/LeftOutlined";
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { SiderCollapsedKey, SiderHookProviderKey } from './injectionKey';
const dimensionMaxMap = {
  xs: '479.98px',
  sm: '575.98px',
  md: '767.98px',
  lg: '991.98px',
  xl: '1199.98px',
  xxl: '1599.98px',
  xxxl: '1999.98px'
};
export const siderProps = () => ({
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
  trigger: PropTypes.any,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  collapsedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  breakpoint: PropTypes.oneOf(tuple('xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl')),
  theme: PropTypes.oneOf(tuple('light', 'dark')).def('dark'),
  onBreakpoint: Function,
  onCollapse: Function
});
const generateId = (() => {
  let i = 0;
  return function () {
    let prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    i += 1;
    return `${prefix}${i}`;
  };
})();
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ALayoutSider',
  inheritAttrs: false,
  props: initDefaultProps(siderProps(), {
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
    } = useConfigInject('layout-sider', props);
    const siderHook = inject(SiderHookProviderKey, undefined);
    const collapsed = shallowRef(!!(props.collapsed !== undefined ? props.collapsed : props.defaultCollapsed));
    const below = shallowRef(false);
    watch(() => props.collapsed, () => {
      collapsed.value = !!props.collapsed;
    });
    provide(SiderCollapsedKey, collapsed);
    const handleSetCollapsed = (value, type) => {
      if (props.collapsed === undefined) {
        collapsed.value = value;
      }
      emit('update:collapsed', value);
      emit('collapse', value, type);
    };
    // ========================= Responsive =========================
    const responsiveHandlerRef = shallowRef(mql => {
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
    onMounted(() => {
      watch(() => props.breakpoint, () => {
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
    onBeforeUnmount(() => {
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
      const siderWidth = isNumeric(rawWidth) ? `${rawWidth}px` : String(rawWidth);
      // special trigger when collapsedWidth == 0
      const zeroWidthTrigger = parseFloat(String(collapsedWidth || 0)) === 0 ? _createVNode("span", {
        "onClick": toggle,
        "class": classNames(`${pre}-zero-width-trigger`, `${pre}-zero-width-trigger-${reverseArrow ? 'right' : 'left'}`),
        "style": zeroWidthTriggerStyle
      }, [trigger || _createVNode(BarsOutlined, null, null)]) : null;
      const iconObj = {
        expanded: reverseArrow ? _createVNode(RightOutlined, null, null) : _createVNode(LeftOutlined, null, null),
        collapsed: reverseArrow ? _createVNode(LeftOutlined, null, null) : _createVNode(RightOutlined, null, null)
      };
      const status = collapsed.value ? 'collapsed' : 'expanded';
      const defaultTrigger = iconObj[status];
      const triggerDom = trigger !== null ? zeroWidthTrigger || _createVNode("div", {
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
      const siderCls = classNames(pre, `${pre}-${theme}`, {
        [`${pre}-collapsed`]: !!collapsed.value,
        [`${pre}-has-trigger`]: collapsible && trigger !== null && !zeroWidthTrigger,
        [`${pre}-below`]: !!below.value,
        [`${pre}-zero-width`]: parseFloat(siderWidth) === 0
      }, attrs.class);
      return _createVNode("aside", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": siderCls,
        "style": divStyle
      }), [_createVNode("div", {
        "class": `${pre}-children`
      }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)]), collapsible || below.value && zeroWidthTrigger ? triggerDom : null]);
    };
  }
});