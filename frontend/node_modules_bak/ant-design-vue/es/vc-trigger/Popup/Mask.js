import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { withDirectives as _withDirectives, createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { Transition } from 'vue';
import { getMotion } from '../utils/motionUtil';
export default function Mask(props) {
  const {
    prefixCls,
    visible,
    zIndex,
    mask,
    maskAnimation,
    maskTransitionName
  } = props;
  if (!mask) {
    return null;
  }
  let motion = {};
  if (maskTransitionName || maskAnimation) {
    motion = getMotion({
      prefixCls,
      transitionName: maskTransitionName,
      animation: maskAnimation
    });
  }
  return _createVNode(Transition, _objectSpread({
    "appear": true
  }, motion), {
    default: () => [_withDirectives(_createVNode("div", {
      "style": {
        zIndex
      },
      "class": `${prefixCls}-mask`
    }, null), [[_resolveDirective("if"), visible]])]
  });
}
Mask.displayName = 'Mask';