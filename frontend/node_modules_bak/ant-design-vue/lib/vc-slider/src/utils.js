"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateNextValue = calculateNextValue;
exports.ensureValueInRange = ensureValueInRange;
exports.ensureValuePrecision = ensureValuePrecision;
exports.getClosestPoint = getClosestPoint;
exports.getHandleCenterPosition = getHandleCenterPosition;
exports.getKeyboardValueMutator = getKeyboardValueMutator;
exports.getMousePosition = getMousePosition;
exports.getPrecision = getPrecision;
exports.getTouchPosition = getTouchPosition;
exports.isEventFromHandle = isEventFromHandle;
exports.isNotTouchEvent = isNotTouchEvent;
exports.isValueOutOfRange = isValueOutOfRange;
exports.pauseEvent = pauseEvent;
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
function isEventFromHandle(e, handles) {
  try {
    return Object.keys(handles).some(key => e.target === handles[key].ref);
  } catch (error) {
    return false;
  }
}
function isValueOutOfRange(value, _ref) {
  let {
    min,
    max
  } = _ref;
  return value < min || value > max;
}
function isNotTouchEvent(e) {
  return e.touches.length > 1 || e.type.toLowerCase() === 'touchend' && e.touches.length > 0;
}
function getClosestPoint(val, _ref2) {
  let {
    marks,
    step,
    min,
    max
  } = _ref2;
  const points = Object.keys(marks).map(parseFloat);
  if (step !== null) {
    const baseNum = Math.pow(10, getPrecision(step));
    const maxSteps = Math.floor((max * baseNum - min * baseNum) / (step * baseNum));
    const steps = Math.min((val - min) / step, maxSteps);
    const closestStep = Math.round(steps) * step + min;
    points.push(closestStep);
  }
  const diffs = points.map(point => Math.abs(val - point));
  return points[diffs.indexOf(Math.min(...diffs))];
}
function getPrecision(step) {
  const stepString = step.toString();
  let precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - stepString.indexOf('.') - 1;
  }
  return precision;
}
function getMousePosition(vertical, e) {
  let zoom = 1;
  if (window.visualViewport) {
    zoom = +(window.visualViewport.width / document.body.getBoundingClientRect().width).toFixed(2);
  }
  return (vertical ? e.clientY : e.pageX) / zoom;
}
function getTouchPosition(vertical, e) {
  let zoom = 1;
  if (window.visualViewport) {
    zoom = +(window.visualViewport.width / document.body.getBoundingClientRect().width).toFixed(2);
  }
  return (vertical ? e.touches[0].clientY : e.touches[0].pageX) / zoom;
}
function getHandleCenterPosition(vertical, handle) {
  const coords = handle.getBoundingClientRect();
  return vertical ? coords.top + coords.height * 0.5 : window.scrollX + coords.left + coords.width * 0.5;
}
function ensureValueInRange(val, _ref3) {
  let {
    max,
    min
  } = _ref3;
  if (val <= min) {
    return min;
  }
  if (val >= max) {
    return max;
  }
  return val;
}
function ensureValuePrecision(val, props) {
  const {
    step
  } = props;
  const closestPoint = isFinite(getClosestPoint(val, props)) ? getClosestPoint(val, props) : 0; // eslint-disable-line
  return step === null ? closestPoint : parseFloat(closestPoint.toFixed(getPrecision(step)));
}
function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}
function calculateNextValue(func, value, props) {
  const operations = {
    increase: (a, b) => a + b,
    decrease: (a, b) => a - b
  };
  const indexToGet = operations[func](Object.keys(props.marks).indexOf(JSON.stringify(value)), 1);
  const keyToGet = Object.keys(props.marks)[indexToGet];
  if (props.step) {
    return operations[func](value, props.step);
  }
  if (!!Object.keys(props.marks).length && !!props.marks[keyToGet]) {
    return props.marks[keyToGet];
  }
  return value;
}
function getKeyboardValueMutator(e, vertical, reverse) {
  const increase = 'increase';
  const decrease = 'decrease';
  let method = increase;
  switch (e.keyCode) {
    case _KeyCode.default.UP:
      method = vertical && reverse ? decrease : increase;
      break;
    case _KeyCode.default.RIGHT:
      method = !vertical && reverse ? decrease : increase;
      break;
    case _KeyCode.default.DOWN:
      method = vertical && reverse ? increase : decrease;
      break;
    case _KeyCode.default.LEFT:
      method = !vertical && reverse ? increase : decrease;
      break;
    case _KeyCode.default.END:
      return (_value, props) => props.max;
    case _KeyCode.default.HOME:
      return (_value, props) => props.min;
    case _KeyCode.default.PAGE_UP:
      return (value, props) => value + props.step * 2;
    case _KeyCode.default.PAGE_DOWN:
      return (value, props) => value - props.step * 2;
    default:
      return undefined;
  }
  return (value, props) => calculateNextValue(method, value, props);
}