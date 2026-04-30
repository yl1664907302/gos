import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import { Circle as VCCircle } from '../vc-progress';
import { getPercentage, getSize, getStrokeColor } from './utils';
import { progressProps } from './props';
import { initDefaultProps } from '../_util/props-util';
import Tooltip from '../tooltip';
import { anyType } from '../_util/type';
export const circleProps = () => _extends(_extends({}, progressProps()), {
  strokeColor: anyType()
});
const CIRCLE_MIN_STROKE_WIDTH = 3;
const getMinPercent = width => CIRCLE_MIN_STROKE_WIDTH / width * 100;
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ProgressCircle',
  inheritAttrs: false,
  props: initDefaultProps(circleProps(), {
    trailColor: null
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const originWidth = computed(() => {
      var _a;
      return (_a = props.width) !== null && _a !== void 0 ? _a : 120;
    });
    const mergedSize = computed(() => {
      var _a;
      return (_a = props.size) !== null && _a !== void 0 ? _a : [originWidth.value, originWidth.value];
    });
    const sizeRef = computed(() => getSize(mergedSize.value, 'circle'));
    const gapDeg = computed(() => {
      // Support gapDeg = 0 when type = 'dashboard'
      if (props.gapDegree || props.gapDegree === 0) {
        return props.gapDegree;
      }
      if (props.type === 'dashboard') {
        return 75;
      }
      return undefined;
    });
    const circleStyle = computed(() => {
      return {
        width: `${sizeRef.value.width}px`,
        height: `${sizeRef.value.height}px`,
        fontSize: `${sizeRef.value.width * 0.15 + 6}px`
      };
    });
    const circleWidth = computed(() => {
      var _a;
      return (_a = props.strokeWidth) !== null && _a !== void 0 ? _a : Math.max(getMinPercent(sizeRef.value.width), 6);
    });
    const gapPos = computed(() => props.gapPosition || props.type === 'dashboard' && 'bottom' || undefined);
    // using className to style stroke color
    const percent = computed(() => getPercentage(props));
    const isGradient = computed(() => Object.prototype.toString.call(props.strokeColor) === '[object Object]');
    const strokeColor = computed(() => getStrokeColor({
      success: props.success,
      strokeColor: props.strokeColor
    }));
    const wrapperClassName = computed(() => ({
      [`${props.prefixCls}-inner`]: true,
      [`${props.prefixCls}-circle-gradient`]: isGradient.value
    }));
    return () => {
      var _a;
      const circleContent = _createVNode(VCCircle, {
        "percent": percent.value,
        "strokeWidth": circleWidth.value,
        "trailWidth": circleWidth.value,
        "strokeColor": strokeColor.value,
        "strokeLinecap": props.strokeLinecap,
        "trailColor": props.trailColor,
        "prefixCls": props.prefixCls,
        "gapDegree": gapDeg.value,
        "gapPosition": gapPos.value
      }, null);
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [wrapperClassName.value, attrs.class],
        "style": [attrs.style, circleStyle.value]
      }), [sizeRef.value.width <= 20 ? _createVNode(Tooltip, null, {
        default: () => [_createVNode("span", null, [circleContent])],
        title: slots.default
      }) : _createVNode(_Fragment, null, [circleContent, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
    };
  }
});