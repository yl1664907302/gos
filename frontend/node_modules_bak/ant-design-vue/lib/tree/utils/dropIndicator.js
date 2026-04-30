"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dropIndicatorRender;
exports.offset = void 0;
var _vue = require("vue");
const offset = exports.offset = 4;
function dropIndicatorRender(props) {
  const {
    dropPosition,
    dropLevelOffset,
    prefixCls,
    indent,
    direction = 'ltr'
  } = props;
  const startPosition = direction === 'ltr' ? 'left' : 'right';
  const endPosition = direction === 'ltr' ? 'right' : 'left';
  const style = {
    [startPosition]: `${-dropLevelOffset * indent + offset}px`,
    [endPosition]: 0
  };
  switch (dropPosition) {
    case -1:
      style.top = `${-3}px`;
      break;
    case 1:
      style.bottom = `${-3}px`;
      break;
    default:
      // dropPosition === 0
      style.bottom = `${-3}px`;
      style[startPosition] = `${indent + offset}px`;
      break;
  }
  return (0, _vue.createVNode)("div", {
    "style": style,
    "class": `${prefixCls}-drop-indicator`
  }, null);
}