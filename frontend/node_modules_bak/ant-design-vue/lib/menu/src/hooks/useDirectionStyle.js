"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useDirectionStyle;
var _vue = require("vue");
var _useMenuContext = require("./useMenuContext");
function useDirectionStyle(level) {
  const {
    mode,
    rtl,
    inlineIndent
  } = (0, _useMenuContext.useInjectMenu)();
  return (0, _vue.computed)(() => mode.value !== 'inline' ? null : rtl.value ? {
    paddingRight: `${level.value * inlineIndent.value}px`
  } : {
    paddingLeft: `${level.value * inlineIndent.value}px`
  });
}