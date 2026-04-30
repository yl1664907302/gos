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
import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
// CSSINJS
import useStyle from './style';
export const typographyProps = () => ({
  prefixCls: String,
  direction: String,
  // Form Internal use
  component: String
});
const Typography = defineComponent({
  name: 'ATypography',
  inheritAttrs: false,
  props: typographyProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject('typography', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      var _a;
      const _b = _extends(_extends({}, props), attrs),
        {
          prefixCls: _prefixCls,
          direction: _direction,
          component: Component = 'article'
        } = _b,
        restProps = __rest(_b, ["prefixCls", "direction", "component"]);
      return wrapSSR(_createVNode(Component, _objectSpread(_objectSpread({}, restProps), {}, {
        "class": classNames(prefixCls.value, {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value)
      }), {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      }));
    };
  }
});
export default Typography;