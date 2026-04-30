import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import Header from './Header/Header';
import Body from './Body';
import useColumns from './hooks/useColumns';
import { useLayoutState, useTimeoutLock } from './hooks/useFrame';
import { getPathValue, mergeObject, validateValue, getColumnsKey } from './utils/valueUtil';
import useStickyOffsets from './hooks/useStickyOffsets';
import ColGroup from './ColGroup';
import Panel from './Panel';
import Footer from './Footer';
import { findAllChildrenKeys, renderExpandIcon } from './utils/expandUtil';
import { getCellFixedInfo } from './utils/fixUtil';
import StickyScrollBar from './stickyScrollBar';
import useSticky from './hooks/useSticky';
import FixedHolder from './FixedHolder';
import { onUpdated, computed, defineComponent, nextTick, onMounted, reactive, ref, shallowRef, toRef, toRefs, watch, watchEffect } from 'vue';
import { warning } from '../vc-util/warning';
import { reactivePick } from '../_util/reactivePick';
import useState from '../_util/hooks/useState';
import { toPx } from '../_util/util';
import isVisible from '../vc-util/Dom/isVisible';
import { getTargetScrollBarSize } from '../_util/getScrollBarSize';
import classNames from '../_util/classNames';
import VCResizeObserver from '../vc-resize-observer';
import { useProvideTable } from './context/TableContext';
import { useProvideBody } from './context/BodyContext';
import { useProvideResize } from './context/ResizeContext';
import { useProvideSticky } from './context/StickyContext';
import pickAttrs from '../_util/pickAttrs';
import { useProvideExpandedRow } from './context/ExpandedRowContext';
// Used for conditions cache
const EMPTY_DATA = [];
// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};
export const INTERNAL_HOOKS = 'rc-table-internal-hook';
export default defineComponent({
  name: 'VcTable',
  inheritAttrs: false,
  props: ['prefixCls', 'data', 'columns', 'rowKey', 'tableLayout', 'scroll', 'rowClassName', 'title', 'footer', 'id', 'showHeader', 'components', 'customRow', 'customHeaderRow', 'direction', 'expandFixed', 'expandColumnWidth', 'expandedRowKeys', 'defaultExpandedRowKeys', 'expandedRowRender', 'expandRowByClick', 'expandIcon', 'onExpand', 'onExpandedRowsChange', 'onUpdate:expandedRowKeys', 'defaultExpandAllRows', 'indentSize', 'expandIconColumnIndex', 'expandedRowClassName', 'childrenColumnName', 'rowExpandable', 'sticky', 'transformColumns', 'internalHooks', 'internalRefs', 'canExpandable', 'onUpdateInternalRefs', 'transformCellText'],
  emits: ['expand', 'expandedRowsChange', 'updateInternalRefs', 'update:expandedRowKeys'],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const mergedData = computed(() => props.data || EMPTY_DATA);
    const hasData = computed(() => !!mergedData.value.length);
    // ==================== Customize =====================
    const mergedComponents = computed(() => mergeObject(props.components, {}));
    const getComponent = (path, defaultComponent) => getPathValue(mergedComponents.value, path) || defaultComponent;
    const getRowKey = computed(() => {
      const rowKey = props.rowKey;
      if (typeof rowKey === 'function') {
        return rowKey;
      }
      return record => {
        const key = record && record[rowKey];
        if (process.env.NODE_ENV !== 'production') {
          warning(key !== undefined, 'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.');
        }
        return key;
      };
    });
    // ====================== Expand ======================
    const mergedExpandIcon = computed(() => props.expandIcon || renderExpandIcon);
    const mergedChildrenColumnName = computed(() => props.childrenColumnName || 'children');
    const expandableType = computed(() => {
      if (props.expandedRowRender) {
        return 'row';
      }
      /* eslint-disable no-underscore-dangle */
      /**
       * Fix https://github.com/ant-design/ant-design/issues/21154
       * This is a workaround to not to break current behavior.
       * We can remove follow code after final release.
       *
       * To other developer:
       *  Do not use `__PARENT_RENDER_ICON__` in prod since we will remove this when refactor
       */
      if (props.canExpandable || mergedData.value.some(record => record && typeof record === 'object' && record[mergedChildrenColumnName.value])) {
        return 'nest';
      }
      /* eslint-enable */
      return false;
    });
    const innerExpandedKeys = shallowRef([]);
    const stop = watchEffect(() => {
      if (props.defaultExpandedRowKeys) {
        innerExpandedKeys.value = props.defaultExpandedRowKeys;
      }
      if (props.defaultExpandAllRows) {
        innerExpandedKeys.value = findAllChildrenKeys(mergedData.value, getRowKey.value, mergedChildrenColumnName.value);
      }
    });
    // defalutXxxx 仅仅第一次生效
    stop();
    const mergedExpandedKeys = computed(() => new Set(props.expandedRowKeys || innerExpandedKeys.value || []));
    const onTriggerExpand = record => {
      const key = getRowKey.value(record, mergedData.value.indexOf(record));
      let newExpandedKeys;
      const hasKey = mergedExpandedKeys.value.has(key);
      if (hasKey) {
        mergedExpandedKeys.value.delete(key);
        newExpandedKeys = [...mergedExpandedKeys.value];
      } else {
        newExpandedKeys = [...mergedExpandedKeys.value, key];
      }
      innerExpandedKeys.value = newExpandedKeys;
      emit('expand', !hasKey, record);
      emit('update:expandedRowKeys', newExpandedKeys);
      emit('expandedRowsChange', newExpandedKeys);
    };
    // Warning if use `expandedRowRender` and nest children in the same time
    if (process.env.NODE_ENV !== 'production' && props.expandedRowRender && mergedData.value.some(record => {
      return Array.isArray(record === null || record === void 0 ? void 0 : record[mergedChildrenColumnName.value]);
    })) {
      warning(false, '`expandedRowRender` should not use with nested Table');
    }
    const componentWidth = ref(0);
    const [columns, flattenColumns] = useColumns(_extends(_extends({}, toRefs(props)), {
      // children,
      expandable: computed(() => !!props.expandedRowRender),
      expandedKeys: mergedExpandedKeys,
      getRowKey,
      onTriggerExpand,
      expandIcon: mergedExpandIcon
    }), computed(() => props.internalHooks === INTERNAL_HOOKS ? props.transformColumns : null));
    const columnContext = computed(() => ({
      columns: columns.value,
      flattenColumns: flattenColumns.value
    }));
    // ====================== Scroll ======================
    const fullTableRef = ref();
    const scrollHeaderRef = ref();
    const scrollBodyRef = ref();
    const scrollBodySizeInfo = ref({
      scrollWidth: 0,
      clientWidth: 0
    });
    const scrollSummaryRef = ref();
    const [pingedLeft, setPingedLeft] = useState(false);
    const [pingedRight, setPingedRight] = useState(false);
    const [colsWidths, updateColsWidths] = useLayoutState(new Map());
    // Convert map to number width
    const colsKeys = computed(() => getColumnsKey(flattenColumns.value));
    const colWidths = computed(() => colsKeys.value.map(columnKey => colsWidths.value.get(columnKey)));
    const columnCount = computed(() => flattenColumns.value.length);
    const stickyOffsets = useStickyOffsets(colWidths, columnCount, toRef(props, 'direction'));
    const fixHeader = computed(() => props.scroll && validateValue(props.scroll.y));
    const horizonScroll = computed(() => props.scroll && validateValue(props.scroll.x) || Boolean(props.expandFixed));
    const fixColumn = computed(() => horizonScroll.value && flattenColumns.value.some(_ref2 => {
      let {
        fixed
      } = _ref2;
      return fixed;
    }));
    // Sticky
    const stickyRef = ref();
    const stickyState = useSticky(toRef(props, 'sticky'), toRef(props, 'prefixCls'));
    const summaryFixedInfos = reactive({});
    const fixFooter = computed(() => {
      const info = Object.values(summaryFixedInfos)[0];
      return (fixHeader.value || stickyState.value.isSticky) && info;
    });
    const summaryCollect = (uniKey, fixed) => {
      if (fixed) {
        summaryFixedInfos[uniKey] = fixed;
      } else {
        delete summaryFixedInfos[uniKey];
      }
    };
    // Scroll
    const scrollXStyle = ref({});
    const scrollYStyle = ref({});
    const scrollTableStyle = ref({});
    watchEffect(() => {
      if (fixHeader.value) {
        scrollYStyle.value = {
          overflowY: 'scroll',
          maxHeight: toPx(props.scroll.y)
        };
      }
      if (horizonScroll.value) {
        scrollXStyle.value = {
          overflowX: 'auto'
        };
        // When no vertical scrollbar, should hide it
        // https://github.com/ant-design/ant-design/pull/20705
        // https://github.com/ant-design/ant-design/issues/21879
        if (!fixHeader.value) {
          scrollYStyle.value = {
            overflowY: 'hidden'
          };
        }
        scrollTableStyle.value = {
          width: props.scroll.x === true ? 'auto' : toPx(props.scroll.x),
          minWidth: '100%'
        };
      }
    });
    const onColumnResize = (columnKey, width) => {
      if (isVisible(fullTableRef.value)) {
        updateColsWidths(widths => {
          if (widths.get(columnKey) !== width) {
            const newWidths = new Map(widths);
            newWidths.set(columnKey, width);
            return newWidths;
          }
          return widths;
        });
      }
    };
    const [setScrollTarget, getScrollTarget] = useTimeoutLock(null);
    function forceScroll(scrollLeft, target) {
      if (!target) {
        return;
      }
      if (typeof target === 'function') {
        target(scrollLeft);
        return;
      }
      const domTarget = target.$el || target;
      if (domTarget.scrollLeft !== scrollLeft) {
        // eslint-disable-next-line no-param-reassign
        domTarget.scrollLeft = scrollLeft;
      }
    }
    const onScroll = _ref3 => {
      let {
        currentTarget,
        scrollLeft
      } = _ref3;
      var _a;
      const isRTL = props.direction === 'rtl';
      const mergedScrollLeft = typeof scrollLeft === 'number' ? scrollLeft : currentTarget.scrollLeft;
      const compareTarget = currentTarget || EMPTY_SCROLL_TARGET;
      if (!getScrollTarget() || getScrollTarget() === compareTarget) {
        setScrollTarget(compareTarget);
        forceScroll(mergedScrollLeft, scrollHeaderRef.value);
        forceScroll(mergedScrollLeft, scrollBodyRef.value);
        forceScroll(mergedScrollLeft, scrollSummaryRef.value);
        forceScroll(mergedScrollLeft, (_a = stickyRef.value) === null || _a === void 0 ? void 0 : _a.setScrollLeft);
      }
      if (currentTarget) {
        const {
          scrollWidth,
          clientWidth
        } = currentTarget;
        if (isRTL) {
          setPingedLeft(-mergedScrollLeft < scrollWidth - clientWidth);
          setPingedRight(-mergedScrollLeft > 0);
        } else {
          setPingedLeft(mergedScrollLeft > 0);
          setPingedRight(mergedScrollLeft < scrollWidth - clientWidth);
        }
      }
    };
    const triggerOnScroll = () => {
      if (horizonScroll.value && scrollBodyRef.value) {
        onScroll({
          currentTarget: scrollBodyRef.value
        });
      } else {
        setPingedLeft(false);
        setPingedRight(false);
      }
    };
    let timtout;
    const updateWidth = width => {
      if (width !== componentWidth.value) {
        triggerOnScroll();
        componentWidth.value = fullTableRef.value ? fullTableRef.value.offsetWidth : width;
      }
    };
    const onFullTableResize = _ref4 => {
      let {
        width
      } = _ref4;
      clearTimeout(timtout);
      if (componentWidth.value === 0) {
        updateWidth(width);
        return;
      }
      timtout = setTimeout(() => {
        updateWidth(width);
      }, 100);
    };
    watch([horizonScroll, () => props.data, () => props.columns], () => {
      if (horizonScroll.value) {
        triggerOnScroll();
      }
    }, {
      flush: 'post'
    });
    const [scrollbarSize, setScrollbarSize] = useState(0);
    useProvideSticky();
    onMounted(() => {
      nextTick(() => {
        var _a, _b;
        triggerOnScroll();
        setScrollbarSize(getTargetScrollBarSize(scrollBodyRef.value).width);
        scrollBodySizeInfo.value = {
          scrollWidth: ((_a = scrollBodyRef.value) === null || _a === void 0 ? void 0 : _a.scrollWidth) || 0,
          clientWidth: ((_b = scrollBodyRef.value) === null || _b === void 0 ? void 0 : _b.clientWidth) || 0
        };
      });
    });
    onUpdated(() => {
      nextTick(() => {
        var _a, _b;
        const scrollWidth = ((_a = scrollBodyRef.value) === null || _a === void 0 ? void 0 : _a.scrollWidth) || 0;
        const clientWidth = ((_b = scrollBodyRef.value) === null || _b === void 0 ? void 0 : _b.clientWidth) || 0;
        if (scrollBodySizeInfo.value.scrollWidth !== scrollWidth || scrollBodySizeInfo.value.clientWidth !== clientWidth) {
          scrollBodySizeInfo.value = {
            scrollWidth,
            clientWidth
          };
        }
      });
    });
    watchEffect(() => {
      if (props.internalHooks === INTERNAL_HOOKS && props.internalRefs) {
        props.onUpdateInternalRefs({
          body: scrollBodyRef.value ? scrollBodyRef.value.$el || scrollBodyRef.value : null
        });
      }
    }, {
      flush: 'post'
    });
    // Table layout
    const mergedTableLayout = computed(() => {
      if (props.tableLayout) {
        return props.tableLayout;
      }
      // https://github.com/ant-design/ant-design/issues/25227
      // When scroll.x is max-content, no need to fix table layout
      // it's width should stretch out to fit content
      if (fixColumn.value) {
        return props.scroll.x === 'max-content' ? 'auto' : 'fixed';
      }
      if (fixHeader.value || stickyState.value.isSticky || flattenColumns.value.some(_ref5 => {
        let {
          ellipsis
        } = _ref5;
        return ellipsis;
      })) {
        return 'fixed';
      }
      return 'auto';
    });
    const emptyNode = () => {
      var _a;
      return hasData.value ? null : ((_a = slots.emptyText) === null || _a === void 0 ? void 0 : _a.call(slots)) || 'No Data';
    };
    useProvideTable(reactive(_extends(_extends({}, toRefs(reactivePick(props, 'prefixCls', 'direction', 'transformCellText'))), {
      getComponent,
      scrollbarSize,
      fixedInfoList: computed(() => flattenColumns.value.map((_, colIndex) => getCellFixedInfo(colIndex, colIndex, flattenColumns.value, stickyOffsets.value, props.direction))),
      isSticky: computed(() => stickyState.value.isSticky),
      summaryCollect
    })));
    useProvideBody(reactive(_extends(_extends({}, toRefs(reactivePick(props, 'rowClassName', 'expandedRowClassName', 'expandRowByClick', 'expandedRowRender', 'expandIconColumnIndex', 'indentSize'))), {
      columns,
      flattenColumns,
      tableLayout: mergedTableLayout,
      expandIcon: mergedExpandIcon,
      expandableType,
      onTriggerExpand
    })));
    useProvideResize({
      onColumnResize
    });
    useProvideExpandedRow({
      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll
    });
    // Body
    const bodyTable = () => _createVNode(Body, {
      "data": mergedData.value,
      "measureColumnWidth": fixHeader.value || horizonScroll.value || stickyState.value.isSticky,
      "expandedKeys": mergedExpandedKeys.value,
      "rowExpandable": props.rowExpandable,
      "getRowKey": getRowKey.value,
      "customRow": props.customRow,
      "childrenColumnName": mergedChildrenColumnName.value
    }, {
      emptyNode
    });
    const bodyColGroup = () => _createVNode(ColGroup, {
      "colWidths": flattenColumns.value.map(_ref6 => {
        let {
          width
        } = _ref6;
        return width;
      }),
      "columns": flattenColumns.value
    }, null);
    return () => {
      var _a;
      const {
        prefixCls,
        scroll,
        tableLayout,
        direction,
        // Additional Part
        title = slots.title,
        footer = slots.footer,
        // Customize
        id,
        showHeader,
        customHeaderRow
      } = props;
      const {
        isSticky,
        offsetHeader,
        offsetSummary,
        offsetScroll,
        stickyClassName,
        container
      } = stickyState.value;
      const TableComponent = getComponent(['table'], 'table');
      const customizeScrollBody = getComponent(['body']);
      const summaryNode = (_a = slots.summary) === null || _a === void 0 ? void 0 : _a.call(slots, {
        pageData: mergedData.value
      });
      let groupTableNode = () => null;
      // Header props
      const headerProps = {
        colWidths: colWidths.value,
        columCount: flattenColumns.value.length,
        stickyOffsets: stickyOffsets.value,
        customHeaderRow,
        fixHeader: fixHeader.value,
        scroll
      };
      if (process.env.NODE_ENV !== 'production' && typeof customizeScrollBody === 'function' && hasData.value && !fixHeader.value) {
        warning(false, '`components.body` with render props is only work on `scroll.y`.');
      }
      if (fixHeader.value || isSticky) {
        // >>>>>> Fixed Header
        let bodyContent = () => null;
        if (typeof customizeScrollBody === 'function') {
          bodyContent = () => customizeScrollBody(mergedData.value, {
            scrollbarSize: scrollbarSize.value,
            ref: scrollBodyRef,
            onScroll
          });
          headerProps.colWidths = flattenColumns.value.map((_ref7, index) => {
            let {
              width
            } = _ref7;
            const colWidth = index === columns.value.length - 1 ? width - scrollbarSize.value : width;
            if (typeof colWidth === 'number' && !Number.isNaN(colWidth)) {
              return colWidth;
            }
            warning(false, 'When use `components.body` with render props. Each column should have a fixed `width` value.');
            return 0;
          });
        } else {
          bodyContent = () => _createVNode("div", {
            "style": _extends(_extends({}, scrollXStyle.value), scrollYStyle.value),
            "onScroll": onScroll,
            "ref": scrollBodyRef,
            "class": classNames(`${prefixCls}-body`)
          }, [_createVNode(TableComponent, {
            "style": _extends(_extends({}, scrollTableStyle.value), {
              tableLayout: mergedTableLayout.value
            })
          }, {
            default: () => [bodyColGroup(), bodyTable(), !fixFooter.value && summaryNode && _createVNode(Footer, {
              "stickyOffsets": stickyOffsets.value,
              "flattenColumns": flattenColumns.value
            }, {
              default: () => [summaryNode]
            })]
          })]);
        }
        // Fixed holder share the props
        const fixedHolderProps = _extends(_extends(_extends({
          noData: !mergedData.value.length,
          maxContentScroll: horizonScroll.value && scroll.x === 'max-content'
        }, headerProps), columnContext.value), {
          direction,
          stickyClassName,
          onScroll
        });
        groupTableNode = () => _createVNode(_Fragment, null, [showHeader !== false && _createVNode(FixedHolder, _objectSpread(_objectSpread({}, fixedHolderProps), {}, {
          "stickyTopOffset": offsetHeader,
          "class": `${prefixCls}-header`,
          "ref": scrollHeaderRef
        }), {
          default: fixedHolderPassProps => _createVNode(_Fragment, null, [_createVNode(Header, fixedHolderPassProps, null), fixFooter.value === 'top' && _createVNode(Footer, fixedHolderPassProps, {
            default: () => [summaryNode]
          })])
        }), bodyContent(), fixFooter.value && fixFooter.value !== 'top' && _createVNode(FixedHolder, _objectSpread(_objectSpread({}, fixedHolderProps), {}, {
          "stickyBottomOffset": offsetSummary,
          "class": `${prefixCls}-summary`,
          "ref": scrollSummaryRef
        }), {
          default: fixedHolderPassProps => _createVNode(Footer, fixedHolderPassProps, {
            default: () => [summaryNode]
          })
        }), isSticky && scrollBodyRef.value && _createVNode(StickyScrollBar, {
          "ref": stickyRef,
          "offsetScroll": offsetScroll,
          "scrollBodyRef": scrollBodyRef,
          "onScroll": onScroll,
          "container": container,
          "scrollBodySizeInfo": scrollBodySizeInfo.value
        }, null)]);
      } else {
        // >>>>>> Unique table
        groupTableNode = () => _createVNode("div", {
          "style": _extends(_extends({}, scrollXStyle.value), scrollYStyle.value),
          "class": classNames(`${prefixCls}-content`),
          "onScroll": onScroll,
          "ref": scrollBodyRef
        }, [_createVNode(TableComponent, {
          "style": _extends(_extends({}, scrollTableStyle.value), {
            tableLayout: mergedTableLayout.value
          })
        }, {
          default: () => [bodyColGroup(), showHeader !== false && _createVNode(Header, _objectSpread(_objectSpread({}, headerProps), columnContext.value), null), bodyTable(), summaryNode && _createVNode(Footer, {
            "stickyOffsets": stickyOffsets.value,
            "flattenColumns": flattenColumns.value
          }, {
            default: () => [summaryNode]
          })]
        })]);
      }
      const ariaProps = pickAttrs(attrs, {
        aria: true,
        data: true
      });
      const fullTable = () => _createVNode("div", _objectSpread(_objectSpread({}, ariaProps), {}, {
        "class": classNames(prefixCls, {
          [`${prefixCls}-rtl`]: direction === 'rtl',
          [`${prefixCls}-ping-left`]: pingedLeft.value,
          [`${prefixCls}-ping-right`]: pingedRight.value,
          [`${prefixCls}-layout-fixed`]: tableLayout === 'fixed',
          [`${prefixCls}-fixed-header`]: fixHeader.value,
          /** No used but for compatible */
          [`${prefixCls}-fixed-column`]: fixColumn.value,
          [`${prefixCls}-scroll-horizontal`]: horizonScroll.value,
          [`${prefixCls}-has-fix-left`]: flattenColumns.value[0] && flattenColumns.value[0].fixed,
          [`${prefixCls}-has-fix-right`]: flattenColumns.value[columnCount.value - 1] && flattenColumns.value[columnCount.value - 1].fixed === 'right',
          [attrs.class]: attrs.class
        }),
        "style": attrs.style,
        "id": id,
        "ref": fullTableRef
      }), [title && _createVNode(Panel, {
        "class": `${prefixCls}-title`
      }, {
        default: () => [title(mergedData.value)]
      }), _createVNode("div", {
        "class": `${prefixCls}-container`
      }, [groupTableNode()]), footer && _createVNode(Panel, {
        "class": `${prefixCls}-footer`
      }, {
        default: () => [footer(mergedData.value)]
      })]);
      if (horizonScroll.value) {
        return _createVNode(VCResizeObserver, {
          "onResize": onFullTableResize
        }, {
          default: fullTable
        });
      }
      return fullTable();
    };
  }
});