"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = renderSwitcherIcon;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _FileOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FileOutlined"));
var _MinusSquareOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/MinusSquareOutlined"));
var _PlusSquareOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/PlusSquareOutlined"));
var _CaretDownFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CaretDownFilled"));
var _propsUtil = require("../../_util/props-util");
function renderSwitcherIcon(prefixCls, switcherIcon, props, leafIcon, showLine) {
  const {
    isLeaf,
    expanded,
    loading
  } = props;
  let icon = switcherIcon;
  if (loading) {
    return (0, _vue.createVNode)(_LoadingOutlined.default, {
      "class": `${prefixCls}-switcher-loading-icon`
    }, null);
  }
  let showLeafIcon;
  if (showLine && typeof showLine === 'object') {
    showLeafIcon = showLine.showLeafIcon;
  }
  let defaultIcon = null;
  const switcherCls = `${prefixCls}-switcher-icon`;
  if (isLeaf) {
    if (!showLine) {
      return null;
    }
    if (showLeafIcon && leafIcon) {
      return leafIcon(props);
    }
    if (typeof showLine === 'object' && !showLeafIcon) {
      defaultIcon = (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-switcher-leaf-line`
      }, null);
    } else {
      defaultIcon = (0, _vue.createVNode)(_FileOutlined.default, {
        "class": `${prefixCls}-switcher-line-icon`
      }, null);
    }
    return defaultIcon;
  } else {
    defaultIcon = (0, _vue.createVNode)(_CaretDownFilled.default, {
      "class": switcherCls
    }, null);
    if (showLine) {
      defaultIcon = expanded ? (0, _vue.createVNode)(_MinusSquareOutlined.default, {
        "class": `${prefixCls}-switcher-line-icon`
      }, null) : (0, _vue.createVNode)(_PlusSquareOutlined.default, {
        "class": `${prefixCls}-switcher-line-icon`
      }, null);
    }
  }
  if (typeof switcherIcon === 'function') {
    icon = switcherIcon((0, _extends2.default)((0, _extends2.default)({}, props), {
      defaultIcon,
      switcherCls
    }));
  } else if ((0, _propsUtil.isValidElement)(icon)) {
    icon = (0, _vue.cloneVNode)(icon, {
      class: switcherCls
    });
  }
  return icon || defaultIcon;
}