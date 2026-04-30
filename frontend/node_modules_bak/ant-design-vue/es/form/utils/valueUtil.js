import _extends from "@babel/runtime/helpers/esm/extends";
import { toArray } from './typeUtil';
import get from '../../vc-util/get';
import set from '../../vc-util/set';
/**
 * Convert name to internal supported format.
 * This function should keep since we still thinking if need support like `a.b.c` format.
 * 'a' => ['a']
 * 123 => [123]
 * ['a', 123] => ['a', 123]
 */
export function getNamePath(path) {
  return toArray(path);
}
export function getValue(store, namePath) {
  const value = get(store, namePath);
  return value;
}
export function setValue(store, namePath, value) {
  let removeIfUndefined = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  const newStore = set(store, namePath, value, removeIfUndefined);
  return newStore;
}
export function containsNamePath(namePathList, namePath) {
  return namePathList && namePathList.some(path => matchNamePath(path, namePath));
}
function isObject(obj) {
  return typeof obj === 'object' && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}
/**
 * Copy values into store and return a new values object
 * ({ a: 1, b: { c: 2 } }, { a: 4, b: { d: 5 } }) => { a: 4, b: { c: 2, d: 5 } }
 */
function internalSetValues(store, values) {
  const newStore = Array.isArray(store) ? [...store] : _extends({}, store);
  if (!values) {
    return newStore;
  }
  Object.keys(values).forEach(key => {
    const prevValue = newStore[key];
    const value = values[key];
    // If both are object (but target is not array), we use recursion to set deep value
    const recursive = isObject(prevValue) && isObject(value);
    newStore[key] = recursive ? internalSetValues(prevValue, value || {}) : value;
  });
  return newStore;
}
export function setValues(store) {
  for (var _len = arguments.length, restValues = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    restValues[_key - 1] = arguments[_key];
  }
  return restValues.reduce((current, newStore) => internalSetValues(current, newStore), store);
}
export function cloneByNamePathList(store, namePathList) {
  let newStore = {};
  namePathList.forEach(namePath => {
    const value = getValue(store, namePath);
    newStore = setValue(newStore, namePath, value);
  });
  return newStore;
}
export function matchNamePath(namePath, changedNamePath) {
  if (!namePath || !changedNamePath || namePath.length !== changedNamePath.length) {
    return false;
  }
  return namePath.every((nameUnit, i) => changedNamePath[i] === nameUnit);
}