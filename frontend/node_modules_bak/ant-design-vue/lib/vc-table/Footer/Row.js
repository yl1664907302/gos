"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATableSummaryRow',
  setup(_props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return (0, _vue.createVNode)("tr", null, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});