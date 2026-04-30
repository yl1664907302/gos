"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
/* eslint-disable */
const Track = (_, _ref) => {
  let {
    attrs
  } = _ref;
  const {
    included,
    vertical,
    style,
    class: className
  } = attrs;
  let {
    length,
    offset,
    reverse
  } = attrs;
  if (length < 0) {
    reverse = !reverse;
    length = Math.abs(length);
    offset = 100 - offset;
  }
  const positionStyle = vertical ? {
    [reverse ? 'top' : 'bottom']: `${offset}%`,
    [reverse ? 'bottom' : 'top']: 'auto',
    height: `${length}%`
  } : {
    [reverse ? 'right' : 'left']: `${offset}%`,
    [reverse ? 'left' : 'right']: 'auto',
    width: `${length}%`
  };
  const elStyle = (0, _extends2.default)((0, _extends2.default)({}, style), positionStyle);
  return included ? (0, _vue.createVNode)("div", {
    "class": className,
    "style": elStyle
  }, null) : null;
};
Track.inheritAttrs = false;
var _default = exports.default = Track;