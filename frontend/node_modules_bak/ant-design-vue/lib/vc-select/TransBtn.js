"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
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
    icon = (0, _vue.isVNode)(customizeIcon) ? (0, _vue.cloneVNode)(customizeIcon) : customizeIcon;
  }
  return (0, _vue.createVNode)("span", {
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
  }, [icon !== undefined ? icon : (0, _vue.createVNode)("span", {
    "class": className.split(/\s+/).map(cls => `${cls}-icon`)
  }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
};
TransBtn.inheritAttrs = false;
TransBtn.displayName = 'TransBtn';
TransBtn.props = {
  class: String,
  customizeIcon: _vueTypes.default.any,
  customizeIconProps: _vueTypes.default.any,
  onMousedown: Function,
  onClick: Function
};
var _default = exports.default = TransBtn;