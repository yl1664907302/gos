import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { tuple, booleanType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
export const timelineItemProps = () => ({
  prefixCls: String,
  color: String,
  dot: PropTypes.any,
  pending: booleanType(),
  position: PropTypes.oneOf(tuple('left', 'right', '')).def(''),
  label: PropTypes.any
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATimelineItem',
  props: initDefaultProps(timelineItemProps(), {
    color: 'blue',
    pending: false
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('timeline', props);
    const itemClassName = computed(() => ({
      [`${prefixCls.value}-item`]: true,
      [`${prefixCls.value}-item-pending`]: props.pending
    }));
    const customColor = computed(() => /blue|red|green|gray/.test(props.color || '') ? undefined : props.color || 'blue');
    const dotClassName = computed(() => ({
      [`${prefixCls.value}-item-head`]: true,
      [`${prefixCls.value}-item-head-${props.color || 'blue'}`]: !customColor.value
    }));
    return () => {
      var _a, _b, _c;
      const {
        label = (_a = slots.label) === null || _a === void 0 ? void 0 : _a.call(slots),
        dot = (_b = slots.dot) === null || _b === void 0 ? void 0 : _b.call(slots)
      } = props;
      return _createVNode("li", {
        "class": itemClassName.value
      }, [label && _createVNode("div", {
        "class": `${prefixCls.value}-item-label`
      }, [label]), _createVNode("div", {
        "class": `${prefixCls.value}-item-tail`
      }, null), _createVNode("div", {
        "class": [dotClassName.value, !!dot && `${prefixCls.value}-item-head-custom`],
        "style": {
          borderColor: customColor.value,
          color: customColor.value
        }
      }, [dot]), _createVNode("div", {
        "class": `${prefixCls.value}-item-content`
      }, [(_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots)])]);
    };
  }
});