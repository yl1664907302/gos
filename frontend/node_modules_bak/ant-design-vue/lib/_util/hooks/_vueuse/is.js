"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestamp = exports.rand = exports.now = exports.noop = exports.isWindow = exports.isString = exports.isObject = exports.isNumber = exports.isIOS = exports.isFunction = exports.isDef = exports.isClient = exports.isBoolean = exports.hasOwn = exports.clamp = exports.assert = void 0;
var _a;
const isClient = exports.isClient = typeof window !== 'undefined';
const isDef = val => typeof val !== 'undefined';
exports.isDef = isDef;
const assert = function (condition) {
  for (var _len = arguments.length, infos = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    infos[_key - 1] = arguments[_key];
  }
  if (!condition) console.warn(...infos);
};
exports.assert = assert;
const toString = Object.prototype.toString;
const isBoolean = val => typeof val === 'boolean';
exports.isBoolean = isBoolean;
const isFunction = val => typeof val === 'function';
exports.isFunction = isFunction;
const isNumber = val => typeof val === 'number';
exports.isNumber = isNumber;
const isString = val => typeof val === 'string';
exports.isString = isString;
const isObject = val => toString.call(val) === '[object Object]';
exports.isObject = isObject;
const isWindow = val => typeof window !== 'undefined' && toString.call(val) === '[object Window]';
exports.isWindow = isWindow;
const now = () => Date.now();
exports.now = now;
const timestamp = () => +Date.now();
exports.timestamp = timestamp;
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
exports.clamp = clamp;
const noop = () => {};
exports.noop = noop;
const rand = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.rand = rand;
const isIOS = exports.isIOS = isClient && ((_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
exports.hasOwn = hasOwn;