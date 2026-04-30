import { computed, defineComponent, onBeforeUnmount, watchEffect } from 'vue';
import { useInjectTable } from '../context/TableContext';
let indexGuid = 0;
const Summary = defineComponent({
  name: 'TableSummary',
  props: ['fixed'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const tableContext = useInjectTable();
    const uniKey = `table-summary-uni-key-${++indexGuid}`;
    const fixed = computed(() => props.fixed === '' || props.fixed);
    watchEffect(() => {
      tableContext.summaryCollect(uniKey, fixed.value);
    });
    onBeforeUnmount(() => {
      tableContext.summaryCollect(uniKey, false);
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export default Summary;