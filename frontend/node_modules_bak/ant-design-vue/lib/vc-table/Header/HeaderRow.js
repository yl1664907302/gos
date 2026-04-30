"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Cell = _interopRequireDefault(require("../Cell"));
var _TableContext = require("../context/TableContext");
var _fixUtil = require("../utils/fixUtil");
var _valueUtil = require("../utils/valueUtil");
var _DragHandle = _interopRequireDefault(require("./DragHandle"));
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'HeaderRow',
  props: ['cells', 'stickyOffsets', 'flattenColumns', 'rowComponent', 'cellComponent', 'index', 'customHeaderRow'],
  setup(props) {
    const tableContext = (0, _TableContext.useInjectTable)();
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
      const columnsKey = (0, _valueUtil.getColumnsKey)(cells.map(cell => cell.column));
      return (0, _vue.createVNode)(RowComponent, rowProps, {
        default: () => [cells.map((cell, cellIndex) => {
          const {
            column
          } = cell;
          const fixedInfo = (0, _fixUtil.getCellFixedInfo)(cell.colStart, cell.colEnd, flattenColumns, stickyOffsets, direction);
          let additionalProps;
          if (column && column.customHeaderCell) {
            additionalProps = cell.column.customHeaderCell(column);
          }
          const col = column;
          return (0, _vue.createVNode)(_Cell.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, cell), {}, {
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
            dragHandle: () => col.resizable ? (0, _vue.createVNode)(_DragHandle.default, {
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