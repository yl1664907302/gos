"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getIcons;
var _vue = require("vue");
var _DownOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DownOutlined"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _CheckOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckOutlined"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _SearchOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/SearchOutlined"));
function getIcons(props) {
  let slots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    loading,
    multiple,
    prefixCls,
    hasFeedback,
    feedbackIcon,
    showArrow
  } = props;
  const suffixIcon = props.suffixIcon || slots.suffixIcon && slots.suffixIcon();
  const clearIcon = props.clearIcon || slots.clearIcon && slots.clearIcon();
  const menuItemSelectedIcon = props.menuItemSelectedIcon || slots.menuItemSelectedIcon && slots.menuItemSelectedIcon();
  const removeIcon = props.removeIcon || slots.removeIcon && slots.removeIcon();
  // Clear Icon
  const mergedClearIcon = clearIcon !== null && clearIcon !== void 0 ? clearIcon : (0, _vue.createVNode)(_CloseCircleFilled.default, null, null);
  // Validation Feedback Icon
  const getSuffixIconNode = arrowIcon => (0, _vue.createVNode)(_vue.Fragment, null, [showArrow !== false && arrowIcon, hasFeedback && feedbackIcon]);
  // Arrow item icon
  let mergedSuffixIcon = null;
  if (suffixIcon !== undefined) {
    mergedSuffixIcon = getSuffixIconNode(suffixIcon);
  } else if (loading) {
    mergedSuffixIcon = getSuffixIconNode((0, _vue.createVNode)(_LoadingOutlined.default, {
      "spin": true
    }, null));
  } else {
    const iconCls = `${prefixCls}-suffix`;
    mergedSuffixIcon = _ref => {
      let {
        open,
        showSearch
      } = _ref;
      if (open && showSearch) {
        return getSuffixIconNode((0, _vue.createVNode)(_SearchOutlined.default, {
          "class": iconCls
        }, null));
      }
      return getSuffixIconNode((0, _vue.createVNode)(_DownOutlined.default, {
        "class": iconCls
      }, null));
    };
  }
  // Checked item icon
  let mergedItemIcon = null;
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = (0, _vue.createVNode)(_CheckOutlined.default, null, null);
  } else {
    mergedItemIcon = null;
  }
  let mergedRemoveIcon = null;
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = (0, _vue.createVNode)(_CloseOutlined.default, null, null);
  }
  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon
  };
}