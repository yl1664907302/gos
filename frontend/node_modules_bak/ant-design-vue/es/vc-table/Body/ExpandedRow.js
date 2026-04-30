import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import Cell from '../Cell';
import { defineComponent } from 'vue';
import { useInjectTable } from '../context/TableContext';
import { useInjectExpandedRow } from '../context/ExpandedRowContext';
export default defineComponent({
  name: 'ExpandedRow',
  inheritAttrs: false,
  props: ['prefixCls', 'component', 'cellComponent', 'expanded', 'colSpan', 'isEmpty'],
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const tableContext = useInjectTable();
    const expandedRowContext = useInjectExpandedRow();
    const {
      fixHeader,
      fixColumn,
      componentWidth,
      horizonScroll
    } = expandedRowContext;
    return () => {
      const {
        prefixCls,
        component: Component,
        cellComponent,
        expanded,
        colSpan,
        isEmpty
      } = props;
      return _createVNode(Component, {
        "class": attrs.class,
        "style": {
          display: expanded ? null : 'none'
        }
      }, {
        default: () => [_createVNode(Cell, {
          "component": cellComponent,
          "prefixCls": prefixCls,
          "colSpan": colSpan
        }, {
          default: () => {
            var _a;
            let contentNode = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
            if (isEmpty ? horizonScroll.value : fixColumn.value) {
              const _contentNode = function () {
                return contentNode;
              }();
              contentNode = _createVNode("div", {
                "style": {
                  width: `${componentWidth.value - (fixHeader.value ? tableContext.scrollbarSize : 0)}px`,
                  position: 'sticky',
                  left: 0,
                  overflow: 'hidden'
                },
                "class": `${prefixCls}-expanded-row-fixed`
              }, [contentNode]);
            }
            return contentNode;
          }
        })]
      });
    };
  }
});