"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEventListener = addEventListener;
exports.dataToArray = dataToArray;
exports.isNumeric = exports.getTouchParentScroll = void 0;
exports.removeEventListener = removeEventListener;
exports.transformArguments = transformArguments;
exports.windowIsUndefined = exports.transitionStr = exports.transitionEndFun = void 0;
function dataToArray(vars) {
  if (Array.isArray(vars)) {
    return vars;
  }
  return [vars];
}
const transitionEndObject = {
  transition: 'transitionend',
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'oTransitionEnd otransitionend'
};
const transitionStr = exports.transitionStr = Object.keys(transitionEndObject).filter(key => {
  if (typeof document === 'undefined') {
    return false;
  }
  const html = document.getElementsByTagName('html')[0];
  return key in (html ? html.style : {});
})[0];
const transitionEndFun = exports.transitionEndFun = transitionEndObject[transitionStr];
function addEventListener(target, eventType, callback, options) {
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, options);
  } else if (target.attachEvent) {
    // tslint:disable-line
    target.attachEvent(`on${eventType}`, callback); // tslint:disable-line
  }
}
function removeEventListener(target, eventType, callback, options) {
  if (target.removeEventListener) {
    target.removeEventListener(eventType, callback, options);
  } else if (target.attachEvent) {
    // tslint:disable-line
    target.detachEvent(`on${eventType}`, callback); // tslint:disable-line
  }
}
function transformArguments(arg, cb) {
  const result = typeof arg === 'function' ? arg(cb) : arg;
  if (Array.isArray(result)) {
    if (result.length === 2) {
      return result;
    }
    return [result[0], result[1]];
  }
  return [result];
}
const isNumeric = value => !isNaN(parseFloat(value)) && isFinite(value);
exports.isNumeric = isNumeric;
const windowIsUndefined = exports.windowIsUndefined = !(typeof window !== 'undefined' && window.document && window.document.createElement);
const getTouchParentScroll = (root, currentTarget, differX, differY) => {
  if (!currentTarget || currentTarget === document || currentTarget instanceof Document) {
    return false;
  }
  // root 为 drawer-content 设定了 overflow, 判断为 root 的 parent 时结束滚动；
  if (currentTarget === root.parentNode) {
    return true;
  }
  const isY = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differY);
  const isX = Math.max(Math.abs(differX), Math.abs(differY)) === Math.abs(differX);
  const scrollY = currentTarget.scrollHeight - currentTarget.clientHeight;
  const scrollX = currentTarget.scrollWidth - currentTarget.clientWidth;
  const style = document.defaultView.getComputedStyle(currentTarget);
  const overflowY = style.overflowY === 'auto' || style.overflowY === 'scroll';
  const overflowX = style.overflowX === 'auto' || style.overflowX === 'scroll';
  const y = scrollY && overflowY;
  const x = scrollX && overflowX;
  if (isY && (!y || y && (currentTarget.scrollTop >= scrollY && differY < 0 || currentTarget.scrollTop <= 0 && differY > 0)) || isX && (!x || x && (currentTarget.scrollLeft >= scrollX && differX < 0 || currentTarget.scrollLeft <= 0 && differX > 0))) {
    return getTouchParentScroll(root, currentTarget.parentNode, differX, differY);
  }
  return false;
};
exports.getTouchParentScroll = getTouchParentScroll;