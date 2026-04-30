"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.floatButtonProps = exports.floatButtonGroupProps = exports.floatButtonContentProps = exports.backTopProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
const floatButtonProps = () => {
  return {
    prefixCls: String,
    description: _vueTypes.default.any,
    type: (0, _type.stringType)('default'),
    shape: (0, _type.stringType)('circle'),
    tooltip: _vueTypes.default.any,
    href: String,
    target: String,
    badge: (0, _type.objectType)(),
    onClick: (0, _type.functionType)()
  };
};
exports.floatButtonProps = floatButtonProps;
const floatButtonContentProps = () => {
  return {
    prefixCls: (0, _type.stringType)()
  };
};
exports.floatButtonContentProps = floatButtonContentProps;
const floatButtonGroupProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, floatButtonProps()), {
    // 包含的 Float Button
    // 触发方式 (有触发方式为菜单模式）
    trigger: (0, _type.stringType)(),
    // 受控展开
    open: (0, _type.booleanType)(),
    // 展开收起的回调
    onOpenChange: (0, _type.functionType)(),
    'onUpdate:open': (0, _type.functionType)()
  });
};
exports.floatButtonGroupProps = floatButtonGroupProps;
const backTopProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, floatButtonProps()), {
    prefixCls: String,
    duration: Number,
    target: (0, _type.functionType)(),
    visibilityHeight: Number,
    onClick: (0, _type.functionType)()
  });
};
exports.backTopProps = backTopProps;