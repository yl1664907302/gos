import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import Button from '../button';
const PickerButton = (props, _ref) => {
  let {
    attrs,
    slots
  } = _ref;
  return _createVNode(Button, _objectSpread(_objectSpread({
    "size": "small",
    "type": "primary"
  }, props), attrs), slots);
};
export default PickerButton;