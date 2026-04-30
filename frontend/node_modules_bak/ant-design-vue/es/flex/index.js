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
import { computed, defineComponent } from 'vue';
import { useConfigContextInject } from '../config-provider/context';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { isPresetSize } from '../_util/gapSize';
import omit from '../_util/omit';
import { withInstall } from '../_util/type';
import { flexProps } from './interface';
import createFlexClassNames from './utils';
const AFlex = defineComponent({
  name: 'AFlex',
  inheritAttrs: false,
  props: flexProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      flex: ctxFlex,
      direction: ctxDirection
    } = useConfigContextInject();
    const {
      prefixCls
    } = useConfigInject('flex', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedCls = computed(() => {
      var _a;
      return [prefixCls.value, hashId.value, createFlexClassNames(prefixCls.value, props), {
        [`${prefixCls.value}-rtl`]: ctxDirection.value === 'rtl',
        [`${prefixCls.value}-gap-${props.gap}`]: isPresetSize(props.gap),
        [`${prefixCls.value}-vertical`]: (_a = props.vertical) !== null && _a !== void 0 ? _a : ctxFlex === null || ctxFlex === void 0 ? void 0 : ctxFlex.value.vertical
      }];
    });
    return () => {
      var _a;
      const {
          flex,
          gap,
          component: Component = 'div'
        } = props,
        othersProps = __rest(props, ["flex", "gap", "component"]);
      const mergedStyle = {};
      if (flex) {
        mergedStyle.flex = flex;
      }
      if (gap && !isPresetSize(gap)) {
        mergedStyle.gap = `${gap}px`;
      }
      return wrapSSR(_createVNode(Component, _objectSpread({
        "class": [attrs.class, mergedCls.value],
        "style": [attrs.style, mergedStyle]
      }, omit(othersProps, ['justify', 'wrap', 'align', 'vertical'])), {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      }));
    };
  }
});
export default withInstall(AFlex);