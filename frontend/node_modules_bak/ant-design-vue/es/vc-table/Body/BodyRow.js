import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
import Cell from '../Cell';
import { getColumnsKey } from '../utils/valueUtil';
import ExpandedRow from './ExpandedRow';
import { computed, defineComponent, shallowRef, watchEffect } from 'vue';
import { useInjectTable } from '../context/TableContext';
import { useInjectBody } from '../context/BodyContext';
import classNames from '../../_util/classNames';
export default defineComponent({
  name: 'BodyRow',
  inheritAttrs: false,
  props: ['record', 'index', 'renderIndex', 'recordKey', 'expandedKeys', 'rowComponent', 'cellComponent', 'customRow', 'rowExpandable', 'indent', 'rowKey', 'getRowKey', 'childrenColumnName'],
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const tableContext = useInjectTable();
    const bodyContext = useInjectBody();
    const expandRended = shallowRef(false);
    const expanded = computed(() => props.expandedKeys && props.expandedKeys.has(props.recordKey));
    watchEffect(() => {
      if (expanded.value) {
        expandRended.value = true;
      }
    });
    const rowSupportExpand = computed(() => bodyContext.expandableType === 'row' && (!props.rowExpandable || props.rowExpandable(props.record)));
    // Only when row is not expandable and `children` exist in record
    const nestExpandable = computed(() => bodyContext.expandableType === 'nest');
    const hasNestChildren = computed(() => props.childrenColumnName && props.record && props.record[props.childrenColumnName]);
    const mergedExpandable = computed(() => rowSupportExpand.value || nestExpandable.value);
    const onInternalTriggerExpand = (record, event) => {
      bodyContext.onTriggerExpand(record, event);
    };
    // =========================== onRow ===========================
    const additionalProps = computed(() => {
      var _a;
      return ((_a = props.customRow) === null || _a === void 0 ? void 0 : _a.call(props, props.record, props.index)) || {};
    });
    const onClick = function (event) {
      var _a, _b;
      if (bodyContext.expandRowByClick && mergedExpandable.value) {
        onInternalTriggerExpand(props.record, event);
      }
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      (_b = (_a = additionalProps.value) === null || _a === void 0 ? void 0 : _a.onClick) === null || _b === void 0 ? void 0 : _b.call(_a, event, ...args);
    };
    const computeRowClassName = computed(() => {
      const {
        record,
        index,
        indent
      } = props;
      const {
        rowClassName
      } = bodyContext;
      if (typeof rowClassName === 'string') {
        return rowClassName;
      } else if (typeof rowClassName === 'function') {
        return rowClassName(record, index, indent);
      }
      return '';
    });
    const columnsKey = computed(() => getColumnsKey(bodyContext.flattenColumns));
    return () => {
      const {
        class: className,
        style
      } = attrs;
      const {
        record,
        index,
        rowKey,
        indent = 0,
        rowComponent: RowComponent,
        cellComponent
      } = props;
      const {
        prefixCls,
        fixedInfoList,
        transformCellText
      } = tableContext;
      const {
        flattenColumns,
        expandedRowClassName,
        indentSize,
        expandIcon,
        expandedRowRender,
        expandIconColumnIndex
      } = bodyContext;
      const baseRowNode = _createVNode(RowComponent, _objectSpread(_objectSpread({}, additionalProps.value), {}, {
        "data-row-key": rowKey,
        "class": classNames(className, `${prefixCls}-row`, `${prefixCls}-row-level-${indent}`, computeRowClassName.value, additionalProps.value.class),
        "style": [style, additionalProps.value.style],
        "onClick": onClick
      }), {
        default: () => [flattenColumns.map((column, colIndex) => {
          const {
            customRender,
            dataIndex,
            className: columnClassName
          } = column;
          const key = columnsKey[colIndex];
          const fixedInfo = fixedInfoList[colIndex];
          let additionalCellProps;
          if (column.customCell) {
            additionalCellProps = column.customCell(record, index, column);
          }
          // not use slot to fix https://github.com/vueComponent/ant-design-vue/issues/5295
          const appendNode = colIndex === (expandIconColumnIndex || 0) && nestExpandable.value ? _createVNode(_Fragment, null, [_createVNode("span", {
            "style": {
              paddingLeft: `${indentSize * indent}px`
            },
            "class": `${prefixCls}-row-indent indent-level-${indent}`
          }, null), expandIcon({
            prefixCls,
            expanded: expanded.value,
            expandable: hasNestChildren.value,
            record,
            onExpand: onInternalTriggerExpand
          })]) : null;
          return _createVNode(Cell, _objectSpread(_objectSpread({
            "cellType": "body",
            "class": columnClassName,
            "ellipsis": column.ellipsis,
            "align": column.align,
            "component": cellComponent,
            "prefixCls": prefixCls,
            "key": key,
            "record": record,
            "index": index,
            "renderIndex": props.renderIndex,
            "dataIndex": dataIndex,
            "customRender": customRender
          }, fixedInfo), {}, {
            "additionalProps": additionalCellProps,
            "column": column,
            "transformCellText": transformCellText,
            "appendNode": appendNode
          }), null);
        })]
      });
      // ======================== Expand Row =========================
      let expandRowNode;
      if (rowSupportExpand.value && (expandRended.value || expanded.value)) {
        const expandContent = expandedRowRender({
          record,
          index,
          indent: indent + 1,
          expanded: expanded.value
        });
        const computedExpandedRowClassName = expandedRowClassName && expandedRowClassName(record, index, indent);
        expandRowNode = _createVNode(ExpandedRow, {
          "expanded": expanded.value,
          "class": classNames(`${prefixCls}-expanded-row`, `${prefixCls}-expanded-row-level-${indent + 1}`, computedExpandedRowClassName),
          "prefixCls": prefixCls,
          "component": RowComponent,
          "cellComponent": cellComponent,
          "colSpan": flattenColumns.length,
          "isEmpty": false
        }, {
          default: () => [expandContent]
        });
      }
      return _createVNode(_Fragment, null, [baseRowNode, expandRowNode]);
    };
  }
});