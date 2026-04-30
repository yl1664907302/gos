"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Cell = _interopRequireDefault(require("../Cell"));
var _valueUtil = require("../utils/valueUtil");
var _ExpandedRow = _interopRequireDefault(require("./ExpandedRow"));
var _TableContext = require("../context/TableContext");
var _BodyContext = require("../context/BodyContext");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'BodyRow',
  inheritAttrs: false,
  props: ['record', 'index', 'renderIndex', 'recordKey', 'expandedKeys', 'rowComponent', 'cellComponent', 'customRow', 'rowExpandable', 'indent', 'rowKey', 'getRowKey', 'childrenColumnName'],
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const tableContext = (0, _TableContext.useInjectTable)();
    const bodyContext = (0, _BodyContext.useInjectBody)();
    const expandRended = (0, _vue.shallowRef)(false);
    const expanded = (0, _vue.computed)(() => props.expandedKeys && props.expandedKeys.has(props.recordKey));
    (0, _vue.watchEffect)(() => {
      if (expanded.value) {
        expandRended.value = true;
      }
    });
    const rowSupportExpand = (0, _vue.computed)(() => bodyContext.expandableType === 'row' && (!props.rowExpandable || props.rowExpandable(props.record)));
    // Only when row is not expandable and `children` exist in record
    const nestExpandable = (0, _vue.computed)(() => bodyContext.expandableType === 'nest');
    const hasNestChildren = (0, _vue.computed)(() => props.childrenColumnName && props.record && props.record[props.childrenColumnName]);
    const mergedExpandable = (0, _vue.computed)(() => rowSupportExpand.value || nestExpandable.value);
    const onInternalTriggerExpand = (record, event) => {
      bodyContext.onTriggerExpand(record, event);
    };
    // =========================== onRow ===========================
    const additionalProps = (0, _vue.computed)(() => {
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
    const computeRowClassName = (0, _vue.computed)(() => {
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
    const columnsKey = (0, _vue.computed)(() => (0, _valueUtil.getColumnsKey)(bodyContext.flattenColumns));
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
      const baseRowNode = (0, _vue.createVNode)(RowComponent, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, additionalProps.value), {}, {
        "data-row-key": rowKey,
        "class": (0, _classNames.default)(className, `${prefixCls}-row`, `${prefixCls}-row-level-${indent}`, computeRowClassName.value, additionalProps.value.class),
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
          const appendNode = colIndex === (expandIconColumnIndex || 0) && nestExpandable.value ? (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("span", {
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
          return (0, _vue.createVNode)(_Cell.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
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
        expandRowNode = (0, _vue.createVNode)(_ExpandedRow.default, {
          "expanded": expanded.value,
          "class": (0, _classNames.default)(`${prefixCls}-expanded-row`, `${prefixCls}-expanded-row-level-${indent + 1}`, computedExpandedRowClassName),
          "prefixCls": prefixCls,
          "component": RowComponent,
          "cellComponent": cellComponent,
          "colSpan": flattenColumns.length,
          "isEmpty": false
        }, {
          default: () => [expandContent]
        });
      }
      return (0, _vue.createVNode)(_vue.Fragment, null, [baseRowNode, expandRowNode]);
    };
  }
});