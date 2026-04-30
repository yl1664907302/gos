"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _useRefs = _interopRequireDefault(require("../../_util/hooks/useRefs"));
var _initDefaultProps = _interopRequireDefault(require("../../_util/props-util/initDefaultProps"));
var _common = require("./common");
var _types = require("./types");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ProgressLine',
  props: (0, _initDefaultProps.default)(_types.propTypes, _common.defaultProps),
  setup(props) {
    const percentList = (0, _vue.computed)(() => {
      const {
        percent
      } = props;
      return Array.isArray(percent) ? percent : [percent];
    });
    const percentListProps = (0, _vue.computed)(() => {
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
    const strokeColorList = (0, _vue.computed)(() => {
      const {
        strokeColor
      } = props;
      return Array.isArray(strokeColor) ? strokeColor : [strokeColor];
    });
    const [setRef, paths] = (0, _useRefs.default)();
    (0, _common.useTransitionDuration)(paths);
    const center = (0, _vue.computed)(() => props.strokeWidth / 2);
    const right = (0, _vue.computed)(() => 100 - props.strokeWidth / 2);
    const pathString = (0, _vue.computed)(() => `M ${props.strokeLinecap === 'round' ? center.value : 0},${center.value}
    L ${props.strokeLinecap === 'round' ? right.value : 100},${center.value}`);
    const viewBoxString = (0, _vue.computed)(() => `0 0 100 ${props.strokeWidth}`);
    const pathFirst = (0, _vue.computed)(() => ({
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
      return (0, _vue.createVNode)("svg", (0, _objectSpread2.default)({
        "class": `${prefixCls}-line`,
        "viewBox": viewBoxString.value,
        "preserveAspectRatio": "none"
      }, restProps), [(0, _vue.createVNode)("path", pathFirst.value, null), percentListProps.value.map((pathProps, index) => {
        return (0, _vue.createVNode)("path", (0, _objectSpread2.default)({
          "ref": setRef(index)
        }, pathProps), null);
      })]);
    };
  }
});