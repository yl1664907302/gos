import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
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
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
export const breadcrumbSeparatorProps = () => ({
  prefixCls: String
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ABreadcrumbSeparator',
  __ANT_BREADCRUMB_SEPARATOR: true,
  inheritAttrs: false,
  props: breadcrumbSeparatorProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('breadcrumb', props);
    return () => {
      var _a;
      const {
          separator,
          class: className
        } = attrs,
        restAttrs = __rest(attrs, ["separator", "class"]);
      const children = flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      return _createVNode("span", _objectSpread({
        "class": [`${prefixCls.value}-separator`, className]
      }, restAttrs), [children.length > 0 ? children : '/']);
    };
  }
});