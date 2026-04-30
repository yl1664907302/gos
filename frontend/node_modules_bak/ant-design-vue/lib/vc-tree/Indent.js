"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
const Indent = _ref => {
  let {
    prefixCls,
    level,
    isStart,
    isEnd
  } = _ref;
  const baseClassName = `${prefixCls}-indent-unit`;
  const list = [];
  for (let i = 0; i < level; i += 1) {
    list.push((0, _vue.createVNode)("span", {
      "key": i,
      "class": {
        [baseClassName]: true,
        [`${baseClassName}-start`]: isStart[i],
        [`${baseClassName}-end`]: isEnd[i]
      }
    }, null));
  }
  return (0, _vue.createVNode)("span", {
    "aria-hidden": "true",
    "class": `${prefixCls}-indent`
  }, [list]);
};
var _default = exports.default = Indent;