"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _ExpandedRow = _interopRequireDefault(require("./ExpandedRow"));
var _valueUtil = require("../utils/valueUtil");
var _MeasureCell = _interopRequireDefault(require("./MeasureCell"));
var _BodyRow = _interopRequireDefault(require("./BodyRow"));
var _useFlattenRecords = _interopRequireDefault(require("../hooks/useFlattenRecords"));
var _ResizeContext = require("../context/ResizeContext");
var _TableContext = require("../context/TableContext");
var _BodyContext = require("../context/BodyContext");
var _HoverContext = require("../context/HoverContext");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'TableBody',
  props: ['data', 'getRowKey', 'measureColumnWidth', 'expandedKeys', 'customRow', 'rowExpandable', 'childrenColumnName'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const resizeContext = (0, _ResizeContext.useInjectResize)();
    const tableContext = (0, _TableContext.useInjectTable)();
    const bodyContext = (0, _BodyContext.useInjectBody)();
    const flattenData = (0, _useFlattenRecords.default)((0, _vue.toRef)(props, 'data'), (0, _vue.toRef)(props, 'childrenColumnName'), (0, _vue.toRef)(props, 'expandedKeys'), (0, _vue.toRef)(props, 'getRowKey'));
    const startRow = (0, _vue.shallowRef)(-1);
    const endRow = (0, _vue.shallowRef)(-1);
    let timeoutId;
    (0, _HoverContext.useProvideHover)({
      startRow,
      endRow,
      onHover: (start, end) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          startRow.value = start;
          endRow.value = end;
        }, 100);
      }
    });
    return () => {
      var _a;
      const {
        data,
        getRowKey,
        measureColumnWidth,
        expandedKeys,
        customRow,
        rowExpandable,
        childrenColumnName
      } = props;
      const {
        onColumnResize
      } = resizeContext;
      const {
        prefixCls,
        getComponent
      } = tableContext;
      const {
        flattenColumns
      } = bodyContext;
      const WrapperComponent = getComponent(['body', 'wrapper'], 'tbody');
      const trComponent = getComponent(['body', 'row'], 'tr');
      const tdComponent = getComponent(['body', 'cell'], 'td');
      let rows;
      if (data.length) {
        rows = flattenData.value.map((item, idx) => {
          const {
            record,
            indent,
            index: renderIndex
          } = item;
          const key = getRowKey(record, idx);
          return (0, _vue.createVNode)(_BodyRow.default, {
            "key": key,
            "rowKey": key,
            "record": record,
            "recordKey": key,
            "index": idx,
            "renderIndex": renderIndex,
            "rowComponent": trComponent,
            "cellComponent": tdComponent,
            "expandedKeys": expandedKeys,
            "customRow": customRow,
            "getRowKey": getRowKey,
            "rowExpandable": rowExpandable,
            "childrenColumnName": childrenColumnName,
            "indent": indent
          }, null);
        });
      } else {
        rows = (0, _vue.createVNode)(_ExpandedRow.default, {
          "expanded": true,
          "class": `${prefixCls}-placeholder`,
          "prefixCls": prefixCls,
          "component": trComponent,
          "cellComponent": tdComponent,
          "colSpan": flattenColumns.length,
          "isEmpty": true
        }, {
          default: () => [(_a = slots.emptyNode) === null || _a === void 0 ? void 0 : _a.call(slots)]
        });
      }
      const columnsKey = (0, _valueUtil.getColumnsKey)(flattenColumns);
      return (0, _vue.createVNode)(WrapperComponent, {
        "class": `${prefixCls}-tbody`
      }, {
        default: () => [measureColumnWidth && (0, _vue.createVNode)("tr", {
          "aria-hidden": "true",
          "class": `${prefixCls}-measure-row`,
          "style": {
            height: 0,
            fontSize: 0
          }
        }, [columnsKey.map(columnKey => (0, _vue.createVNode)(_MeasureCell.default, {
          "key": columnKey,
          "columnKey": columnKey,
          "onColumnResize": onColumnResize
        }, null))]), rows]
      });
    };
  }
});