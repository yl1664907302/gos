import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import classNames from '../../../_util/classNames';
import warning from '../../../_util/warning';
const calcPoints = (_vertical, marks, dots, step, min, max) => {
  warning(dots ? step > 0 : true, 'Slider', '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
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
    let style = vertical ? _extends(_extends({}, dotStyle), {
      [reverse ? 'top' : 'bottom']: offset
    }) : _extends(_extends({}, dotStyle), {
      [reverse ? 'right' : 'left']: offset
    });
    if (isActived) {
      style = _extends(_extends({}, style), activeDotStyle);
    }
    const pointClassName = classNames({
      [`${prefixCls}-dot`]: true,
      [`${prefixCls}-dot-active`]: isActived,
      [`${prefixCls}-dot-reverse`]: reverse
    });
    return _createVNode("span", {
      "class": pointClassName,
      "style": style,
      "key": point
    }, null);
  });
  return _createVNode("div", {
    "class": `${prefixCls}-step`
  }, [elements]);
};
Steps.inheritAttrs = false;
export default Steps;