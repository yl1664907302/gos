import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from '../_util/vue-types';
import { stringType, booleanType, functionType, objectType } from '../_util/type';
export const floatButtonProps = () => {
  return {
    prefixCls: String,
    description: PropTypes.any,
    type: stringType('default'),
    shape: stringType('circle'),
    tooltip: PropTypes.any,
    href: String,
    target: String,
    badge: objectType(),
    onClick: functionType()
  };
};
export const floatButtonContentProps = () => {
  return {
    prefixCls: stringType()
  };
};
export const floatButtonGroupProps = () => {
  return _extends(_extends({}, floatButtonProps()), {
    // 包含的 Float Button
    // 触发方式 (有触发方式为菜单模式）
    trigger: stringType(),
    // 受控展开
    open: booleanType(),
    // 展开收起的回调
    onOpenChange: functionType(),
    'onUpdate:open': functionType()
  });
};
export const backTopProps = () => {
  return _extends(_extends({}, floatButtonProps()), {
    prefixCls: String,
    duration: Number,
    target: functionType(),
    visibilityHeight: Number,
    onClick: functionType()
  });
};