"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _treeUtil = require("../../vc-tree/utils/treeUtil");
var _commonUtil = require("../utils/commonUtil");
var _vue = require("vue");
/** Lazy parse options data into conduct-able info to avoid perf issue in single mode */
var _default = (options, fieldNames) => {
  const entities = (0, _vue.computed)(() => {
    return (0, _treeUtil.convertDataToEntities)(options.value, {
      fieldNames: fieldNames.value,
      initWrapper: wrapper => (0, _extends2.default)((0, _extends2.default)({}, wrapper), {
        pathKeyEntities: {}
      }),
      processEntity: (entity, wrapper) => {
        const pathKey = entity.nodes.map(node => node[fieldNames.value.value]).join(_commonUtil.VALUE_SPLIT);
        wrapper.pathKeyEntities[pathKey] = entity;
        // Overwrite origin key.
        // this is very hack but we need let conduct logic work with connect path
        entity.key = pathKey;
      }
    }).pathKeyEntities;
  });
  return entities;
};
exports.default = _default;