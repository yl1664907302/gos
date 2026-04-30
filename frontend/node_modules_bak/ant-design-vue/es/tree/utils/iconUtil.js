import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import FileOutlined from "@ant-design/icons-vue/es/icons/FileOutlined";
import MinusSquareOutlined from "@ant-design/icons-vue/es/icons/MinusSquareOutlined";
import PlusSquareOutlined from "@ant-design/icons-vue/es/icons/PlusSquareOutlined";
import CaretDownFilled from "@ant-design/icons-vue/es/icons/CaretDownFilled";
import { isValidElement } from '../../_util/props-util';
import { cloneVNode } from 'vue';
export default function renderSwitcherIcon(prefixCls, switcherIcon, props, leafIcon, showLine) {
  const {
    isLeaf,
    expanded,
    loading
  } = props;
  let icon = switcherIcon;
  if (loading) {
    return _createVNode(LoadingOutlined, {
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
      defaultIcon = _createVNode("span", {
        "class": `${prefixCls}-switcher-leaf-line`
      }, null);
    } else {
      defaultIcon = _createVNode(FileOutlined, {
        "class": `${prefixCls}-switcher-line-icon`
      }, null);
    }
    return defaultIcon;
  } else {
    defaultIcon = _createVNode(CaretDownFilled, {
      "class": switcherCls
    }, null);
    if (showLine) {
      defaultIcon = expanded ? _createVNode(MinusSquareOutlined, {
        "class": `${prefixCls}-switcher-line-icon`
      }, null) : _createVNode(PlusSquareOutlined, {
        "class": `${prefixCls}-switcher-line-icon`
      }, null);
    }
  }
  if (typeof switcherIcon === 'function') {
    icon = switcherIcon(_extends(_extends({}, props), {
      defaultIcon,
      switcherCls
    }));
  } else if (isValidElement(icon)) {
    icon = cloneVNode(icon, {
      class: switcherCls
    });
  }
  return icon || defaultIcon;
}