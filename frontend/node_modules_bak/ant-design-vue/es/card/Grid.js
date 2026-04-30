import { createVNode as _createVNode } from "vue";
import { defineComponent, computed } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
export const cardGridProps = () => ({
  prefixCls: String,
  hoverable: {
    type: Boolean,
    default: true
  }
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACardGrid',
  __ANT_CARD_GRID: true,
  props: cardGridProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('card', props);
    const classNames = computed(() => {
      return {
        [`${prefixCls.value}-grid`]: true,
        [`${prefixCls.value}-grid-hoverable`]: props.hoverable
      };
    });
    return () => {
      var _a;
      return _createVNode("div", {
        "class": classNames.value
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});