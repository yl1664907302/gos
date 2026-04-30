"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionProps = exports.optionOptions = exports.default = exports.baseOptionsProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _type = require("../../_util/type");
var _vue = require("vue");
const baseOptionsProps = exports.baseOptionsProps = {
  value: String,
  disabled: Boolean,
  payload: (0, _type.objectType)()
};
const optionProps = exports.optionProps = (0, _extends2.default)((0, _extends2.default)({}, baseOptionsProps), {
  label: (0, _type.anyType)([])
});
const optionOptions = exports.optionOptions = {
  name: 'Option',
  props: optionProps,
  render(_props, _ref) {
    let {
      slots
    } = _ref;
    var _a;
    return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
  }
};
var _default = exports.default = (0, _vue.defineComponent)((0, _extends2.default)({
  compatConfig: {
    MODE: 3
  }
}, optionOptions));