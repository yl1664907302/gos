"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcTable = _interopRequireDefault(require("../vc-table"));
var _Table = require("../vc-table/Table");
var _spin = _interopRequireDefault(require("../spin"));
var _pagination = _interopRequireDefault(require("../pagination"));
var _usePagination = _interopRequireWildcard(require("./hooks/usePagination"));
var _useLazyKVMap = _interopRequireDefault(require("./hooks/useLazyKVMap"));
var _useSelection = _interopRequireDefault(require("./hooks/useSelection"));
var _useSorter = _interopRequireWildcard(require("./hooks/useSorter"));
var _useFilter = _interopRequireWildcard(require("./hooks/useFilter"));
var _useTitleColumns = _interopRequireDefault(require("./hooks/useTitleColumns"));
var _ExpandIcon = _interopRequireDefault(require("./ExpandIcon"));
var _scrollTo = _interopRequireDefault(require("../_util/scrollTo"));
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _useBreakpoint = _interopRequireDefault(require("../_util/hooks/useBreakpoint"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _propsUtil = require("../_util/props-util");
var _context = require("./context");
var _useColumns = _interopRequireDefault(require("./hooks/useColumns"));
var _util = require("./util");
var _type = require("../_util/type");
var _style = _interopRequireDefault(require("./style"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// CSSINJS

const EMPTY_LIST = [];
const tableProps = () => {
  return {
    prefixCls: (0, _type.stringType)(),
    columns: (0, _type.arrayType)(),
    rowKey: (0, _type.someType)([String, Function]),
    tableLayout: (0, _type.stringType)(),
    rowClassName: (0, _type.someType)([String, Function]),
    title: (0, _type.functionType)(),
    footer: (0, _type.functionType)(),
    id: (0, _type.stringType)(),
    showHeader: (0, _type.booleanType)(),
    components: (0, _type.objectType)(),
    customRow: (0, _type.functionType)(),
    customHeaderRow: (0, _type.functionType)(),
    direction: (0, _type.stringType)(),
    expandFixed: (0, _type.someType)([Boolean, String]),
    expandColumnWidth: Number,
    expandedRowKeys: (0, _type.arrayType)(),
    defaultExpandedRowKeys: (0, _type.arrayType)(),
    expandedRowRender: (0, _type.functionType)(),
    expandRowByClick: (0, _type.booleanType)(),
    expandIcon: (0, _type.functionType)(),
    onExpand: (0, _type.functionType)(),
    onExpandedRowsChange: (0, _type.functionType)(),
    'onUpdate:expandedRowKeys': (0, _type.functionType)(),
    defaultExpandAllRows: (0, _type.booleanType)(),
    indentSize: Number,
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
    expandIconColumnIndex: Number,
    showExpandColumn: (0, _type.booleanType)(),
    expandedRowClassName: (0, _type.functionType)(),
    childrenColumnName: (0, _type.stringType)(),
    rowExpandable: (0, _type.functionType)(),
    sticky: (0, _type.someType)([Boolean, Object]),
    dropdownPrefixCls: String,
    dataSource: (0, _type.arrayType)(),
    pagination: (0, _type.someType)([Boolean, Object]),
    loading: (0, _type.someType)([Boolean, Object]),
    size: (0, _type.stringType)(),
    bordered: (0, _type.booleanType)(),
    locale: (0, _type.objectType)(),
    onChange: (0, _type.functionType)(),
    onResizeColumn: (0, _type.functionType)(),
    rowSelection: (0, _type.objectType)(),
    getPopupContainer: (0, _type.functionType)(),
    scroll: (0, _type.objectType)(),
    sortDirections: (0, _type.arrayType)(),
    showSorterTooltip: (0, _type.someType)([Boolean, Object], true),
    transformCellText: (0, _type.functionType)()
  };
};
exports.tableProps = tableProps;
const InternalTable = (0, _vue.defineComponent)({
  name: 'InternalTable',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _extends2.default)((0, _extends2.default)({}, tableProps()), {
    contextSlots: (0, _type.objectType)()
  }), {
    rowKey: 'key'
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose,
      emit
    } = _ref;
    (0, _devWarning.default)(!(typeof props.rowKey === 'function' && props.rowKey.length > 1), 'Table', '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.');
    (0, _context.useProvideSlots)((0, _vue.computed)(() => props.contextSlots));
    (0, _context.useProvideTableContext)({
      onResizeColumn: (w, col) => {
        emit('resizeColumn', w, col);
      }
    });
    const screens = (0, _useBreakpoint.default)();
    const mergedColumns = (0, _vue.computed)(() => {
      const matched = new Set(Object.keys(screens.value).filter(m => screens.value[m]));
      return props.columns.filter(c => !c.responsive || c.responsive.some(r => matched.has(r)));
    });
    const {
      size: mergedSize,
      renderEmpty,
      direction,
      prefixCls,
      configProvider
    } = (0, _useConfigInject.default)('table', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const transformCellText = (0, _vue.computed)(() => {
      var _a;
      return props.transformCellText || ((_a = configProvider.transformCellText) === null || _a === void 0 ? void 0 : _a.value);
    });
    const [tableLocale] = (0, _LocaleReceiver.useLocaleReceiver)('Table', _en_US.default.Table, (0, _vue.toRef)(props, 'locale'));
    const rawData = (0, _vue.computed)(() => props.dataSource || EMPTY_LIST);
    const dropdownPrefixCls = (0, _vue.computed)(() => configProvider.getPrefixCls('dropdown', props.dropdownPrefixCls));
    const childrenColumnName = (0, _vue.computed)(() => props.childrenColumnName || 'children');
    const expandType = (0, _vue.computed)(() => {
      if (rawData.value.some(item => item === null || item === void 0 ? void 0 : item[childrenColumnName.value])) {
        return 'nest';
      }
      if (props.expandedRowRender) {
        return 'row';
      }
      return null;
    });
    const internalRefs = (0, _vue.reactive)({
      body: null
    });
    const updateInternalRefs = refs => {
      (0, _extends2.default)(internalRefs, refs);
    };
    // ============================ RowKey ============================
    const getRowKey = (0, _vue.computed)(() => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey;
      }
      return record => record === null || record === void 0 ? void 0 : record[props.rowKey];
    });
    const [getRecordByKey] = (0, _useLazyKVMap.default)(rawData, childrenColumnName, getRowKey);
    // ============================ Events =============================
    const changeEventInfo = {};
    const triggerOnChange = function (info, action) {
      let reset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      const {
        pagination,
        scroll,
        onChange
      } = props;
      const changeInfo = (0, _extends2.default)((0, _extends2.default)({}, changeEventInfo), info);
      if (reset) {
        changeEventInfo.resetPagination();
        // Reset event param
        if (changeInfo.pagination.current) {
          changeInfo.pagination.current = 1;
        }
        // Trigger pagination events
        if (pagination && pagination.onChange) {
          pagination.onChange(1, changeInfo.pagination.pageSize);
        }
      }
      if (scroll && scroll.scrollToFirstRowOnChange !== false && internalRefs.body) {
        (0, _scrollTo.default)(0, {
          getContainer: () => internalRefs.body
        });
      }
      onChange === null || onChange === void 0 ? void 0 : onChange(changeInfo.pagination, changeInfo.filters, changeInfo.sorter, {
        currentDataSource: (0, _useFilter.getFilterData)((0, _useSorter.getSortData)(rawData.value, changeInfo.sorterStates, childrenColumnName.value), changeInfo.filterStates),
        action
      });
    };
    /**
     * Controlled state in `columns` is not a good idea that makes too many code (1000+ line?) to read
     * state out and then put it back to title render. Move these code into `hooks` but still too
     * complex. We should provides Table props like `sorter` & `filter` to handle control in next big version.
     */
    // ============================ Sorter =============================
    const onSorterChange = (sorter, sorterStates) => {
      triggerOnChange({
        sorter,
        sorterStates
      }, 'sort', false);
    };
    const [transformSorterColumns, sortStates, sorterTitleProps, sorters] = (0, _useSorter.default)({
      prefixCls,
      mergedColumns,
      onSorterChange,
      sortDirections: (0, _vue.computed)(() => props.sortDirections || ['ascend', 'descend']),
      tableLocale,
      showSorterTooltip: (0, _vue.toRef)(props, 'showSorterTooltip')
    });
    const sortedData = (0, _vue.computed)(() => (0, _useSorter.getSortData)(rawData.value, sortStates.value, childrenColumnName.value));
    // ============================ Filter ============================
    const onFilterChange = (filters, filterStates) => {
      triggerOnChange({
        filters,
        filterStates
      }, 'filter', true);
    };
    const [transformFilterColumns, filterStates, filters] = (0, _useFilter.default)({
      prefixCls,
      locale: tableLocale,
      dropdownPrefixCls,
      mergedColumns,
      onFilterChange,
      getPopupContainer: (0, _vue.toRef)(props, 'getPopupContainer')
    });
    const mergedData = (0, _vue.computed)(() => (0, _useFilter.getFilterData)(sortedData.value, filterStates.value));
    // ============================ Column ============================
    const [transformBasicColumns] = (0, _useColumns.default)((0, _vue.toRef)(props, 'contextSlots'));
    const columnTitleProps = (0, _vue.computed)(() => {
      const mergedFilters = {};
      const filtersValue = filters.value;
      Object.keys(filtersValue).forEach(filterKey => {
        if (filtersValue[filterKey] !== null) {
          mergedFilters[filterKey] = filtersValue[filterKey];
        }
      });
      return (0, _extends2.default)((0, _extends2.default)({}, sorterTitleProps.value), {
        filters: mergedFilters
      });
    });
    const [transformTitleColumns] = (0, _useTitleColumns.default)(columnTitleProps);
    // ========================== Pagination ==========================
    const onPaginationChange = (current, pageSize) => {
      triggerOnChange({
        pagination: (0, _extends2.default)((0, _extends2.default)({}, changeEventInfo.pagination), {
          current,
          pageSize
        })
      }, 'paginate');
    };
    const [mergedPagination, resetPagination] = (0, _usePagination.default)((0, _vue.computed)(() => mergedData.value.length), (0, _vue.toRef)(props, 'pagination'), onPaginationChange);
    (0, _vue.watchEffect)(() => {
      changeEventInfo.sorter = sorters.value;
      changeEventInfo.sorterStates = sortStates.value;
      changeEventInfo.filters = filters.value;
      changeEventInfo.filterStates = filterStates.value;
      changeEventInfo.pagination = props.pagination === false ? {} : (0, _usePagination.getPaginationParam)(mergedPagination.value, props.pagination);
      changeEventInfo.resetPagination = resetPagination;
    });
    // ============================= Data =============================
    const pageData = (0, _vue.computed)(() => {
      if (props.pagination === false || !mergedPagination.value.pageSize) {
        return mergedData.value;
      }
      const {
        current = 1,
        total,
        pageSize = _usePagination.DEFAULT_PAGE_SIZE
      } = mergedPagination.value;
      (0, _devWarning.default)(current > 0, 'Table', '`current` should be positive number.');
      // Dynamic table data
      if (mergedData.value.length < total) {
        if (mergedData.value.length > pageSize) {
          return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
        }
        return mergedData.value;
      }
      return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
    });
    (0, _vue.watchEffect)(() => {
      (0, _vue.nextTick)(() => {
        const {
          total,
          pageSize = _usePagination.DEFAULT_PAGE_SIZE
        } = mergedPagination.value;
        // Dynamic table data
        if (mergedData.value.length < total) {
          if (mergedData.value.length > pageSize) {
            (0, _devWarning.default)(false, 'Table', '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.');
          }
        }
      });
    }, {
      flush: 'post'
    });
    const expandIconColumnIndex = (0, _vue.computed)(() => {
      if (props.showExpandColumn === false) return -1;
      // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
      if (expandType.value === 'nest' && props.expandIconColumnIndex === undefined) {
        return props.rowSelection ? 1 : 0;
      } else if (props.expandIconColumnIndex > 0 && props.rowSelection) {
        return props.expandIconColumnIndex - 1;
      }
      return props.expandIconColumnIndex;
    });
    const rowSelection = (0, _vue.ref)();
    (0, _vue.watch)(() => props.rowSelection, () => {
      rowSelection.value = props.rowSelection ? (0, _extends2.default)({}, props.rowSelection) : props.rowSelection;
    }, {
      deep: true,
      immediate: true
    });
    // ========================== Selections ==========================
    const [transformSelectionColumns, selectedKeySet] = (0, _useSelection.default)(rowSelection, {
      prefixCls,
      data: mergedData,
      pageData,
      getRowKey,
      getRecordByKey,
      expandType,
      childrenColumnName,
      locale: tableLocale,
      getPopupContainer: (0, _vue.computed)(() => props.getPopupContainer)
    });
    const internalRowClassName = (record, index, indent) => {
      let mergedRowClassName;
      const {
        rowClassName
      } = props;
      if (typeof rowClassName === 'function') {
        mergedRowClassName = (0, _classNames.default)(rowClassName(record, index, indent));
      } else {
        mergedRowClassName = (0, _classNames.default)(rowClassName);
      }
      return (0, _classNames.default)({
        [`${prefixCls.value}-row-selected`]: selectedKeySet.value.has(getRowKey.value(record, index))
      }, mergedRowClassName);
    };
    expose({
      selectedKeySet
    });
    const indentSize = (0, _vue.computed)(() => {
      // Indent size
      return typeof props.indentSize === 'number' ? props.indentSize : 15;
    });
    const transformColumns = innerColumns => {
      const res = transformTitleColumns(transformSelectionColumns(transformFilterColumns(transformSorterColumns(transformBasicColumns(innerColumns)))));
      return res;
    };
    return () => {
      var _a;
      const {
        expandIcon = slots.expandIcon || (0, _ExpandIcon.default)(tableLocale.value),
        pagination,
        loading,
        bordered
      } = props;
      let topPaginationNode;
      let bottomPaginationNode;
      if (pagination !== false && ((_a = mergedPagination.value) === null || _a === void 0 ? void 0 : _a.total)) {
        let paginationSize;
        if (mergedPagination.value.size) {
          paginationSize = mergedPagination.value.size;
        } else {
          paginationSize = mergedSize.value === 'small' || mergedSize.value === 'middle' ? 'small' : undefined;
        }
        const renderPagination = position => (0, _vue.createVNode)(_pagination.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, mergedPagination.value), {}, {
          "class": [`${prefixCls.value}-pagination ${prefixCls.value}-pagination-${position}`, mergedPagination.value.class],
          "size": paginationSize
        }), null);
        const defaultPosition = direction.value === 'rtl' ? 'left' : 'right';
        const {
          position
        } = mergedPagination.value;
        if (position !== null && Array.isArray(position)) {
          const topPos = position.find(p => p.includes('top'));
          const bottomPos = position.find(p => p.includes('bottom'));
          const isDisable = position.every(p => `${p}` === 'none');
          if (!topPos && !bottomPos && !isDisable) {
            bottomPaginationNode = renderPagination(defaultPosition);
          }
          if (topPos) {
            topPaginationNode = renderPagination(topPos.toLowerCase().replace('top', ''));
          }
          if (bottomPos) {
            bottomPaginationNode = renderPagination(bottomPos.toLowerCase().replace('bottom', ''));
          }
        } else {
          bottomPaginationNode = renderPagination(defaultPosition);
        }
      }
      // >>>>>>>>> Spinning
      let spinProps;
      if (typeof loading === 'boolean') {
        spinProps = {
          spinning: loading
        };
      } else if (typeof loading === 'object') {
        spinProps = (0, _extends2.default)({
          spinning: true
        }, loading);
      }
      const wrapperClassNames = (0, _classNames.default)(`${prefixCls.value}-wrapper`, {
        [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      const tableProps = (0, _omit.default)(props, ['columns']);
      return wrapSSR((0, _vue.createVNode)("div", {
        "class": wrapperClassNames,
        "style": attrs.style
      }, [(0, _vue.createVNode)(_spin.default, (0, _objectSpread2.default)({
        "spinning": false
      }, spinProps), {
        default: () => [topPaginationNode, (0, _vue.createVNode)(_vcTable.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), tableProps), {}, {
          "expandedRowKeys": props.expandedRowKeys,
          "defaultExpandedRowKeys": props.defaultExpandedRowKeys,
          "expandIconColumnIndex": expandIconColumnIndex.value,
          "indentSize": indentSize.value,
          "expandIcon": expandIcon,
          "columns": mergedColumns.value,
          "direction": direction.value,
          "prefixCls": prefixCls.value,
          "class": (0, _classNames.default)({
            [`${prefixCls.value}-middle`]: mergedSize.value === 'middle',
            [`${prefixCls.value}-small`]: mergedSize.value === 'small',
            [`${prefixCls.value}-bordered`]: bordered,
            [`${prefixCls.value}-empty`]: rawData.value.length === 0
          }),
          "data": pageData.value,
          "rowKey": getRowKey.value,
          "rowClassName": internalRowClassName,
          "internalHooks": _Table.INTERNAL_HOOKS,
          "internalRefs": internalRefs,
          "onUpdateInternalRefs": updateInternalRefs,
          "transformColumns": transformColumns,
          "transformCellText": transformCellText.value
        }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
          emptyText: () => {
            var _a, _b;
            return ((_a = slots.emptyText) === null || _a === void 0 ? void 0 : _a.call(slots)) || ((_b = props.locale) === null || _b === void 0 ? void 0 : _b.emptyText) || renderEmpty('Table');
          }
        })), bottomPaginationNode]
      })]));
    };
  }
});
const Table = (0, _vue.defineComponent)({
  name: 'ATable',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(tableProps(), {
    rowKey: 'key'
  }),
  slots: Object,
  setup(props, _ref2) {
    let {
      attrs,
      slots,
      expose
    } = _ref2;
    const table = (0, _vue.ref)();
    expose({
      table
    });
    return () => {
      var _a;
      const columns = props.columns || (0, _util.convertChildrenToColumns)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      return (0, _vue.createVNode)(InternalTable, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": table
      }, attrs), props), {}, {
        "columns": columns || [],
        "expandedRowRender": slots.expandedRowRender || props.expandedRowRender,
        "contextSlots": (0, _extends2.default)({}, slots)
      }), slots);
    };
  }
});
var _default = exports.default = Table;