import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { onBeforeUnmount, watch, onActivated, defineComponent, ref } from 'vue';
import Tooltip, { tooltipProps } from '../tooltip';
import raf from '../_util/raf';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'SliderTooltip',
  inheritAttrs: false,
  props: tooltipProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const innerRef = ref(null);
    const rafRef = ref(null);
    function cancelKeepAlign() {
      raf.cancel(rafRef.value);
      rafRef.value = null;
    }
    function keepAlign() {
      rafRef.value = raf(() => {
        var _a;
        (_a = innerRef.value) === null || _a === void 0 ? void 0 : _a.forcePopupAlign();
        rafRef.value = null;
      });
    }
    const align = () => {
      cancelKeepAlign();
      if (props.open) {
        keepAlign();
      }
    };
    watch([() => props.open, () => props.title], () => {
      align();
    }, {
      flush: 'post',
      immediate: true
    });
    onActivated(() => {
      align();
    });
    onBeforeUnmount(() => {
      cancelKeepAlign();
    });
    return () => {
      return _createVNode(Tooltip, _objectSpread(_objectSpread({
        "ref": innerRef
      }, props), attrs), slots);
    };
  }
});