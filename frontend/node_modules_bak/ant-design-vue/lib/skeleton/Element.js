"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skeletonElementProps = exports.default = void 0;
var _vue = require("vue");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
const skeletonElementProps = () => ({
  prefixCls: String,
  size: [String, Number],
  shape: String,
  active: {
    type: Boolean,
    default: undefined
  }
});
exports.skeletonElementProps = skeletonElementProps;
const Element = props => {
  const {
    prefixCls,
    size,
    shape
  } = props;
  const sizeCls = (0, _classNames.default)({
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-sm`]: size === 'small'
  });
  const shapeCls = (0, _classNames.default)({
    [`${prefixCls}-circle`]: shape === 'circle',
    [`${prefixCls}-square`]: shape === 'square',
    [`${prefixCls}-round`]: shape === 'round'
  });
  const sizeStyle = typeof size === 'number' ? {
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: `${size}px`
  } : {};
  return (0, _vue.createVNode)("span", {
    "class": (0, _classNames.default)(prefixCls, sizeCls, shapeCls),
    "style": sizeStyle
  }, null);
};
Element.displayName = 'SkeletonElement';
var _default = exports.default = Element;