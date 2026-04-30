import { createVNode as _createVNode } from "vue";
import classNames from '../../_util/classNames';
import { computed, defineComponent } from 'vue';
import { useInjectTable } from '../context/TableContext';
import HeaderRow from './HeaderRow';
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
        class: classNames(column.className, column.class),
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
export default defineComponent({
  name: 'TableHeader',
  inheritAttrs: false,
  props: ['columns', 'flattenColumns', 'stickyOffsets', 'customHeaderRow'],
  setup(props) {
    const tableContext = useInjectTable();
    const rows = computed(() => parseHeaderRows(props.columns));
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
      return _createVNode(WrapperComponent, {
        "class": `${prefixCls}-thead`
      }, {
        default: () => [rows.value.map((row, rowIndex) => {
          const rowNode = _createVNode(HeaderRow, {
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