import { createVNode as _createVNode } from "vue";
import { cloneVNode, isVNode } from 'vue';
import PropTypes from '../_util/vue-types';
const TransBtn = (props, _ref) => {
  let {
    slots
  } = _ref;
  var _a;
  const {
    class: className,
    customizeIcon,
    customizeIconProps,
    onMousedown,
    onClick
  } = props;
  let icon;
  if (typeof customizeIcon === 'function') {
    icon = customizeIcon(customizeIconProps);
  } else {
    icon = isVNode(customizeIcon) ? cloneVNode(customizeIcon) : customizeIcon;
  }
  return _createVNode("span", {
    "class": className,
    "onMousedown": event => {
      event.preventDefault();
      if (onMousedown) {
        onMousedown(event);
      }
    },
    "style": {
      userSelect: 'none',
      WebkitUserSelect: 'none'
    },
    "unselectable": "on",
    "onClick": onClick,
    "aria-hidden": true
  }, [icon !== undefined ? icon : _createVNode("span", {
    "class": className.split(/\s+/).map(cls => `${cls}-icon`)
  }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
};
TransBtn.inheritAttrs = false;
TransBtn.displayName = 'TransBtn';
TransBtn.props = {
  class: String,
  customizeIcon: PropTypes.any,
  customizeIconProps: PropTypes.any,
  onMousedown: Function,
  onClick: Function
};
export default TransBtn;