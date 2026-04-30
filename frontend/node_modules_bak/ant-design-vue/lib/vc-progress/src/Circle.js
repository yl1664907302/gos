"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _common = require("./common");
var _types = require("./types");
var _initDefaultProps = _interopRequireDefault(require("../../_util/props-util/initDefaultProps"));
var _useRefs = _interopRequireDefault(require("../../_util/hooks/useRefs"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
let gradientSeed = 0;
function stripPercentToNumber(percent) {
  return +percent.replace('%', '');
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function getPathStyles(offset, percent, strokeColor, strokeWidth) {
  let gapDegree = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  let gapPosition = arguments.length > 5 ? arguments[5] : undefined;
  const radius = 50 - strokeWidth / 2;
  let beginPositionX = 0;
  let beginPositionY = -radius;
  let endPositionX = 0;
  let endPositionY = -2 * radius;
  switch (gapPosition) {
    case 'left':
      beginPositionX = -radius;
      beginPositionY = 0;
      endPositionX = 2 * radius;
      endPositionY = 0;
      break;
    case 'right':
      beginPositionX = radius;
      beginPositionY = 0;
      endPositionX = -2 * radius;
      endPositionY = 0;
      break;
    case 'bottom':
      beginPositionY = radius;
      endPositionY = 2 * radius;
      break;
    default:
  }
  const pathString = `M 50,50 m ${beginPositionX},${beginPositionY}
   a ${radius},${radius} 0 1 1 ${endPositionX},${-endPositionY}
   a ${radius},${radius} 0 1 1 ${-endPositionX},${endPositionY}`;
  const len = Math.PI * 2 * radius;
  const pathStyle = {
    stroke: strokeColor,
    strokeDasharray: `${percent / 100 * (len - gapDegree)}px ${len}px`,
    strokeDashoffset: `-${gapDegree / 2 + offset / 100 * (len - gapDegree)}px`,
    transition: 'stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s' // eslint-disable-line
  };
  return {
    pathString,
    pathStyle
  };
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'VCCircle',
  props: (0, _initDefaultProps.default)(_types.propTypes, _common.defaultProps),
  setup(props) {
    gradientSeed += 1;
    const gradientId = (0, _vue.ref)(gradientSeed);
    const percentList = (0, _vue.computed)(() => toArray(props.percent));
    const strokeColorList = (0, _vue.computed)(() => toArray(props.strokeColor));
    const [setRef, paths] = (0, _useRefs.default)();
    (0, _common.useTransitionDuration)(paths);
    const getStokeList = () => {
      const {
        prefixCls,
        strokeWidth,
        strokeLinecap,
        gapDegree,
        gapPosition
      } = props;
      let stackPtg = 0;
      return percentList.value.map((ptg, index) => {
        const color = strokeColorList.value[index] || strokeColorList.value[strokeColorList.value.length - 1];
        const stroke = Object.prototype.toString.call(color) === '[object Object]' ? `url(#${prefixCls}-gradient-${gradientId.value})` : '';
        const {
          pathString,
          pathStyle
        } = getPathStyles(stackPtg, ptg, color, strokeWidth, gapDegree, gapPosition);
        stackPtg += ptg;
        const pathProps = {
          key: index,
          d: pathString,
          stroke,
          'stroke-linecap': strokeLinecap,
          'stroke-width': strokeWidth,
          opacity: ptg === 0 ? 0 : 1,
          'fill-opacity': '0',
          class: `${prefixCls}-circle-path`,
          style: pathStyle
        };
        return (0, _vue.createVNode)("path", (0, _objectSpread2.default)({
          "ref": setRef(index)
        }, pathProps), null);
      });
    };
    return () => {
      const {
          prefixCls,
          strokeWidth,
          trailWidth,
          gapDegree,
          gapPosition,
          trailColor,
          strokeLinecap,
          strokeColor
        } = props,
        restProps = __rest(props, ["prefixCls", "strokeWidth", "trailWidth", "gapDegree", "gapPosition", "trailColor", "strokeLinecap", "strokeColor"]);
      const {
        pathString,
        pathStyle
      } = getPathStyles(0, 100, trailColor, strokeWidth, gapDegree, gapPosition);
      delete restProps.percent;
      const gradient = strokeColorList.value.find(color => Object.prototype.toString.call(color) === '[object Object]');
      const pathFirst = {
        d: pathString,
        stroke: trailColor,
        'stroke-linecap': strokeLinecap,
        'stroke-width': trailWidth || strokeWidth,
        'fill-opacity': '0',
        class: `${prefixCls}-circle-trail`,
        style: pathStyle
      };
      return (0, _vue.createVNode)("svg", (0, _objectSpread2.default)({
        "class": `${prefixCls}-circle`,
        "viewBox": "0 0 100 100"
      }, restProps), [gradient && (0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("linearGradient", {
        "id": `${prefixCls}-gradient-${gradientId.value}`,
        "x1": "100%",
        "y1": "0%",
        "x2": "0%",
        "y2": "0%"
      }, [Object.keys(gradient).sort((a, b) => stripPercentToNumber(a) - stripPercentToNumber(b)).map((key, index) => (0, _vue.createVNode)("stop", {
        "key": index,
        "offset": key,
        "stop-color": gradient[key]
      }, null))])]), (0, _vue.createVNode)("path", pathFirst, null), getStokeList().reverse()]);
    };
  }
});