import { createVNode as _createVNode } from "vue";
import { useInjectCascader } from '../context';
export default function Checkbox(_ref) {
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
  } = useInjectCascader();
  const mergedCheckable = checkable.value !== false ? customSlots.value.checkable : checkable.value;
  const customCheckbox = typeof mergedCheckable === 'function' ? mergedCheckable() : typeof mergedCheckable === 'boolean' ? null : mergedCheckable;
  return _createVNode("span", {
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