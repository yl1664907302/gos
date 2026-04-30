export function toArray(value) {
  if (Array.isArray(value)) {
    return value;
  }
  return value !== undefined ? [value] : [];
}
export function fillFieldNames(fieldNames) {
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
export function isCheckDisabled(node) {
  return node.disabled || node.disableCheckbox || node.checkable === false;
}
/** Loop fetch all the keys exist in the tree */
export function getAllKeys(treeData, fieldNames) {
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
export function isNil(val) {
  return val === null || val === undefined;
}