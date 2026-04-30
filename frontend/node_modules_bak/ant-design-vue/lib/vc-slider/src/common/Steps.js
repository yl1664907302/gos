"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _warning = _interopRequireDefault(require("../../../_util/warning"));
const calcPoints = (_vertical, marks, dots, step, min, max) => {
  (0, _warning.default)(dots ? step > 0 : true, 'Slider', '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
  const points = Object.keys(marks).map(parseFloat).sort((a, b) => a - b);
  if (dots && step) {
    for (let i = min; i <= max; i += step) {
      if (points.indexOf(i) === -1) {
        points.push(i);
      }
    }
  }
  return points;
};
const Steps = (_, _ref) => {
  let {
    attrs
  } = _ref;
  const {
    prefixCls,
    vertical,
    reverse,
    marks,
    dots,
    step,
    included,
    lowerBound,
    upperBound,
    max,
    min,
    dotStyle,
    activeDotStyle
  } = attrs;
  const range = max - min;
  const elements = calcPoints(vertical, marks, dots, step, min, max).map(point => {
    const offset = `${Math.abs(point - min) / range * 100}%`;
    const isActived = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
    let style = vertical ? (0, _extends2.default)((0, _extends2.default)({}, dotStyle), {
      [reverse ? 'top' : 'bottom']: offset
    }) : (0, _extends2.default)((0, _extends2.default)({}, dotStyle), {
      [reverse ? 'right' : 'left']: offset
    });
    if (isActived) {
      style = (0, _extends2.default)((0, _extends2.default)({}, style), activeDotStyle);
    }
    const pointClassName = (0, _classNames.default)({
      [`${prefixCls}-dot`]: true,
      [`${prefixCls}-dot-active`]: isActived,
      [`${prefixCls}-dot-reverse`]: reverse
    });
    return (0, _vue.createVNode)("span", {
      "class": pointClassName,
      "style": style,
      "key": point
    }, null);
  });
  return (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-step`
  }, [elements]);
};
Steps.inheritAttrs = false;
var _default = exports.default = Steps;