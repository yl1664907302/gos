"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _treeUtil = require("../../vc-tree/utils/treeUtil");
var _valueUtil = require("../utils/valueUtil");
var _vue = require("vue");
var _warning = require("../../vc-util/warning");
var _default = (treeData, fieldNames) => {
  const valueEntities = (0, _vue.shallowRef)(new Map());
  const keyEntities = (0, _vue.shallowRef)({});
  (0, _vue.watchEffect)(() => {
    const fieldNamesValue = fieldNames.value;
    const collection = (0, _treeUtil.convertDataToEntities)(treeData.value, {
      fieldNames: fieldNamesValue,
      initWrapper: wrapper => (0, _extends2.default)((0, _extends2.default)({}, wrapper), {
        valueEntities: new Map()
      }),
      processEntity: (entity, wrapper) => {
        const val = entity.node[fieldNamesValue.value];
        // Check if exist same value
        if (process.env.NODE_ENV !== 'production') {
          const key = entity.node.key;
          (0, _warning.warning)(!(0, _valueUtil.isNil)(val), 'TreeNode `value` is invalidate: undefined');
          (0, _warning.warning)(!wrapper.valueEntities.has(val), `Same \`value\` exist in the tree: ${val}`);
          (0, _warning.warning)(!key || String(key) === String(val), `\`key\` or \`value\` with TreeNode must be the same or you can remove one of them. key: ${key}, value: ${val}.`);
        }
        wrapper.valueEntities.set(val, entity);
      }
    });
    valueEntities.value = collection.valueEntities;
    keyEntities.value = collection.keyEntities;
  });
  return {
    valueEntities,
    keyEntities
  };
};
exports.default = _default;