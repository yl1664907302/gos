import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import PropTypes from '../../_util/vue-types';
const tooltipContentProps = {
  prefixCls: String,
  id: String,
  overlayInnerStyle: PropTypes.any
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'TooltipContent',
  props: tooltipContentProps,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return _createVNode("div", {
        "class": `${props.prefixCls}-inner`,
        "id": props.id,
        "role": "tooltip",
        "style": props.overlayInnerStyle
      }, [(_a = slots.overlay) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});