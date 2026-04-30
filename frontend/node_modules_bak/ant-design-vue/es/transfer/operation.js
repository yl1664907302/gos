import { createVNode as _createVNode } from "vue";
import LeftOutlined from "@ant-design/icons-vue/es/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import Button from '../button';
function noop() {}
const Operation = props => {
  const {
    disabled,
    moveToLeft = noop,
    moveToRight = noop,
    leftArrowText = '',
    rightArrowText = '',
    leftActive,
    rightActive,
    class: className,
    style,
    direction,
    oneWay
  } = props;
  return _createVNode("div", {
    "class": className,
    "style": style
  }, [_createVNode(Button, {
    "type": "primary",
    "size": "small",
    "disabled": disabled || !rightActive,
    "onClick": moveToRight,
    "icon": direction !== 'rtl' ? _createVNode(RightOutlined, null, null) : _createVNode(LeftOutlined, null, null)
  }, {
    default: () => [rightArrowText]
  }), !oneWay && _createVNode(Button, {
    "type": "primary",
    "size": "small",
    "disabled": disabled || !leftActive,
    "onClick": moveToLeft,
    "icon": direction !== 'rtl' ? _createVNode(LeftOutlined, null, null) : _createVNode(RightOutlined, null, null)
  }, {
    default: () => [leftArrowText]
  })]);
};
Operation.displayName = 'Operation';
Operation.inheritAttrs = false;
export default Operation;