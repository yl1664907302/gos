"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _treeUtil = require("../utils/treeUtil");
var _commonUtil = require("../utils/commonUtil");
var _vue = require("vue");
var _propsUtil = require("../../_util/props-util");
var _vnode = require("../../_util/vnode");
var _default = (rawValues, options, fieldNames, multiple, displayRender) => {
  return (0, _vue.computed)(() => {
    const mergedDisplayRender = displayRender.value || (
    // Default displayRender
    _ref => {
      let {
        labels
      } = _ref;
      const mergedLabels = multiple.value ? labels.slice(-1) : labels;
      const SPLIT = ' / ';
      if (mergedLabels.every(label => ['string', 'number'].includes(typeof label))) {
        return mergedLabels.join(SPLIT);
      }
      // If exist non-string value, use VueNode instead
      return mergedLabels.reduce((list, label, index) => {
        const keyedLabel = (0, _propsUtil.isValidElement)(label) ? (0, _vnode.cloneElement)(label, {
          key: index
        }) : label;
        if (index === 0) {
          return [keyedLabel];
        }
        return [...list, SPLIT, keyedLabel];
      }, []);
    });
    return rawValues.value.map(valueCells => {
      const valueOptions = (0, _treeUtil.toPathOptions)(valueCells, options.value, fieldNames.value);
      const label = mergedDisplayRender({
        labels: valueOptions.map(_ref2 => {
          let {
            option,
            value
          } = _ref2;
          var _a;
          return (_a = option === null || option === void 0 ? void 0 : option[fieldNames.value.label]) !== null && _a !== void 0 ? _a : value;
        }),
        selectedOptions: valueOptions.map(_ref3 => {
          let {
            option
          } = _ref3;
          return option;
        })
      });
      const value = (0, _commonUtil.toPathKey)(valueCells);
      return {
        label,
        value,
        key: value,
        valueCells
      };
    });
  });
};
exports.default = _default;