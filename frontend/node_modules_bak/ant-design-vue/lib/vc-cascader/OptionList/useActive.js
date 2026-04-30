"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _context = require("../context");
var _vue = require("vue");
var _vcSelect = require("../../vc-select");
var _useState = _interopRequireDefault(require("../../_util/hooks/useState"));
/**
 * Control the active open options path.
 */
var _default = () => {
  const baseProps = (0, _vcSelect.useBaseProps)();
  const {
    values
  } = (0, _context.useInjectCascader)();
  // Record current dropdown active options
  // This also control the open status
  const [activeValueCells, setActiveValueCells] = (0, _useState.default)([]);
  (0, _vue.watch)(() => baseProps.open, () => {
    if (baseProps.open && !baseProps.multiple) {
      const firstValueCells = values.value[0];
      setActiveValueCells(firstValueCells || []);
    }
  }, {
    immediate: true
  });
  return [activeValueCells, setActiveValueCells];
};
exports.default = _default;