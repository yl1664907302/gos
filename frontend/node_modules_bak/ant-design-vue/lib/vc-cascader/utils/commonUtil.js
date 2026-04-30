"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALUE_SPLIT = exports.SHOW_PARENT = exports.SHOW_CHILD = void 0;
exports.fillFieldNames = fillFieldNames;
exports.isLeaf = isLeaf;
exports.scrollIntoParentView = scrollIntoParentView;
exports.toPathKey = toPathKey;
exports.toPathKeys = toPathKeys;
exports.toPathValueStr = toPathValueStr;
const VALUE_SPLIT = exports.VALUE_SPLIT = '__RC_CASCADER_SPLIT__';
const SHOW_PARENT = exports.SHOW_PARENT = 'SHOW_PARENT';
const SHOW_CHILD = exports.SHOW_CHILD = 'SHOW_CHILD';
function toPathKey(value) {
  return value.join(VALUE_SPLIT);
}
function toPathKeys(value) {
  return value.map(toPathKey);
}
function toPathValueStr(pathKey) {
  return pathKey.split(VALUE_SPLIT);
}
function fillFieldNames(fieldNames) {
  const {
    label,
    value,
    children
  } = fieldNames || {};
  const val = value || 'value';
  return {
    label: label || 'label',
    value: val,
    key: val,
    children: children || 'children'
  };
}
function isLeaf(option, fieldNames) {
  var _a, _b;
  return (_a = option.isLeaf) !== null && _a !== void 0 ? _a : !((_b = option[fieldNames.children]) === null || _b === void 0 ? void 0 : _b.length);
}
function scrollIntoParentView(element) {
  const parent = element.parentElement;
  if (!parent) {
    return;
  }
  const elementToParent = element.offsetTop - parent.offsetTop; // offsetParent may not be parent.
  if (elementToParent - parent.scrollTop < 0) {
    parent.scrollTo({
      top: elementToParent
    });
  } else if (elementToParent + element.offsetHeight - parent.scrollTop > parent.offsetHeight) {
    parent.scrollTo({
      top: elementToParent + element.offsetHeight - parent.offsetHeight
    });
  }
}