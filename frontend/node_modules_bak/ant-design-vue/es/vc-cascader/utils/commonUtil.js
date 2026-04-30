export const VALUE_SPLIT = '__RC_CASCADER_SPLIT__';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';
export function toPathKey(value) {
  return value.join(VALUE_SPLIT);
}
export function toPathKeys(value) {
  return value.map(toPathKey);
}
export function toPathValueStr(pathKey) {
  return pathKey.split(VALUE_SPLIT);
}
export function fillFieldNames(fieldNames) {
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
export function isLeaf(option, fieldNames) {
  var _a, _b;
  return (_a = option.isLeaf) !== null && _a !== void 0 ? _a : !((_b = option[fieldNames.children]) === null || _b === void 0 ? void 0 : _b.length);
}
export function scrollIntoParentView(element) {
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