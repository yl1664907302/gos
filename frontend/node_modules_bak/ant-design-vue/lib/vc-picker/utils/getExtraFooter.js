"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getExtraFooter;
var _vue = require("vue");
function getExtraFooter(prefixCls, mode, renderExtraFooter) {
  if (!renderExtraFooter) {
    return null;
  }
  return (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-footer-extra`
  }, [renderExtraFooter(mode)]);
}