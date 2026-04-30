import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import Cell from '../Cell';
import { useInjectTable } from '../context/TableContext';
import { getCellFixedInfo } from '../utils/fixUtil';
import { getColumnsKey } from '../utils/valueUtil';
import DragHandleVue from './DragHandle';
export default defineComponent({
  name: 'HeaderRow',
  props: ['cells', 'stickyOffsets', 'flattenColumns', 'rowComponent', 'cellComponent', 'index', 'customHeaderRow'],
  setup(props) {
    const tableContext = useInjectTable();
    return () => {
      const {
        prefixCls,
        direction
      } = tableContext;
      const {
        cells,
        stickyOffsets,
        flattenColumns,
        rowComponent: RowComponent,
        cellComponent: CellComponent,
        customHeaderRow,
        index
      } = props;
      let rowProps;
      if (customHeaderRow) {
        rowProps = customHeaderRow(cells.map(cell => cell.column), index);
      }
      const columnsKey = getColumnsKey(cells.map(cell => cell.column));
      return _createVNode(RowComponent, rowProps, {
        default: () => [cells.map((cell, cellIndex) => {
          const {
            column
          } = cell;
          const fixedInfo = getCellFixedInfo(cell.colStart, cell.colEnd, flattenColumns, stickyOffsets, direction);
          let additionalProps;
          if (column && column.customHeaderCell) {
            additionalProps = cell.column.customHeaderCell(column);
          }
          const col = column;
          return _createVNode(Cell, _objectSpread(_objectSpread(_objectSpread({}, cell), {}, {
            "cellType": "header",
            "ellipsis": column.ellipsis,
            "align": column.align,
            "component": CellComponent,
            "prefixCls": prefixCls,
            "key": columnsKey[cellIndex]
          }, fixedInfo), {}, {
            "additionalProps": additionalProps,
            "rowType": "header",
            "column": column
          }), {
            default: () => column.title,
            dragHandle: () => col.resizable ? _createVNode(DragHandleVue, {
              "prefixCls": prefixCls,
              "width": col.width,
              "minWidth": col.minWidth,
              "maxWidth": col.maxWidth,
              "column": col
            }, null) : null
          });
        })]
      });
    };
  }
});