"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillFieldNames = fillFieldNames;
exports.getAllKeys = getAllKeys;
exports.isCheckDisabled = isCheckDisabled;
exports.isNil = isNil;
exports.toArray = toArray;
function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}
function fillFieldNames(fieldNames) {
  const {
    label,
    value,
    children
  } = fieldNames || {};
  const mergedValue = value || 'value';
  return {
    _title: label ? [label] : ['title', 'label'],
    value: mergedValue,
    key: mergedValue,
    children: children || 'children'
  };
}
function isCheckDisabled(node) {
  return node.disabled || node.disableCheckbox || node.checkable === false;
}
/** Loop fetch all the keys exist in the tree */
function getAllKeys(treeData, fieldNames) {
  const keys = [];
  function dig(list) {
    list.forEach(item => {
      keys.push(item[fieldNames.value]);
      const children = item[fieldNames.children];
      if (children) {
        dig(children);
      }
    });
  }
  dig(treeData);
  return keys;
}
function isNil(val) {
  return val === null || val === undefined;
}