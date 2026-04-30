"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTitleColumns;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _util = require("../util");
function fillTitle(columns, columnTitleProps) {
  return columns.map(column => {
    const cloneColumn = (0, _extends2.default)({}, column);
    cloneColumn.title = (0, _util.renderColumnTitle)(cloneColumn.title, columnTitleProps);
    if ('children' in cloneColumn) {
      cloneColumn.children = fillTitle(cloneColumn.children, columnTitleProps);
    }
    return cloneColumn;
  });
}
function useTitleColumns(columnTitleProps) {
  const filledColumns = columns => fillTitle(columns, columnTitleProps.value);
  return [filledColumns];
}