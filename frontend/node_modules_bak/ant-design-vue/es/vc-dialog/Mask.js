import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { withDirectives as _withDirectives, createVNode as _createVNode, vShow as _vShow } from "vue";
import { defineComponent, Transition } from 'vue';
import { getTransitionProps } from '../_util/transition';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'DialogMask',
  props: {
    prefixCls: String,
    visible: Boolean,
    motionName: String,
    maskProps: Object
  },
  setup(props, _ref) {
    let {} = _ref;
    return () => {
      const {
        prefixCls,
        visible,
        maskProps,
        motionName
      } = props;
      const transitionProps = getTransitionProps(motionName);
      return _createVNode(Transition, transitionProps, {
        default: () => [_withDirectives(_createVNode("div", _objectSpread({
          "class": `${prefixCls}-mask`
        }, maskProps), null), [[_vShow, visible]])]
      });
    };
  }
});