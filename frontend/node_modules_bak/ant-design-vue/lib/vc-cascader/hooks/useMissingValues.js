"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _treeUtil = require("../utils/treeUtil");
var _default = (options, fieldNames, rawValues) => {
  return (0, _vue.computed)(() => {
    const missingValues = [];
    const existsValues = [];
    rawValues.value.forEach(valueCell => {
      const pathOptions = (0, _treeUtil.toPathOptions)(valueCell, options.value, fieldNames.value);
      if (pathOptions.every(opt => opt.option)) {
        existsValues.push(valueCell);
      } else {
        missingValues.push(valueCell);
      }
    });
    return [existsValues, missingValues];
  });
};
exports.default = _default;