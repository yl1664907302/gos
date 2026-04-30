import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from '../_util/vue-types';
import { booleanType, functionType, stringType, arrayType } from '../_util/type';
export const abstractCheckboxGroupProps = () => {
  return {
    name: String,
    prefixCls: String,
    options: arrayType([]),
    disabled: Boolean,
    id: String
  };
};
export const checkboxGroupProps = () => {
  return _extends(_extends({}, abstractCheckboxGroupProps()), {
    defaultValue: arrayType(),
    value: arrayType(),
    onChange: functionType(),
    'onUpdate:value': functionType()
  });
};
export const abstractCheckboxProps = () => {
  return {
    prefixCls: String,
    defaultChecked: booleanType(),
    checked: booleanType(),
    disabled: booleanType(),
    isGroup: booleanType(),
    value: PropTypes.any,
    name: String,
    id: String,
    indeterminate: booleanType(),
    type: stringType('checkbox'),
    autofocus: booleanType(),
    onChange: functionType(),
    'onUpdate:checked': functionType(),
    onClick: functionType(),
    skipGroup: booleanType(false)
  };
};
export const checkboxProps = () => {
  return _extends(_extends({}, abstractCheckboxProps()), {
    indeterminate: booleanType(false)
  });
};
export const CheckboxGroupContextKey = Symbol('CheckboxGroupContext');