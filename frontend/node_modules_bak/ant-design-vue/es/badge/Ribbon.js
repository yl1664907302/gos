import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import useStyle from './style';
import { isPresetColor } from '../_util/colors';
import { defineComponent, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
export const ribbonProps = () => ({
  prefix: String,
  color: {
    type: String
  },
  text: PropTypes.any,
  placement: {
    type: String,
    default: 'end'
  }
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ABadgeRibbon',
  inheritAttrs: false,
  props: ribbonProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject('ribbon', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const colorInPreset = computed(() => isPresetColor(props.color, false));
    const ribbonCls = computed(() => [prefixCls.value, `${prefixCls.value}-placement-${props.placement}`, {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-color-${props.color}`]: colorInPreset.value
    }]);
    return () => {
      var _a, _b;
      const {
          class: className,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["class", "style"]);
      const colorStyle = {};
      const cornerColorStyle = {};
      if (props.color && !colorInPreset.value) {
        colorStyle.background = props.color;
        cornerColorStyle.color = props.color;
      }
      return wrapSSR(_createVNode("div", _objectSpread({
        "class": `${prefixCls.value}-wrapper ${hashId.value}`
      }, restAttrs), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots), _createVNode("div", {
        "class": [ribbonCls.value, className, hashId.value],
        "style": _extends(_extends({}, colorStyle), style)
      }, [_createVNode("span", {
        "class": `${prefixCls.value}-text`
      }, [props.text || ((_b = slots.text) === null || _b === void 0 ? void 0 : _b.call(slots))]), _createVNode("div", {
        "class": `${prefixCls.value}-corner`,
        "style": cornerColorStyle
      }, null)])]));
    };
  }
});