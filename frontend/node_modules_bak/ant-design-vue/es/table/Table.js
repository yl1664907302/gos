import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import RcTable from '../vc-table';
import { INTERNAL_HOOKS } from '../vc-table/Table';
import Spin from '../spin';
import Pagination from '../pagination';
import usePagination, { DEFAULT_PAGE_SIZE, getPaginationParam } from './hooks/usePagination';
import useLazyKVMap from './hooks/useLazyKVMap';
import useSelection from './hooks/useSelection';
import useSorter, { getSortData } from './hooks/useSorter';
import useFilter, { getFilterData } from './hooks/useFilter';
import useTitleColumns from './hooks/useTitleColumns';
import renderExpandIcon from './ExpandIcon';
import scrollTo from '../_util/scrollTo';
import defaultLocale from '../locale/en_US';
import devWarning from '../vc-util/devWarning';
import { nextTick, reactive, ref, computed, defineComponent, toRef, watchEffect, watch } from 'vue';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import classNames from '../_util/classNames';
import omit from '../_util/omit';
import { initDefaultProps } from '../_util/props-util';
import { useProvideSlots, useProvideTableContext } from './context';
import useColumns from './hooks/useColumns';
import { convertChildrenToColumns } from './util';
import { stringType, booleanType, arrayType, someType, functionType, objectType } from '../_util/type';
// CSSINJS
import useStyle from './style';
const EMPTY_LIST = [];
export const tableProps = () => {
  return {
    prefixCls: stringType(),
    columns: arrayType(),
    rowKey: someType([String, Function]),
    tableLayout: stringType(),
    rowClassName: someType([String, Function]),
    title: functionType(),
    footer: functionType(),
    id: stringType(),
    showHeader: booleanType(),
    components: objectType(),
    customRow: functionType(),
    customHeaderRow: functionType(),
    direction: stringType(),
    expandFixed: someType([Boolean, String]),
    expandColumnWidth: Number,
    expandedRowKeys: arrayType(),
    defaultExpandedRowKeys: arrayType(),
    expandedRowRender: functionType(),
    expandRowByClick: booleanType(),
    expandIcon: functionType(),
    onExpand: functionType(),
    onExpandedRowsChange: functionType(),
    'onUpdate:expandedRowKeys': functionType(),
    defaultExpandAllRows: booleanType(),
    indentSize: Number,
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
    expandIconColumnIndex: Number,
    showExpandColumn: booleanType(),
    expandedRowClassName: functionType(),
    childrenColumnName: stringType(),
    rowExpandable: functionType(),
    sticky: someType([Boolean, Object]),
    dropdownPrefixCls: String,
    dataSource: arrayType(),
    pagination: someType([Boolean, Object]),
    loading: someType([Boolean, Object]),
    size: stringType(),
    bordered: booleanType(),
    locale: objectType(),
    onChange: functionType(),
    onResizeColumn: functionType(),
    rowSelection: objectType(),
    getPopupContainer: functionType(),
    scroll: objectType(),
    sortDirections: arrayType(),
    showSorterTooltip: someType([Boolean, Object], true),
    transformCellText: functionType()
  };
};
const InternalTable = defineComponent({
  name: 'InternalTable',
  inheritAttrs: false,
  props: initDefaultProps(_extends(_extends({}, tableProps()), {
    contextSlots: objectType()
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
    devWarning(!(typeof props.rowKey === 'function' && props.rowKey.length > 1), 'Table', '`index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.');
    useProvideSlots(computed(() => props.contextSlots));
    useProvideTableContext({
      onResizeColumn: (w, col) => {
        emit('resizeColumn', w, col);
      }
    });
    const screens = useBreakpoint();
    const mergedColumns = computed(() => {
      const matched = new Set(Object.keys(screens.value).filter(m => screens.value[m]));
      return props.columns.filter(c => !c.responsive || c.responsive.some(r => matched.has(r)));
    });
    const {
      size: mergedSize,
      renderEmpty,
      direction,
      prefixCls,
      configProvider
    } = useConfigInject('table', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const transformCellText = computed(() => {
      var _a;
      return props.transformCellText || ((_a = configProvider.transformCellText) === null || _a === void 0 ? void 0 : _a.value);
    });
    const [tableLocale] = useLocaleReceiver('Table', defaultLocale.Table, toRef(props, 'locale'));
    const rawData = computed(() => props.dataSource || EMPTY_LIST);
    const dropdownPrefixCls = computed(() => configProvider.getPrefixCls('dropdown', props.dropdownPrefixCls));
    const childrenColumnName = computed(() => props.childrenColumnName || 'children');
    const expandType = computed(() => {
      if (rawData.value.some(item => item === null || item === void 0 ? void 0 : item[childrenColumnName.value])) {
        return 'nest';
      }
      if (props.expandedRowRender) {
        return 'row';
      }
      return null;
    });
    const internalRefs = reactive({
      body: null
    });
    const updateInternalRefs = refs => {
      _extends(internalRefs, refs);
    };
    // ============================ RowKey ============================
    const getRowKey = computed(() => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey;
      }
      return record => record === null || record === void 0 ? void 0 : record[props.rowKey];
    });
    const [getRecordByKey] = useLazyKVMap(rawData, childrenColumnName, getRowKey);
    // ============================ Events =============================
    const changeEventInfo = {};
    const triggerOnChange = function (info, action) {
      let reset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      const {
        pagination,
        scroll,
        onChange
      } = props;
      const changeInfo = _extends(_extends({}, changeEventInfo), info);
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
        scrollTo(0, {
          getContainer: () => internalRefs.body
        });
      }
      onChange === null || onChange === void 0 ? void 0 : onChange(changeInfo.pagination, changeInfo.filters, changeInfo.sorter, {
        currentDataSource: getFilterData(getSortData(rawData.value, changeInfo.sorterStates, childrenColumnName.value), changeInfo.filterStates),
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
    const [transformSorterColumns, sortStates, sorterTitleProps, sorters] = useSorter({
      prefixCls,
      mergedColumns,
      onSorterChange,
      sortDirections: computed(() => props.sortDirections || ['ascend', 'descend']),
      tableLocale,
      showSorterTooltip: toRef(props, 'showSorterTooltip')
    });
    const sortedData = computed(() => getSortData(rawData.value, sortStates.value, childrenColumnName.value));
    // ============================ Filter ============================
    const onFilterChange = (filters, filterStates) => {
      triggerOnChange({
        filters,
        filterStates
      }, 'filter', true);
    };
    const [transformFilterColumns, filterStates, filters] = useFilter({
      prefixCls,
      locale: tableLocale,
      dropdownPrefixCls,
      mergedColumns,
      onFilterChange,
      getPopupContainer: toRef(props, 'getPopupContainer')
    });
    const mergedData = computed(() => getFilterData(sortedData.value, filterStates.value));
    // ============================ Column ============================
    const [transformBasicColumns] = useColumns(toRef(props, 'contextSlots'));
    const columnTitleProps = computed(() => {
      const mergedFilters = {};
      const filtersValue = filters.value;
      Object.keys(filtersValue).forEach(filterKey => {
        if (filtersValue[filterKey] !== null) {
          mergedFilters[filterKey] = filtersValue[filterKey];
        }
      });
      return _extends(_extends({}, sorterTitleProps.value), {
        filters: mergedFilters
      });
    });
    const [transformTitleColumns] = useTitleColumns(columnTitleProps);
    // ========================== Pagination ==========================
    const onPaginationChange = (current, pageSize) => {
      triggerOnChange({
        pagination: _extends(_extends({}, changeEventInfo.pagination), {
          current,
          pageSize
        })
      }, 'paginate');
    };
    const [mergedPagination, resetPagination] = usePagination(computed(() => mergedData.value.length), toRef(props, 'pagination'), onPaginationChange);
    watchEffect(() => {
      changeEventInfo.sorter = sorters.value;
      changeEventInfo.sorterStates = sortStates.value;
      changeEventInfo.filters = filters.value;
      changeEventInfo.filterStates = filterStates.value;
      changeEventInfo.pagination = props.pagination === false ? {} : getPaginationParam(mergedPagination.value, props.pagination);
      changeEventInfo.resetPagination = resetPagination;
    });
    // ============================= Data =============================
    const pageData = computed(() => {
      if (props.pagination === false || !mergedPagination.value.pageSize) {
        return mergedData.value;
      }
      const {
        current = 1,
        total,
        pageSize = DEFAULT_PAGE_SIZE
      } = mergedPagination.value;
      devWarning(current > 0, 'Table', '`current` should be positive number.');
      // Dynamic table data
      if (mergedData.value.length < total) {
        if (mergedData.value.length > pageSize) {
          return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
        }
        return mergedData.value;
      }
      return mergedData.value.slice((current - 1) * pageSize, current * pageSize);
    });
    watchEffect(() => {
      nextTick(() => {
        const {
          total,
          pageSize = DEFAULT_PAGE_SIZE
        } = mergedPagination.value;
        // Dynamic table data
        if (mergedData.value.length < total) {
          if (mergedData.value.length > pageSize) {
            devWarning(false, 'Table', '`dataSource` length is less than `pagination.total` but large than `pagination.pageSize`. Please make sure your config correct data with async mode.');
          }
        }
      });
    }, {
      flush: 'post'
    });
    const expandIconColumnIndex = computed(() => {
      if (props.showExpandColumn === false) return -1;
      // Adjust expand icon index, no overwrite expandIconColumnIndex if set.
      if (expandType.value === 'nest' && props.expandIconColumnIndex === undefined) {
        return props.rowSelection ? 1 : 0;
      } else if (props.expandIconColumnIndex > 0 && props.rowSelection) {
        return props.expandIconColumnIndex - 1;
      }
      return props.expandIconColumnIndex;
    });
    const rowSelection = ref();
    watch(() => props.rowSelection, () => {
      rowSelection.value = props.rowSelection ? _extends({}, props.rowSelection) : props.rowSelection;
    }, {
      deep: true,
      immediate: true
    });
    // ========================== Selections ==========================
    const [transformSelectionColumns, selectedKeySet] = useSelection(rowSelection, {
      prefixCls,
      data: mergedData,
      pageData,
      getRowKey,
      getRecordByKey,
      expandType,
      childrenColumnName,
      locale: tableLocale,
      getPopupContainer: computed(() => props.getPopupContainer)
    });
    const internalRowClassName = (record, index, indent) => {
      let mergedRowClassName;
      const {
        rowClassName
      } = props;
      if (typeof rowClassName === 'function') {
        mergedRowClassName = classNames(rowClassName(record, index, indent));
      } else {
        mergedRowClassName = classNames(rowClassName);
      }
      return classNames({
        [`${prefixCls.value}-row-selected`]: selectedKeySet.value.has(getRowKey.value(record, index))
      }, mergedRowClassName);
    };
    expose({
      selectedKeySet
    });
    const indentSize = computed(() => {
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
        expandIcon = slots.expandIcon || renderExpandIcon(tableLocale.value),
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
        const renderPagination = position => _createVNode(Pagination, _objectSpread(_objectSpread({}, mergedPagination.value), {}, {
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
        spinProps = _extends({
          spinning: true
        }, loading);
      }
      const wrapperClassNames = classNames(`${prefixCls.value}-wrapper`, {
        [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      const tableProps = omit(props, ['columns']);
      return wrapSSR(_createVNode("div", {
        "class": wrapperClassNames,
        "style": attrs.style
      }, [_createVNode(Spin, _objectSpread({
        "spinning": false
      }, spinProps), {
        default: () => [topPaginationNode, _createVNode(RcTable, _objectSpread(_objectSpread(_objectSpread({}, attrs), tableProps), {}, {
          "expandedRowKeys": props.expandedRowKeys,
          "defaultExpandedRowKeys": props.defaultExpandedRowKeys,
          "expandIconColumnIndex": expandIconColumnIndex.value,
          "indentSize": indentSize.value,
          "expandIcon": expandIcon,
          "columns": mergedColumns.value,
          "direction": direction.value,
          "prefixCls": prefixCls.value,
          "class": classNames({
            [`${prefixCls.value}-middle`]: mergedSize.value === 'middle',
            [`${prefixCls.value}-small`]: mergedSize.value === 'small',
            [`${prefixCls.value}-bordered`]: bordered,
            [`${prefixCls.value}-empty`]: rawData.value.length === 0
          }),
          "data": pageData.value,
          "rowKey": getRowKey.value,
          "rowClassName": internalRowClassName,
          "internalHooks": INTERNAL_HOOKS,
          "internalRefs": internalRefs,
          "onUpdateInternalRefs": updateInternalRefs,
          "transformColumns": transformColumns,
          "transformCellText": transformCellText.value
        }), _extends(_extends({}, slots), {
          emptyText: () => {
            var _a, _b;
            return ((_a = slots.emptyText) === null || _a === void 0 ? void 0 : _a.call(slots)) || ((_b = props.locale) === null || _b === void 0 ? void 0 : _b.emptyText) || renderEmpty('Table');
          }
        })), bottomPaginationNode]
      })]));
    };
  }
});
const Table = defineComponent({
  name: 'ATable',
  inheritAttrs: false,
  props: initDefaultProps(tableProps(), {
    rowKey: 'key'
  }),
  slots: Object,
  setup(props, _ref2) {
    let {
      attrs,
      slots,
      expose
    } = _ref2;
    const table = ref();
    expose({
      table
    });
    return () => {
      var _a;
      const columns = props.columns || convertChildrenToColumns((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      return _createVNode(InternalTable, _objectSpread(_objectSpread(_objectSpread({
        "ref": table
      }, attrs), props), {}, {
        "columns": columns || [],
        "expandedRowRender": slots.expandedRowRender || props.expandedRowRender,
        "contextSlots": _extends({}, slots)
      }), slots);
    };
  }
});
export default Table;