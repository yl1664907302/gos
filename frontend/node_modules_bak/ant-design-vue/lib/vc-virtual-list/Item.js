"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _propsUtil = require("../_util/props-util");
const Item = (_ref, _ref2) => {
  let {
    setRef
  } = _ref;
  let {
    slots
  } = _ref2;
  var _a;
  const children = (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
  return children && children.length ? (0, _vue.cloneVNode)(children[0], {
    ref: setRef
  }) : children;
};
Item.props = {
  setRef: {
    type: Function,
    default: () => {}
  }
};
var _default = exports.default = Item;