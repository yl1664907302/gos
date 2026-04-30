"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatStrategyValues = formatStrategyValues;
exports.toPathOptions = toPathOptions;
var _commonUtil = require("./commonUtil");
function formatStrategyValues(pathKeys, keyPathEntities, showCheckedStrategy) {
  const valueSet = new Set(pathKeys);
  return pathKeys.filter(key => {
    const entity = keyPathEntities[key];
    const parent = entity ? entity.parent : null;
    const children = entity ? entity.children : null;
    return showCheckedStrategy === _commonUtil.SHOW_CHILD ? !(children && children.some(child => child.key && valueSet.has(child.key))) : !(parent && !parent.node.disabled && valueSet.has(parent.key));
  });
}
function toPathOptions(valueCells, options, fieldNames) {
  let stringMode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var _a;
  let currentList = options;
  const valueOptions = [];
  for (let i = 0; i < valueCells.length; i += 1) {
    const valueCell = valueCells[i];
    const foundIndex = currentList === null || currentList === void 0 ? void 0 : currentList.findIndex(option => {
      const val = option[fieldNames.value];
      return stringMode ? String(val) === String(valueCell) : val === valueCell;
    });
    const foundOption = foundIndex !== -1 ? currentList === null || currentList === void 0 ? void 0 : currentList[foundIndex] : null;
    valueOptions.push({
      value: (_a = foundOption === null || foundOption === void 0 ? void 0 : foundOption[fieldNames.value]) !== null && _a !== void 0 ? _a : valueCell,
      index: foundIndex,
      option: foundOption
    });
    currentList = foundOption === null || foundOption === void 0 ? void 0 : foundOption[fieldNames.children];
  }
  return valueOptions;
}