import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import { someType } from '../_util/type';
import { progressProps } from './props';
import { getSize } from './utils';
export const stepsProps = () => _extends(_extends({}, progressProps()), {
  steps: Number,
  strokeColor: someType(),
  trailColor: String
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Steps',
  props: stepsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const current = computed(() => Math.round(props.steps * ((props.percent || 0) / 100)));
    const mergedSize = computed(() => {
      var _a;
      return (_a = props.size) !== null && _a !== void 0 ? _a : [props.size === 'small' ? 2 : 14, props.strokeWidth || 8];
    });
    const sizeRef = computed(() => getSize(mergedSize.value, 'step', {
      steps: props.steps,
      strokeWidth: props.strokeWidth || 8
    }));
    const styledSteps = computed(() => {
      const {
        steps,
        strokeColor,
        trailColor,
        prefixCls
      } = props;
      const temp = [];
      for (let i = 0; i < steps; i += 1) {
        const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;
        const cls = {
          [`${prefixCls}-steps-item`]: true,
          [`${prefixCls}-steps-item-active`]: i <= current.value - 1
        };
        temp.push(_createVNode("div", {
          "key": i,
          "class": cls,
          "style": {
            backgroundColor: i <= current.value - 1 ? color : trailColor,
            width: `${sizeRef.value.width / steps}px`,
            height: `${sizeRef.value.height}px`
          }
        }, null));
      }
      return temp;
    });
    return () => {
      var _a;
      return _createVNode("div", {
        "class": `${props.prefixCls}-steps-outer`
      }, [styledSteps.value, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});