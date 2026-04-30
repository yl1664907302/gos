"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _supportsPassive = _interopRequireDefault(require("../../../_util/supportsPassive"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _propsUtil = require("../../../_util/props-util");
const Marks = (_, _ref) => {
  let {
    attrs,
    slots
  } = _ref;
  const {
    class: className,
    vertical,
    reverse,
    marks,
    included,
    upperBound,
    lowerBound,
    max,
    min,
    onClickLabel
  } = attrs;
  const marksKeys = Object.keys(marks);
  const customMark = slots.mark;
  const range = max - min;
  const elements = marksKeys.map(parseFloat).sort((a, b) => a - b).map(point => {
    const markPoint = typeof marks[point] === 'function' ? marks[point]() : marks[point];
    const markPointIsObject = typeof markPoint === 'object' && !(0, _propsUtil.isValidElement)(markPoint);
    let markLabel = markPointIsObject ? markPoint.label : markPoint;
    if (!markLabel && markLabel !== 0) {
      return null;
    }
    if (customMark) {
      markLabel = customMark({
        point,
        label: markLabel
      });
    }
    const isActive = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
    const markClassName = (0, _classNames.default)({
      [`${className}-text`]: true,
      [`${className}-text-active`]: isActive
    });
    const bottomStyle = {
      marginBottom: '-50%',
      [reverse ? 'top' : 'bottom']: `${(point - min) / range * 100}%`
    };
    const leftStyle = {
      transform: `translateX(${reverse ? `50%` : `-50%`})`,
      msTransform: `translateX(${reverse ? `50%` : `-50%`})`,
      [reverse ? 'right' : 'left']: `${(point - min) / range * 100}%`
    };
    const style = vertical ? bottomStyle : leftStyle;
    const markStyle = markPointIsObject ? (0, _extends2.default)((0, _extends2.default)({}, style), markPoint.style) : style;
    const touchEvents = {
      [_supportsPassive.default ? 'onTouchstartPassive' : 'onTouchstart']: e => onClickLabel(e, point)
    };
    return (0, _vue.createVNode)("span", (0, _objectSpread2.default)({
      "class": markClassName,
      "style": markStyle,
      "key": point,
      "onMousedown": e => onClickLabel(e, point)
    }, touchEvents), [markLabel]);
  });
  return (0, _vue.createVNode)("div", {
    "class": className
  }, [elements]);
};
Marks.inheritAttrs = false;
var _default = exports.default = Marks;