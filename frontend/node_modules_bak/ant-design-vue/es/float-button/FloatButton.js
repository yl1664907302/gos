import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from '../_util/classNames';
import { defineComponent, computed, ref } from 'vue';
import Tooltip from '../tooltip';
import Badge from '../badge';
import Content from './FloatButtonContent';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectFloatButtonGroupContext } from './context';
import warning from '../_util/warning';
import { initDefaultProps } from '../_util/props-util';
import { floatButtonProps } from './interface';
// import { useCompactItemContext } from '../space/Compact';
// CSSINJS
import useStyle from './style';
export const floatButtonPrefixCls = 'float-btn';
const FloatButton = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AFloatButton',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonProps(), {
    type: 'default',
    shape: 'circle'
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject(floatButtonPrefixCls, props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const {
      shape: groupShape
    } = useInjectFloatButtonGroupContext();
    const floatButtonRef = ref(null);
    const mergeShape = computed(() => {
      return (groupShape === null || groupShape === void 0 ? void 0 : groupShape.value) || props.shape;
    });
    return () => {
      var _a;
      const {
          prefixCls: customPrefixCls,
          type = 'default',
          shape = 'circle',
          description = (_a = slots.description) === null || _a === void 0 ? void 0 : _a.call(slots),
          tooltip,
          badge = {}
        } = props,
        restProps = __rest(props, ["prefixCls", "type", "shape", "description", "tooltip", "badge"]);
      const classString = classNames(prefixCls.value, `${prefixCls.value}-${type}`, `${prefixCls.value}-${mergeShape.value}`, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      const buttonNode = _createVNode(Tooltip, {
        "placement": "left"
      }, {
        title: slots.tooltip || tooltip ? () => slots.tooltip && slots.tooltip() || tooltip : undefined,
        default: () => _createVNode(Badge, badge, {
          default: () => [_createVNode("div", {
            "class": `${prefixCls.value}-body`
          }, [_createVNode(Content, {
            "prefixCls": prefixCls.value
          }, {
            icon: slots.icon,
            description: () => description
          })])]
        })
      });
      if (process.env.NODE_ENV !== 'production') {
        warning(!(shape === 'circle' && description), 'FloatButton', 'supported only when `shape` is `square`. Due to narrow space for text, short sentence is recommended.');
      }
      return wrapSSR(props.href ? _createVNode("a", _objectSpread(_objectSpread(_objectSpread({
        "ref": floatButtonRef
      }, attrs), restProps), {}, {
        "class": classString
      }), [buttonNode]) : _createVNode("button", _objectSpread(_objectSpread(_objectSpread({
        "ref": floatButtonRef
      }, attrs), restProps), {}, {
        "class": classString,
        "type": "button"
      }), [buttonNode]));
    };
  }
});
export default FloatButton;