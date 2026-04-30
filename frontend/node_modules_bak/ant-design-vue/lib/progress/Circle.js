"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.circleProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcProgress = require("../vc-progress");
var _utils = require("./utils");
var _props = require("./props");
var _propsUtil = require("../_util/props-util");
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _type = require("../_util/type");
const circleProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _props.progressProps)()), {
  strokeColor: (0, _type.anyType)()
});
exports.circleProps = circleProps;
const CIRCLE_MIN_STROKE_WIDTH = 3;
const getMinPercent = width => CIRCLE_MIN_STROKE_WIDTH / width * 100;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ProgressCircle',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(circleProps(), {
    trailColor: null
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const originWidth = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.width) !== null && _a !== void 0 ? _a : 120;
    });
    const mergedSize = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.size) !== null && _a !== void 0 ? _a : [originWidth.value, originWidth.value];
    });
    const sizeRef = (0, _vue.computed)(() => (0, _utils.getSize)(mergedSize.value, 'circle'));
    const gapDeg = (0, _vue.computed)(() => {
      // Support gapDeg = 0 when type = 'dashboard'
      if (props.gapDegree || props.gapDegree === 0) {
        return props.gapDegree;
      }
      if (props.type === 'dashboard') {
        return 75;
      }
      return undefined;
    });
    const circleStyle = (0, _vue.computed)(() => {
      return {
        width: `${sizeRef.value.width}px`,
        height: `${sizeRef.value.height}px`,
        fontSize: `${sizeRef.value.width * 0.15 + 6}px`
      };
    });
    const circleWidth = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.strokeWidth) !== null && _a !== void 0 ? _a : Math.max(getMinPercent(sizeRef.value.width), 6);
    });
    const gapPos = (0, _vue.computed)(() => props.gapPosition || props.type === 'dashboard' && 'bottom' || undefined);
    // using className to style stroke color
    const percent = (0, _vue.computed)(() => (0, _utils.getPercentage)(props));
    const isGradient = (0, _vue.computed)(() => Object.prototype.toString.call(props.strokeColor) === '[object Object]');
    const strokeColor = (0, _vue.computed)(() => (0, _utils.getStrokeColor)({
      success: props.success,
      strokeColor: props.strokeColor
    }));
    const wrapperClassName = (0, _vue.computed)(() => ({
      [`${props.prefixCls}-inner`]: true,
      [`${props.prefixCls}-circle-gradient`]: isGradient.value
    }));
    return () => {
      var _a;
      const circleContent = (0, _vue.createVNode)(_vcProgress.Circle, {
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
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [wrapperClassName.value, attrs.class],
        "style": [attrs.style, circleStyle.value]
      }), [sizeRef.value.width <= 20 ? (0, _vue.createVNode)(_tooltip.default, null, {
        default: () => [(0, _vue.createVNode)("span", null, [circleContent])],
        title: slots.default
      }) : (0, _vue.createVNode)(_vue.Fragment, null, [circleContent, (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
    };
  }
});