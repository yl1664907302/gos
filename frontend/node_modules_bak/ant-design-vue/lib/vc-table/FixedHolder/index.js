"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _ColGroup = _interopRequireDefault(require("../ColGroup"));
var _TableContext = require("../context/TableContext");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _addEventListener = _interopRequireDefault(require("../../vc-util/Dom/addEventListener"));
function useColumnWidth(colWidthsRef, columCountRef) {
  return (0, _vue.computed)(() => {
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
var _default = exports.default = (0, _vue.defineComponent)({
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
    const tableContext = (0, _TableContext.useInjectTable)();
    const combinationScrollBarSize = (0, _vue.computed)(() => tableContext.isSticky && !props.fixHeader ? 0 : tableContext.scrollbarSize);
    const scrollRef = (0, _vue.ref)();
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
    const wheelEvent = (0, _vue.ref)();
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        wheelEvent.value = (0, _addEventListener.default)(scrollRef.value, 'wheel', onWheel);
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      var _a;
      (_a = wheelEvent.value) === null || _a === void 0 ? void 0 : _a.remove();
    });
    // Check if all flattenColumns has width
    const allFlattenColumnsWithWidth = (0, _vue.computed)(() => props.flattenColumns.every(column => column.width && column.width !== 0 && column.width !== '0px'));
    const columnsWithScrollbar = (0, _vue.ref)([]);
    const flattenColumnsWithScrollbar = (0, _vue.ref)([]);
    (0, _vue.watchEffect)(() => {
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
    const headerStickyOffsets = (0, _vue.computed)(() => {
      const {
        stickyOffsets,
        direction
      } = props;
      const {
        right,
        left
      } = stickyOffsets;
      return (0, _extends2.default)((0, _extends2.default)({}, stickyOffsets), {
        left: direction === 'rtl' ? [...left.map(width => width + combinationScrollBarSize.value), 0] : left,
        right: direction === 'rtl' ? right : [...right.map(width => width + combinationScrollBarSize.value), 0],
        isSticky: tableContext.isSticky
      });
    });
    const mergedColumnWidth = useColumnWidth((0, _vue.toRef)(props, 'colWidths'), (0, _vue.toRef)(props, 'columCount'));
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
      return (0, _vue.createVNode)("div", {
        "style": (0, _extends2.default)({
          overflow: 'hidden'
        }, isSticky ? {
          top: `${stickyTopOffset}px`,
          bottom: `${stickyBottomOffset}px`
        } : {}),
        "ref": scrollRef,
        "class": (0, _classNames.default)(attrs.class, {
          [stickyClassName]: !!stickyClassName
        })
      }, [(0, _vue.createVNode)("table", {
        "style": {
          tableLayout: 'fixed',
          visibility: noData || mergedColumnWidth.value ? null : 'hidden'
        }
      }, [(!noData || !maxContentScroll || allFlattenColumnsWithWidth.value) && (0, _vue.createVNode)(_ColGroup.default, {
        "colWidths": mergedColumnWidth.value ? [...mergedColumnWidth.value, combinationScrollBarSize.value] : [],
        "columCount": columCount + 1,
        "columns": flattenColumnsWithScrollbar.value
      }, null), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots, (0, _extends2.default)((0, _extends2.default)({}, props), {
        stickyOffsets: headerStickyOffsets.value,
        columns: columnsWithScrollbar.value,
        flattenColumns: flattenColumnsWithScrollbar.value
      }))])]);
    };
  }
});