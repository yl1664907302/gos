"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Checkbox;
var _vue = require("vue");
var _context = require("../context");
function Checkbox(_ref) {
  let {
    prefixCls,
    checked,
    halfChecked,
    disabled,
    onClick
  } = _ref;
  const {
    customSlots,
    checkable
  } = (0, _context.useInjectCascader)();
  const mergedCheckable = checkable.value !== false ? customSlots.value.checkable : checkable.value;
  const customCheckbox = typeof mergedCheckable === 'function' ? mergedCheckable() : typeof mergedCheckable === 'boolean' ? null : mergedCheckable;
  return (0, _vue.createVNode)("span", {
    "class": {
      [prefixCls]: true,
      [`${prefixCls}-checked`]: checked,
      [`${prefixCls}-indeterminate`]: !checked && halfChecked,
      [`${prefixCls}-disabled`]: disabled
    },
    "onClick": onClick
  }, [customCheckbox]);
}
Checkbox.props = ['prefixCls', 'checked', 'halfChecked', 'disabled', 'onClick'];
Checkbox.displayName = 'Checkbox';
Checkbox.inheritAttrs = false;