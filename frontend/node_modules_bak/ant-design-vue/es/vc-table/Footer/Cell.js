import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import Cell from '../Cell';
import { useInjectSummary } from '../context/SummaryContext';
import { useInjectTable } from '../context/TableContext';
import { getCellFixedInfo } from '../utils/fixUtil';
export default defineComponent({
  name: 'ATableSummaryCell',
  props: ['index', 'colSpan', 'rowSpan', 'align'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const tableContext = useInjectTable();
    const summaryContext = useInjectSummary();
    return () => {
      const {
        index,
        colSpan = 1,
        rowSpan,
        align
      } = props;
      const {
        prefixCls,
        direction
      } = tableContext;
      const {
        scrollColumnIndex,
        stickyOffsets,
        flattenColumns
      } = summaryContext;
      const lastIndex = index + colSpan - 1;
      const mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan;
      const fixedInfo = getCellFixedInfo(index, index + mergedColSpan - 1, flattenColumns, stickyOffsets, direction);
      return _createVNode(Cell, _objectSpread({
        "class": attrs.class,
        "index": index,
        "component": "td",
        "prefixCls": prefixCls,
        "record": null,
        "dataIndex": null,
        "align": align,
        "colSpan": mergedColSpan,
        "rowSpan": rowSpan,
        "customRender": () => {
          var _a;
          return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
        }
      }, fixedInfo), null);
    };
  }
});