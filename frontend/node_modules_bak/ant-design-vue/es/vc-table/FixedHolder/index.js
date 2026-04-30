import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import ColGroup from '../ColGroup';
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, toRef, watchEffect } from 'vue';
import { useInjectTable } from '../context/TableContext';
import classNames from '../../_util/classNames';
import addEventListenerWrap from '../../vc-util/Dom/addEventListener';
function useColumnWidth(colWidthsRef, columCountRef) {
  return computed(() => {
    const cloneColumns = [];
    const colWidths = colWidthsRef.value;
    const columCount = columCountRef.value;
    for (let i = 0; i < columCount; i += 1) {
      const val = colWidths[i];
      if (val !== undefined) {
        cloneColumns[i] = val;
      } else {
        return null;
      }
    }
    return cloneColumns;
  });
}
export default defineComponent({
  name: 'FixedHolder',
  inheritAttrs: false,
  props: ['columns', 'flattenColumns', 'stickyOffsets', 'customHeaderRow', 'noData', 'maxContentScroll', 'colWidths', 'columCount', 'direction', 'fixHeader', 'stickyTopOffset', 'stickyBottomOffset', 'stickyClassName'],
  emits: ['scroll'],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const tableContext = useInjectTable();
    const combinationScrollBarSize = computed(() => tableContext.isSticky && !props.fixHeader ? 0 : tableContext.scrollbarSize);
    const scrollRef = ref();
    const onWheel = e => {
      const {
        currentTarget,
        deltaX
      } = e;
      if (deltaX) {
        emit('scroll', {
          currentTarget,
          scrollLeft: currentTarget.scrollLeft + deltaX
        });
        e.preventDefault();
      }
    };
    const wheelEvent = ref();
    onMounted(() => {
      nextTick(() => {
        wheelEvent.value = addEventListenerWrap(scrollRef.value, 'wheel', onWheel);
      });
    });
    onBeforeUnmount(() => {
      var _a;
      (_a = wheelEvent.value) === null || _a === void 0 ? void 0 : _a.remove();
    });
    // Check if all flattenColumns has width
    const allFlattenColumnsWithWidth = computed(() => props.flattenColumns.every(column => column.width && column.width !== 0 && column.width !== '0px'));
    const columnsWithScrollbar = ref([]);
    const flattenColumnsWithScrollbar = ref([]);
    watchEffect(() => {
      // Add scrollbar column
      const lastColumn = props.flattenColumns[props.flattenColumns.length - 1];
      const ScrollBarColumn = {
        fixed: lastColumn ? lastColumn.fixed : null,
        scrollbar: true,
        customHeaderCell: () => ({
          class: `${tableContext.prefixCls}-cell-scrollbar`
        })
      };
      columnsWithScrollbar.value = combinationScrollBarSize.value ? [...props.columns, ScrollBarColumn] : props.columns;
      flattenColumnsWithScrollbar.value = combinationScrollBarSize.value ? [...props.flattenColumns, ScrollBarColumn] : props.flattenColumns;
    });
    // Calculate the sticky offsets
    const headerStickyOffsets = computed(() => {
      const {
        stickyOffsets,
        direction
      } = props;
      const {
        right,
        left
      } = stickyOffsets;
      return _extends(_extends({}, stickyOffsets), {
        left: direction === 'rtl' ? [...left.map(width => width + combinationScrollBarSize.value), 0] : left,
        right: direction === 'rtl' ? right : [...right.map(width => width + combinationScrollBarSize.value), 0],
        isSticky: tableContext.isSticky
      });
    });
    const mergedColumnWidth = useColumnWidth(toRef(props, 'colWidths'), toRef(props, 'columCount'));
    return () => {
      var _a;
      const {
        noData,
        columCount,
        stickyTopOffset,
        stickyBottomOffset,
        stickyClassName,
        maxContentScroll
      } = props;
      const {
        isSticky
      } = tableContext;
      return _createVNode("div", {
        "style": _extends({
          overflow: 'hidden'
        }, isSticky ? {
          top: `${stickyTopOffset}px`,
          bottom: `${stickyBottomOffset}px`
        } : {}),
        "ref": scrollRef,
        "class": classNames(attrs.class, {
          [stickyClassName]: !!stickyClassName
        })
      }, [_createVNode("table", {
        "style": {
          tableLayout: 'fixed',
          visibility: noData || mergedColumnWidth.value ? null : 'hidden'
        }
      }, [(!noData || !maxContentScroll || allFlattenColumnsWithWidth.value) && _createVNode(ColGroup, {
        "colWidths": mergedColumnWidth.value ? [...mergedColumnWidth.value, combinationScrollBarSize.value] : [],
        "columCount": columCount + 1,
        "columns": flattenColumnsWithScrollbar.value
      }, null), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots, _extends(_extends({}, props), {
        stickyOffsets: headerStickyOffsets.value,
        columns: columnsWithScrollbar.value,
        flattenColumns: flattenColumnsWithScrollbar.value
      }))])]);
    };
  }
});