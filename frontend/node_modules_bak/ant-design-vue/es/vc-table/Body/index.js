import { createVNode as _createVNode } from "vue";
import ExpandedRow from './ExpandedRow';
import { getColumnsKey } from '../utils/valueUtil';
import MeasureCell from './MeasureCell';
import BodyRow from './BodyRow';
import useFlattenRecords from '../hooks/useFlattenRecords';
import { defineComponent, shallowRef, toRef } from 'vue';
import { useInjectResize } from '../context/ResizeContext';
import { useInjectTable } from '../context/TableContext';
import { useInjectBody } from '../context/BodyContext';
import { useProvideHover } from '../context/HoverContext';
export default defineComponent({
  name: 'TableBody',
  props: ['data', 'getRowKey', 'measureColumnWidth', 'expandedKeys', 'customRow', 'rowExpandable', 'childrenColumnName'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const resizeContext = useInjectResize();
    const tableContext = useInjectTable();
    const bodyContext = useInjectBody();
    const flattenData = useFlattenRecords(toRef(props, 'data'), toRef(props, 'childrenColumnName'), toRef(props, 'expandedKeys'), toRef(props, 'getRowKey'));
    const startRow = shallowRef(-1);
    const endRow = shallowRef(-1);
    let timeoutId;
    useProvideHover({
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
          return _createVNode(BodyRow, {
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
        rows = _createVNode(ExpandedRow, {
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
      const columnsKey = getColumnsKey(flattenColumns);
      return _createVNode(WrapperComponent, {
        "class": `${prefixCls}-tbody`
      }, {
        default: () => [measureColumnWidth && _createVNode("tr", {
          "aria-hidden": "true",
          "class": `${prefixCls}-measure-row`,
          "style": {
            height: 0,
            fontSize: 0
          }
        }, [columnsKey.map(columnKey => _createVNode(MeasureCell, {
          "key": columnKey,
          "columnKey": columnKey,
          "onColumnResize": onColumnResize
        }, null))]), rows]
      });
    };
  }
});