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
import useRefs from '../../_util/hooks/useRefs';
import { computed, defineComponent } from 'vue';
import initDefaultProps from '../../_util/props-util/initDefaultProps';
import { useTransitionDuration, defaultProps } from './common';
import { propTypes } from './types';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ProgressLine',
  props: initDefaultProps(propTypes, defaultProps),
  setup(props) {
    const percentList = computed(() => {
      const {
        percent
      } = props;
      return Array.isArray(percent) ? percent : [percent];
    });
    const percentListProps = computed(() => {
      const {
        prefixCls,
        strokeLinecap,
        strokeWidth,
        transition
      } = props;
      let stackPtg = 0;
      return percentList.value.map((ptg, index) => {
        let dashPercent = 1;
        switch (strokeLinecap) {
          case 'round':
            dashPercent = 1 - strokeWidth / 100;
            break;
          case 'square':
            dashPercent = 1 - strokeWidth / 2 / 100;
            break;
          default:
            dashPercent = 1;
            break;
        }
        const pathStyle = {
          strokeDasharray: `${ptg * dashPercent}px, 100px`,
          strokeDashoffset: `-${stackPtg}px`,
          transition: transition || 'stroke-dashoffset 0.3s ease 0s, stroke-dasharray .3s ease 0s, stroke 0.3s linear'
        };
        const color = strokeColorList.value[index] || strokeColorList.value[strokeColorList.value.length - 1];
        stackPtg += ptg;
        const pathProps = {
          key: index,
          d: pathString.value,
          'stroke-linecap': strokeLinecap,
          stroke: color,
          'stroke-width': strokeWidth,
          'fill-opacity': '0',
          class: `${prefixCls}-line-path`,
          style: pathStyle
        };
        return pathProps;
      });
    });
    const strokeColorList = computed(() => {
      const {
        strokeColor
      } = props;
      return Array.isArray(strokeColor) ? strokeColor : [strokeColor];
    });
    const [setRef, paths] = useRefs();
    useTransitionDuration(paths);
    const center = computed(() => props.strokeWidth / 2);
    const right = computed(() => 100 - props.strokeWidth / 2);
    const pathString = computed(() => `M ${props.strokeLinecap === 'round' ? center.value : 0},${center.value}
    L ${props.strokeLinecap === 'round' ? right.value : 100},${center.value}`);
    const viewBoxString = computed(() => `0 0 100 ${props.strokeWidth}`);
    const pathFirst = computed(() => ({
      d: pathString.value,
      'stroke-linecap': props.strokeLinecap,
      stroke: props.trailColor,
      'stroke-width': props.trailWidth || props.strokeWidth,
      'fill-opacity': '0',
      class: `${props.prefixCls}-line-trail`
    }));
    return () => {
      const {
          percent,
          prefixCls,
          strokeColor,
          strokeLinecap,
          strokeWidth,
          trailColor,
          trailWidth,
          transition
        } = props,
        restProps = __rest(props, ["percent", "prefixCls", "strokeColor", "strokeLinecap", "strokeWidth", "trailColor", "trailWidth", "transition"]);
      delete restProps.gapPosition;
      return _createVNode("svg", _objectSpread({
        "class": `${prefixCls}-line`,
        "viewBox": viewBoxString.value,
        "preserveAspectRatio": "none"
      }, restProps), [_createVNode("path", pathFirst.value, null), percentListProps.value.map((pathProps, index) => {
        return _createVNode("path", _objectSpread({
          "ref": setRef(index)
        }, pathProps), null);
      })]);
    };
  }
});