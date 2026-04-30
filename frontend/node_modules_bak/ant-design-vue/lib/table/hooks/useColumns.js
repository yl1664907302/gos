"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useColumns;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _useSelection = require("./useSelection");
var _vcTable = require("../../vc-table");
var _vnode = require("../../_util/vnode");
function fillSlots(columns, contextSlots) {
  const $slots = contextSlots.value;
  return columns.map(column => {
    var _a;
    if (column === _useSelection.SELECTION_COLUMN || column === _vcTable.EXPAND_COLUMN) return column;
    const cloneColumn = (0, _extends2.default)({}, column);
    const {
      slots = {}
    } = cloneColumn;
    cloneColumn.__originColumn__ = column;
    (0, _devWarning.default)(!('slots' in cloneColumn), 'Table', '`column.slots` is deprecated. Please use `v-slot:headerCell` `v-slot:bodyCell` instead.');
    Object.keys(slots).forEach(key => {
      const name = slots[key];
      if (cloneColumn[key] === undefined && $slots[name]) {
        cloneColumn[key] = $slots[name];
      }
    });
    if (contextSlots.value.headerCell && !((_a = column.slots) === null || _a === void 0 ? void 0 : _a.title)) {
      cloneColumn.title = (0, _vnode.customRenderSlot)(contextSlots.value, 'headerCell', {
        title: column.title,
        column
      }, () => [column.title]);
    }
    if ('children' in cloneColumn && Array.isArray(cloneColumn.children)) {
      cloneColumn.children = fillSlots(cloneColumn.children, contextSlots);
    }
    return cloneColumn;
  });
}
function useColumns(contextSlots) {
  const filledColumns = columns => fillSlots(columns, contextSlots);
  return [filledColumns];
}