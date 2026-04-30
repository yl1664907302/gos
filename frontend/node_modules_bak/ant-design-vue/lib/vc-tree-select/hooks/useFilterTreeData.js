"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _legacyUtil = require("../utils/legacyUtil");
var _default = (treeData, searchValue, _ref) => {
  let {
    treeNodeFilterProp,
    filterTreeNode,
    fieldNames
  } = _ref;
  return (0, _vue.computed)(() => {
    const {
      children: fieldChildren
    } = fieldNames.value;
    const searchValueVal = searchValue.value;
    const treeNodeFilterPropValue = treeNodeFilterProp === null || treeNodeFilterProp === void 0 ? void 0 : treeNodeFilterProp.value;
    if (!searchValueVal || filterTreeNode.value === false) {
      return treeData.value;
    }
    let filterOptionFunc;
    if (typeof filterTreeNode.value === 'function') {
      filterOptionFunc = filterTreeNode.value;
    } else {
      const upperStr = searchValueVal.toUpperCase();
      filterOptionFunc = (_, dataNode) => {
        const value = dataNode[treeNodeFilterPropValue];
        return String(value).toUpperCase().includes(upperStr);
      };
    }
    function dig(list) {
      let keepAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const res = [];
      for (let index = 0, len = list.length; index < len; index++) {
        const dataNode = list[index];
        const children = dataNode[fieldChildren];
        const match = keepAll || filterOptionFunc(searchValueVal, (0, _legacyUtil.fillLegacyProps)(dataNode));
        const childList = dig(children || [], match);
        if (match || childList.length) {
          res.push((0, _extends2.default)((0, _extends2.default)({}, dataNode), {
            [fieldChildren]: childList
          }));
        }
      }
      return res;
    }
    return dig(treeData.value);
  });
};
exports.default = _default;