import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import supportsPassive from '../../../_util/supportsPassive';
import classNames from '../../../_util/classNames';
import { isValidElement } from '../../../_util/props-util';
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
    const markPointIsObject = typeof markPoint === 'object' && !isValidElement(markPoint);
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
    const markClassName = classNames({
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
    const markStyle = markPointIsObject ? _extends(_extends({}, style), markPoint.style) : style;
    const touchEvents = {
      [supportsPassive ? 'onTouchstartPassive' : 'onTouchstart']: e => onClickLabel(e, point)
    };
    return _createVNode("span", _objectSpread({
      "class": markClassName,
      "style": markStyle,
      "key": point,
      "onMousedown": e => onClickLabel(e, point)
    }, touchEvents), [markLabel]);
  });
  return _createVNode("div", {
    "class": className
  }, [elements]);
};
Marks.inheritAttrs = false;
export default Marks;