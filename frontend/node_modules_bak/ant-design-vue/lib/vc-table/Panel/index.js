"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
function Panel(_, _ref) {
  let {
    slots
  } = _ref;
  var _a;
  return (0, _vue.createVNode)("div", null, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
}
Panel.displayName = 'Panel';
var _default = exports.default = Panel;