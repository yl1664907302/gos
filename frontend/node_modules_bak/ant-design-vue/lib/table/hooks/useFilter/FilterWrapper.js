"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _KeyCode = _interopRequireDefault(require("../../../_util/KeyCode"));
const onKeyDown = event => {
  const {
    keyCode
  } = event;
  if (keyCode === _KeyCode.default.ENTER) {
    event.stopPropagation();
  }
};
const FilterDropdownMenuWrapper = (_props, _ref) => {
  let {
    slots
  } = _ref;
  var _a;
  return (0, _vue.createVNode)("div", {
    "onClick": e => e.stopPropagation(),
    "onKeydown": onKeyDown
  }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
};
var _default = exports.default = FilterDropdownMenuWrapper;