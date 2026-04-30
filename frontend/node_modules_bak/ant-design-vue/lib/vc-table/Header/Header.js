"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _TableContext = require("../context/TableContext");
var _HeaderRow = _interopRequireDefault(require("./HeaderRow"));
function parseHeaderRows(rootColumns) {
  const rows = [];
  function fillRowCells(columns, colIndex) {
    let rowIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    // Init rows
    rows[rowIndex] = rows[rowIndex] || [];
    let currentColIndex = colIndex;
    const colSpans = columns.filter(Boolean).map(column => {
      const cell = {
        key: column.key,
        class: (0, _classNames.default)(column.className, column.class),
        // children: column.title,
        column,
        colStart: currentColIndex
      };
      let colSpan = 1;
      const subColumns = column.children;
      if (subColumns && subColumns.length > 0) {
        colSpan = fillRowCells(subColumns, currentColIndex, rowIndex + 1).reduce((total, count) => total + count, 0);
        cell.hasSubColumns = true;
      }
      if ('colSpan' in column) {
        ({
          colSpan
        } = column);
      }
      if ('rowSpan' in column) {
        cell.rowSpan = column.rowSpan;
      }
      cell.colSpan = colSpan;
      cell.colEnd = cell.colStart + colSpan - 1;
      rows[rowIndex].push(cell);
      currentColIndex += colSpan;
      return colSpan;
    });
    return colSpans;
  }
  // Generate `rows` cell data
  fillRowCells(rootColumns, 0);
  // Handle `rowSpan`
  const rowCount = rows.length;
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    rows[rowIndex].forEach(cell => {
      if (!('rowSpan' in cell) && !cell.hasSubColumns) {
        // eslint-disable-next-line no-param-reassign
        cell.rowSpan = rowCount - rowIndex;
      }
    });
  }
  return rows;
}
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'TableHeader',
  inheritAttrs: false,
  props: ['columns', 'flattenColumns', 'stickyOffsets', 'customHeaderRow'],
  setup(props) {
    const tableContext = (0, _TableContext.useInjectTable)();
    const rows = (0, _vue.computed)(() => parseHeaderRows(props.columns));
    return () => {
      const {
        prefixCls,
        getComponent
      } = tableContext;
      const {
        stickyOffsets,
        flattenColumns,
        customHeaderRow
      } = props;
      const WrapperComponent = getComponent(['header', 'wrapper'], 'thead');
      const trComponent = getComponent(['header', 'row'], 'tr');
      const thComponent = getComponent(['header', 'cell'], 'th');
      return (0, _vue.createVNode)(WrapperComponent, {
        "class": `${prefixCls}-thead`
      }, {
        default: () => [rows.value.map((row, rowIndex) => {
          const rowNode = (0, _vue.createVNode)(_HeaderRow.default, {
            "key": rowIndex,
            "flattenColumns": flattenColumns,
            "cells": row,
            "stickyOffsets": stickyOffsets,
            "rowComponent": trComponent,
            "cellComponent": thComponent,
            "customHeaderRow": customHeaderRow,
            "index": rowIndex
          }, null);
          return rowNode;
        })]
      });
    };
  }
});