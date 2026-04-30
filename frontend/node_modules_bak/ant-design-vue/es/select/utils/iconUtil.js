import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
import DownOutlined from "@ant-design/icons-vue/es/icons/DownOutlined";
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import CheckOutlined from "@ant-design/icons-vue/es/icons/CheckOutlined";
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import SearchOutlined from "@ant-design/icons-vue/es/icons/SearchOutlined";
export default function getIcons(props) {
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
  const mergedClearIcon = clearIcon !== null && clearIcon !== void 0 ? clearIcon : _createVNode(CloseCircleFilled, null, null);
  // Validation Feedback Icon
  const getSuffixIconNode = arrowIcon => _createVNode(_Fragment, null, [showArrow !== false && arrowIcon, hasFeedback && feedbackIcon]);
  // Arrow item icon
  let mergedSuffixIcon = null;
  if (suffixIcon !== undefined) {
    mergedSuffixIcon = getSuffixIconNode(suffixIcon);
  } else if (loading) {
    mergedSuffixIcon = getSuffixIconNode(_createVNode(LoadingOutlined, {
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
        return getSuffixIconNode(_createVNode(SearchOutlined, {
          "class": iconCls
        }, null));
      }
      return getSuffixIconNode(_createVNode(DownOutlined, {
        "class": iconCls
      }, null));
    };
  }
  // Checked item icon
  let mergedItemIcon = null;
  if (menuItemSelectedIcon !== undefined) {
    mergedItemIcon = menuItemSelectedIcon;
  } else if (multiple) {
    mergedItemIcon = _createVNode(CheckOutlined, null, null);
  } else {
    mergedItemIcon = null;
  }
  let mergedRemoveIcon = null;
  if (removeIcon !== undefined) {
    mergedRemoveIcon = removeIcon;
  } else {
    mergedRemoveIcon = _createVNode(CloseOutlined, null, null);
  }
  return {
    clearIcon: mergedClearIcon,
    suffixIcon: mergedSuffixIcon,
    itemIcon: mergedItemIcon,
    removeIcon: mergedRemoveIcon
  };
}