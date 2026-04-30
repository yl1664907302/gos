import { createVNode as _createVNode } from "vue";
import Summary from './Summary';
import SummaryRow from './Row';
import SummaryCell from './Cell';
import { computed, defineComponent, reactive, toRef } from 'vue';
import { useProvideSummary } from '../context/SummaryContext';
import { useInjectTable } from '../context/TableContext';
export default defineComponent({
  name: 'TableFooter',
  inheritAttrs: false,
  props: ['stickyOffsets', 'flattenColumns'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const tableContext = useInjectTable();
    useProvideSummary(reactive({
      stickyOffsets: toRef(props, 'stickyOffsets'),
      flattenColumns: toRef(props, 'flattenColumns'),
      scrollColumnIndex: computed(() => {
        const lastColumnIndex = props.flattenColumns.length - 1;
        const scrollColumn = props.flattenColumns[lastColumnIndex];
        return (scrollColumn === null || scrollColumn === void 0 ? void 0 : scrollColumn.scrollbar) ? lastColumnIndex : null;
      })
    }));
    return () => {
      var _a;
      const {
        prefixCls
      } = tableContext;
      return _createVNode("tfoot", {
        "class": `${prefixCls}-summary`
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});
export { SummaryRow, SummaryCell };
export const FooterComponents = Summary;