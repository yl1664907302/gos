"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkboxProps = exports.checkboxGroupProps = exports.abstractCheckboxProps = exports.abstractCheckboxGroupProps = exports.CheckboxGroupContextKey = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
const abstractCheckboxGroupProps = () => {
  return {
    name: String,
    prefixCls: String,
    options: (0, _type.arrayType)([]),
    disabled: Boolean,
    id: String
  };
};
exports.abstractCheckboxGroupProps = abstractCheckboxGroupProps;
const checkboxGroupProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, abstractCheckboxGroupProps()), {
    defaultValue: (0, _type.arrayType)(),
    value: (0, _type.arrayType)(),
    onChange: (0, _type.functionType)(),
    'onUpdate:value': (0, _type.functionType)()
  });
};
exports.checkboxGroupProps = checkboxGroupProps;
const abstractCheckboxProps = () => {
  return {
    prefixCls: String,
    defaultChecked: (0, _type.booleanType)(),
    checked: (0, _type.booleanType)(),
    disabled: (0, _type.booleanType)(),
    isGroup: (0, _type.booleanType)(),
    value: _vueTypes.default.any,
    name: String,
    id: String,
    indeterminate: (0, _type.booleanType)(),
    type: (0, _type.stringType)('checkbox'),
    autofocus: (0, _type.booleanType)(),
    onChange: (0, _type.functionType)(),
    'onUpdate:checked': (0, _type.functionType)(),
    onClick: (0, _type.functionType)(),
    skipGroup: (0, _type.booleanType)(false)
  };
};
exports.abstractCheckboxProps = abstractCheckboxProps;
const checkboxProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, abstractCheckboxProps()), {
    indeterminate: (0, _type.booleanType)(false)
  });
};
exports.checkboxProps = checkboxProps;
const CheckboxGroupContextKey = exports.CheckboxGroupContextKey = Symbol('CheckboxGroupContext');