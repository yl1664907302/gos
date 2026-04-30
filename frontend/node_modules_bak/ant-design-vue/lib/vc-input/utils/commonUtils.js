"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixControlledValue = fixControlledValue;
exports.hasAddon = hasAddon;
exports.hasPrefixSuffix = hasPrefixSuffix;
exports.resolveOnChange = resolveOnChange;
exports.triggerFocus = triggerFocus;
var _propsUtil = require("../../_util/props-util");
const isValid = value => {
  return value !== undefined && value !== null && (Array.isArray(value) ? (0, _propsUtil.filterEmpty)(value).length : true);
};
function hasPrefixSuffix(propsAndSlots) {
  return isValid(propsAndSlots.prefix) || isValid(propsAndSlots.suffix) || isValid(propsAndSlots.allowClear);
}
function hasAddon(propsAndSlots) {
  return isValid(propsAndSlots.addonBefore) || isValid(propsAndSlots.addonAfter);
}
function fixControlledValue(value) {
  if (typeof value === 'undefined' || value === null) {
    return '';
  }
  return String(value);
}
function resolveOnChange(target, e, onChange, targetValue) {
  if (!onChange) {
    return;
  }
  const event = e;
  if (e.type === 'click') {
    Object.defineProperty(event, 'target', {
      writable: true
    });
    Object.defineProperty(event, 'currentTarget', {
      writable: true
    });
    // click clear icon
    //event = Object.create(e);
    const currentTarget = target.cloneNode(true);
    event.target = currentTarget;
    event.currentTarget = currentTarget;
    // change target ref value cause e.target.value should be '' when clear input
    currentTarget.value = '';
    onChange(event);
    return;
  }
  // Trigger by composition event, this means we need force change the input value
  if (targetValue !== undefined) {
    Object.defineProperty(event, 'target', {
      writable: true
    });
    Object.defineProperty(event, 'currentTarget', {
      writable: true
    });
    event.target = target;
    event.currentTarget = target;
    target.value = targetValue;
    onChange(event);
    return;
  }
  onChange(event);
}
function triggerFocus(element, option) {
  if (!element) return;
  element.focus(option);
  // Selection content
  const {
    cursor
  } = option || {};
  if (cursor) {
    const len = element.value.length;
    switch (cursor) {
      case 'start':
        element.setSelectionRange(0, 0);
        break;
      case 'end':
        element.setSelectionRange(len, len);
        break;
      default:
        element.setSelectionRange(0, len);
    }
  }
}