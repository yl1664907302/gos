"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTreeData;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _legacyUtil = require("../utils/legacyUtil");
function parseSimpleTreeData(treeData, _ref) {
  let {
    id,
    pId,
    rootPId
  } = _ref;
  const keyNodes = {};
  const rootNodeList = [];
  // Fill in the map
  const nodeList = treeData.map(node => {
    const clone = (0, _extends2.default)({}, node);
    const key = clone[id];
    keyNodes[key] = clone;
    clone.key = clone.key || key;
    return clone;
  });
  // Connect tree
  nodeList.forEach(node => {
    const parentKey = node[pId];
    const parent = keyNodes[parentKey];
    // Fill parent
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(node);
    }
    // Fill root tree node
    if (parentKey === rootPId || !parent && rootPId === null) {
      rootNodeList.push(node);
    }
  });
  return rootNodeList;
}
/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
function useTreeData(treeData, children, simpleMode) {
  const mergedTreeData = (0, _vue.shallowRef)();
  (0, _vue.watch)([simpleMode, treeData, children], () => {
    const simpleModeValue = simpleMode.value;
    if (treeData.value) {
      mergedTreeData.value = simpleMode.value ? parseSimpleTreeData((0, _vue.toRaw)(treeData.value), (0, _extends2.default)({
        id: 'id',
        pId: 'pId',
        rootPId: null
      }, simpleModeValue !== true ? simpleModeValue : {})) : (0, _vue.toRaw)(treeData.value).slice();
    } else {
      mergedTreeData.value = (0, _legacyUtil.convertChildrenToData)((0, _vue.toRaw)(children.value));
    }
  }, {
    immediate: true,
    deep: true
  });
  return mergedTreeData;
}