"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textAreaProps = exports.inputDefaultValue = exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _type = require("../_util/type");
var _inputProps = require("../vc-input/inputProps");
const inputDefaultValue = exports.inputDefaultValue = Symbol();
const inputProps = () => {
  return (0, _omit.default)((0, _inputProps.inputProps)(), ['wrapperClassName', 'groupClassName', 'inputClassName', 'affixWrapperClassName']);
};
var _default = exports.default = inputProps;
const textAreaProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)(inputProps(), ['prefix', 'addonBefore', 'addonAfter', 'suffix'])), {
  rows: Number,
  autosize: {
    type: [Boolean, Object],
    default: undefined
  },
  autoSize: {
    type: [Boolean, Object],
    default: undefined
  },
  onResize: {
    type: Function
  },
  onCompositionstart: (0, _type.eventType)(),
  onCompositionend: (0, _type.eventType)(),
  valueModifiers: Object
});
exports.textAreaProps = textAreaProps;