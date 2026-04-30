"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideHover = exports.useInjectHover = exports.HoverContextKey = void 0;
var _vue = require("vue");
const HoverContextKey = exports.HoverContextKey = Symbol('HoverContextProps');
const useProvideHover = props => {
  (0, _vue.provide)(HoverContextKey, props);
};
exports.useProvideHover = useProvideHover;
const useInjectHover = () => {
  return (0, _vue.inject)(HoverContextKey, {
    startRow: (0, _vue.shallowRef)(-1),
    endRow: (0, _vue.shallowRef)(-1),
    onHover() {}
  });
};
exports.useInjectHover = useInjectHover;