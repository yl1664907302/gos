"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseColor = parseColor;
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _colors = require("../_util/colors");
function parseColor(prefixCls, color) {
  const isInternalColor = (0, _colors.isPresetColor)(color);
  const className = (0, _classNames.default)({
    [`${prefixCls}-${color}`]: color && isInternalColor
  });
  const overlayStyle = {};
  const arrowStyle = {};
  if (color && !isInternalColor) {
    overlayStyle.background = color;
    // @ts-ignore
    arrowStyle['--antd-arrow-background-color'] = color;
  }
  return {
    className,
    overlayStyle,
    arrowStyle
  };
}