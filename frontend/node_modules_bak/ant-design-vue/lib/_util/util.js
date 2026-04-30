"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.controlDefaultValue = exports.capitalize = exports.camelize = exports.cacheStringFunction = void 0;
exports.getDataAndAriaProps = getDataAndAriaProps;
exports.isSymbol = exports.isString = exports.isOn = exports.isObject = exports.isFunction = exports.isArray = exports.hyphenate = void 0;
exports.renderHelper = renderHelper;
exports.resolvePropValue = resolvePropValue;
exports.toPx = toPx;
exports.wrapPromiseFn = wrapPromiseFn;
const isFunction = val => typeof val === 'function';
exports.isFunction = isFunction;
const controlDefaultValue = exports.controlDefaultValue = Symbol('controlDefaultValue');
const isArray = exports.isArray = Array.isArray;
const isString = val => typeof val === 'string';
exports.isString = isString;
const isSymbol = val => typeof val === 'symbol';
exports.isSymbol = isSymbol;
const isObject = val => val !== null && typeof val === 'object';
exports.isObject = isObject;
const onRE = /^on[^a-z]/;
const isOn = key => onRE.test(key);
exports.isOn = isOn;
const cacheStringFunction = fn => {
  const cache = Object.create(null);
  return str => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
exports.cacheStringFunction = cacheStringFunction;
const camelizeRE = /-(\w)/g;
const camelize = exports.camelize = cacheStringFunction(str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '');
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = exports.hyphenate = cacheStringFunction(str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});
const capitalize = exports.capitalize = cacheStringFunction(str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
// change from vue sourcecode
function resolvePropValue(options, props, key, value) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default');
    // default values
    if (hasDefault && value === undefined) {
      const defaultValue = opt.default;
      value = opt.type !== Function && isFunction(defaultValue) ? defaultValue() : defaultValue;
    }
    // boolean casting
    if (opt.type === Boolean) {
      if (!hasOwn(props, key) && !hasDefault) {
        value = false;
      } else if (value === '') {
        value = true;
      }
    }
  }
  return value;
}
function getDataAndAriaProps(props) {
  return Object.keys(props).reduce((memo, key) => {
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      memo[key] = props[key];
    }
    return memo;
  }, {});
}
function toPx(val) {
  if (typeof val === 'number') return `${val}px`;
  return val;
}
function renderHelper(v) {
  let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let defaultV = arguments.length > 2 ? arguments[2] : undefined;
  if (typeof v === 'function') {
    return v(props);
  }
  return v !== null && v !== void 0 ? v : defaultV;
}
function wrapPromiseFn(openFn) {
  let closeFn;
  const closePromise = new Promise(resolve => {
    closeFn = openFn(() => {
      resolve(true);
    });
  });
  const result = () => {
    closeFn === null || closeFn === void 0 ? void 0 : closeFn();
  };
  result.then = (filled, rejected) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}