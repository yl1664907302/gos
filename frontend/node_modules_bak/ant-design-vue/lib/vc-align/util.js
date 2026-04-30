"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSamePoint = isSamePoint;
exports.monitorResize = monitorResize;
exports.restoreFocus = restoreFocus;
var _contains = _interopRequireDefault(require("../vc-util/Dom/contains"));
var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));
function isSamePoint(prev, next) {
  if (prev === next) return true;
  if (!prev || !next) return false;
  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }
  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }
  return false;
}
function restoreFocus(activeElement, container) {
  // Focus back if is in the container
  if (activeElement !== document.activeElement && (0, _contains.default)(container, activeElement) && typeof activeElement.focus === 'function') {
    activeElement.focus();
  }
}
function monitorResize(element, callback) {
  let prevWidth = null;
  let prevHeight = null;
  function onResize(_ref) {
    let [{
      target
    }] = _ref;
    if (!document.documentElement.contains(target)) return;
    const {
      width,
      height
    } = target.getBoundingClientRect();
    const fixedWidth = Math.floor(width);
    const fixedHeight = Math.floor(height);
    if (prevWidth !== fixedWidth || prevHeight !== fixedHeight) {
      // https://webkit.org/blog/9997/resizeobserver-in-webkit/
      Promise.resolve().then(() => {
        callback({
          width: fixedWidth,
          height: fixedHeight
        });
      });
    }
    prevWidth = fixedWidth;
    prevHeight = fixedHeight;
  }
  const resizeObserver = new _resizeObserverPolyfill.default(onResize);
  if (element) {
    resizeObserver.observe(element);
  }
  return () => {
    resizeObserver.disconnect();
  };
}