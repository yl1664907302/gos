"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vnode = require("../vnode");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'RenderSlot',
  setup(_props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      return (0, _vnode.customRenderSlot)(slots, 'default', {}, () => ['default value']);
    };
  }
});