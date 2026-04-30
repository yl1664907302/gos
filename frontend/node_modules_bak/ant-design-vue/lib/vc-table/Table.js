"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.INTERNAL_HOOKS = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Header = _interopRequireDefault(require("./Header/Header"));
var _Body = _interopRequireDefault(require("./Body"));
var _useColumns = _interopRequireDefault(require("./hooks/useColumns"));
var _useFrame = require("./hooks/useFrame");
var _valueUtil = require("./utils/valueUtil");
var _useStickyOffsets = _interopRequireDefault(require("./hooks/useStickyOffsets"));
var _ColGroup = _interopRequireDefault(require("./ColGroup"));
var _Panel = _interopRequireDefault(require("./Panel"));
var _Footer = _interopRequireDefault(require("./Footer"));
var _expandUtil = require("./utils/expandUtil");
var _fixUtil = require("./utils/fixUtil");
var _stickyScrollBar = _interopRequireDefault(require("./stickyScrollBar"));
var _useSticky = _interopRequireDefault(require("./hooks/useSticky"));
var _FixedHolder = _interopRequireDefault(require("./FixedHolder"));
var _warning = require("../vc-util/warning");
var _reactivePick = require("../_util/reactivePick");
var _useState = _interopRequireDefault(require("../_util/hooks/useState"));
var _util = require("../_util/util");
var _isVisible = _interopRequireDefault(require("../vc-util/Dom/isVisible"));
var _getScrollBarSize = require("../_util/getScrollBarSize");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
var _TableContext = require("./context/TableContext");
var _BodyContext = require("./context/BodyContext");
var _ResizeContext = require("./context/ResizeContext");
var _StickyContext = require("./context/StickyContext");
var _pickAttrs = _interopRequireDefault(require("../_util/pickAttrs"));
var _ExpandedRowContext = require("./context/ExpandedRowContext");
// Used for conditions cache
const EMPTY_DATA = [];
// Used for customize scroll
const EMPTY_SCROLL_TARGET = {};
const INTERNAL_HOOKS = exports.INTERNAL_HOOKS = 'rc-table-internal-hook';
var _default = exports.default = (0, _vue.defineComponent)({
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
    const mergedData = (0, _vue.computed)(() => props.data || EMPTY_DATA);
    const hasData = (0, _vue.computed)(() => !!mergedData.value.length);
    // ==================== Customize =====================
    const mergedComponents = (0, _vue.computed)(() => (0, _valueUtil.mergeObject)(props.components, {}));
    const getComponent = (path, defaultComponent) => (0, _valueUtil.getPathValue)(mergedComponents.value, path) || defaultComponent;
    const getRowKey = (0, _vue.computed)(() => {
      const rowKey = props.rowKey;
      if (typeof rowKey === 'function') {
        return rowKey;
      }
      return record => {
        const key = record && record[rowKey];
        if (process.env.NODE_ENV !== 'production') {
          (0, _warning.warning)(key !== undefined, 'Each record in table should have a unique `key` prop, or set `rowKey` to an unique primary key.');
        }
        return key;
      };
    });
    // ====================== Expand ======================
    const mergedExpandIcon = (0, _vue.computed)(() => props.expandIcon || _expandUtil.renderExpandIcon);
    const mergedChildrenColumnName = (0, _vue.computed)(() => props.childrenColumnName || 'children');
    const expandableType = (0, _vue.computed)(() => {
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
    const innerExpandedKeys = (0, _vue.shallowRef)([]);
    const stop = (0, _vue.watchEffect)(() => {
      if (props.defaultExpandedRowKeys) {
        innerExpandedKeys.value = props.defaultExpandedRowKeys;
      }
      if (props.defaultExpandAllRows) {
        innerExpandedKeys.value = (0, _expandUtil.findAllChildrenKeys)(mergedData.value, getRowKey.value, mergedChildrenColumnName.value);
      }
    });
    // defalutXxxx 仅仅第一次生效
    stop();
    const mergedExpandedKeys = (0, _vue.computed)(() => new Set(props.expandedRowKeys || innerExpandedKeys.value || []));
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
      (0, _warning.warning)(false, '`expandedRowRender` should not use with nested Table');
    }
    const componentWidth = (0, _vue.ref)(0);
    const [columns, flattenColumns] = (0, _useColumns.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _vue.toRefs)(props)), {
      // children,
      expandable: (0, _vue.computed)(() => !!props.expandedRowRender),
      expandedKeys: mergedExpandedKeys,
      getRowKey,
      onTriggerExpand,
      expandIcon: mergedExpandIcon
    }), (0, _vue.computed)(() => props.internalHooks === INTERNAL_HOOKS ? props.transformColumns : null));
    const columnContext = (0, _vue.computed)(() => ({
      columns: columns.value,
      flattenColumns: flattenColumns.value
    }));
    // ====================== Scroll ======================
    const fullTableRef = (0, _vue.ref)();
    const scrollHeaderRef = (0, _vue.ref)();
    const scrollBodyRef = (0, _vue.ref)();
    const scrollBodySizeInfo = (0, _vue.ref)({
      scrollWidth: 0,
      clientWidth: 0
    });
    const scrollSummaryRef = (0, _vue.ref)();
    const [pingedLeft, setPingedLeft] = (0, _useState.default)(false);
    const [pingedRight, setPingedRight] = (0, _useState.default)(false);
    const [colsWidths, updateColsWidths] = (0, _useFrame.useLayoutState)(new Map());
    // Convert map to number width
    const colsKeys = (0, _vue.computed)(() => (0, _valueUtil.getColumnsKey)(flattenColumns.value));
    const colWidths = (0, _vue.computed)(() => colsKeys.value.map(columnKey => colsWidths.value.get(columnKey)));
    const columnCount = (0, _vue.computed)(() => flattenColumns.value.length);
    const stickyOffsets = (0, _useStickyOffsets.default)(colWidths, columnCount, (0, _vue.toRef)(props, 'direction'));
    const fixHeader = (0, _vue.computed)(() => props.scroll && (0, _valueUtil.validateValue)(props.scroll.y));
    const horizonScroll = (0, _vue.computed)(() => props.scroll && (0, _valueUtil.validateValue)(props.scroll.x) || Boolean(props.expandFixed));
    const fixColumn = (0, _vue.computed)(() => horizonScroll.value && flattenColumns.value.some(_ref2 => {
      let {
        fixed
      } = _ref2;
      return fixed;
    }));
    // Sticky
    const stickyRef = (0, _vue.ref)();
    const stickyState = (0, _useSticky.default)((0, _vue.toRef)(props, 'sticky'), (0, _vue.toRef)(props, 'prefixCls'));
    const summaryFixedInfos = (0, _vue.reactive)({});
    const fixFooter = (0, _vue.computed)(() => {
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
    const scrollXStyle = (0, _vue.ref)({});
    const scrollYStyle = (0, _vue.ref)({});
    const scrollTableStyle = (0, _vue.ref)({});
    (0, _vue.watchEffect)(() => {
      if (fixHeader.value) {
        scrollYStyle.value = {
          overflowY: 'scroll',
          maxHeight: (0, _util.toPx)(props.scroll.y)
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
          width: props.scroll.x === true ? 'auto' : (0, _util.toPx)(props.scroll.x),
          minWidth: '100%'
        };
      }
    });
    const onColumnResize = (columnKey, width) => {
      if ((0, _isVisible.default)(fullTableRef.value)) {
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
    const [setScrollTarget, getScrollTarget] = (0, _useFrame.useTimeoutLock)(null);
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
    (0, _vue.watch)([horizonScroll, () => props.data, () => props.columns], () => {
      if (horizonScroll.value) {
        triggerOnScroll();
      }
    }, {
      flush: 'post'
    });
    const [scrollbarSize, setScrollbarSize] = (0, _useState.default)(0);
    (0, _StickyContext.useProvideSticky)();
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        var _a, _b;
        triggerOnScroll();
        setScrollbarSize((0, _getScrollBarSize.getTargetScrollBarSize)(scrollBodyRef.value).width);
        scrollBodySizeInfo.value = {
          scrollWidth: ((_a = scrollBodyRef.value) === null || _a === void 0 ? void 0 : _a.scrollWidth) || 0,
          clientWidth: ((_b = scrollBodyRef.value) === null || _b === void 0 ? void 0 : _b.clientWidth) || 0
        };
      });
    });
    (0, _vue.onUpdated)(() => {
      (0, _vue.nextTick)(() => {
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
    (0, _vue.watchEffect)(() => {
      if (props.internalHooks === INTERNAL_HOOKS && props.internalRefs) {
        props.onUpdateInternalRefs({
          body: scrollBodyRef.value ? scrollBodyRef.value.$el || scrollBodyRef.value : null
        });
      }
    }, {
      flush: 'post'
    });
    // Table layout
    const mergedTableLayout = (0, _vue.computed)(() => {
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
    (0, _TableContext.useProvideTable)((0, _vue.reactive)((0, _extends2.default)((0, _extends2.default)({}, (0, _vue.toRefs)((0, _reactivePick.reactivePick)(props, 'prefixCls', 'direction', 'transformCellText'))), {
      getComponent,
      scrollbarSize,
      fixedInfoList: (0, _vue.computed)(() => flattenColumns.value.map((_, colIndex) => (0, _fixUtil.getCellFixedInfo)(colIndex, colIndex, flattenColumns.value, stickyOffsets.value, props.direction))),
      isSticky: (0, _vue.computed)(() => stickyState.value.isSticky),
      summaryCollect
    })));
    (0, _BodyContext.useProvideBody)((0, _vue.reactive)((0, _extends2.default)((0, _extends2.default)({}, (0, _vue.toRefs)((0, _reactivePick.reactivePick)(props, 'rowClassName', 'expandedRowClassName', 'expandRowByClick', 'expandedRowRender', 'expandIconColumnIndex', 'indentSize'))), {
      columns,
      flattenColumns,
      tableLayout: mergedTableLayout,
      expandIcon: mergedExpandIcon,
      expandableType,
      onTriggerExpand
    })));
    (0, _ResizeContext.useProvideResize)({
      onColumnResize
    });
    (0, _ExpandedRowContext.useProvideExpandedRow)({
      componentWidth,
      fixHeader,
      fixColumn,
      horizonScroll
    });
    // Body
    const bodyTable = () => (0, _vue.createVNode)(_Body.default, {
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
    const bodyColGroup = () => (0, _vue.createVNode)(_ColGroup.default, {
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
        (0, _warning.warning)(false, '`components.body` with render props is only work on `scroll.y`.');
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
            (0, _warning.warning)(false, 'When use `components.body` with render props. Each column should have a fixed `width` value.');
            return 0;
          });
        } else {
          bodyContent = () => (0, _vue.createVNode)("div", {
            "style": (0, _extends2.default)((0, _extends2.default)({}, scrollXStyle.value), scrollYStyle.value),
            "onScroll": onScroll,
            "ref": scrollBodyRef,
            "class": (0, _classNames.default)(`${prefixCls}-body`)
          }, [(0, _vue.createVNode)(TableComponent, {
            "style": (0, _extends2.default)((0, _extends2.default)({}, scrollTableStyle.value), {
              tableLayout: mergedTableLayout.value
            })
          }, {
            default: () => [bodyColGroup(), bodyTable(), !fixFooter.value && summaryNode && (0, _vue.createVNode)(_Footer.default, {
              "stickyOffsets": stickyOffsets.value,
              "flattenColumns": flattenColumns.value
            }, {
              default: () => [summaryNode]
            })]
          })]);
        }
        // Fixed holder share the props
        const fixedHolderProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
          noData: !mergedData.value.length,
          maxContentScroll: horizonScroll.value && scroll.x === 'max-content'
        }, headerProps), columnContext.value), {
          direction,
          stickyClassName,
          onScroll
        });
        groupTableNode = () => (0, _vue.createVNode)(_vue.Fragment, null, [showHeader !== false && (0, _vue.createVNode)(_FixedHolder.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, fixedHolderProps), {}, {
          "stickyTopOffset": offsetHeader,
          "class": `${prefixCls}-header`,
          "ref": scrollHeaderRef
        }), {
          default: fixedHolderPassProps => (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_Header.default, fixedHolderPassProps, null), fixFooter.value === 'top' && (0, _vue.createVNode)(_Footer.default, fixedHolderPassProps, {
            default: () => [summaryNode]
          })])
        }), bodyContent(), fixFooter.value && fixFooter.value !== 'top' && (0, _vue.createVNode)(_FixedHolder.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, fixedHolderProps), {}, {
          "stickyBottomOffset": offsetSummary,
          "class": `${prefixCls}-summary`,
          "ref": scrollSummaryRef
        }), {
          default: fixedHolderPassProps => (0, _vue.createVNode)(_Footer.default, fixedHolderPassProps, {
            default: () => [summaryNode]
          })
        }), isSticky && scrollBodyRef.value && (0, _vue.createVNode)(_stickyScrollBar.default, {
          "ref": stickyRef,
          "offsetScroll": offsetScroll,
          "scrollBodyRef": scrollBodyRef,
          "onScroll": onScroll,
          "container": container,
          "scrollBodySizeInfo": scrollBodySizeInfo.value
        }, null)]);
      } else {
        // >>>>>> Unique table
        groupTableNode = () => (0, _vue.createVNode)("div", {
          "style": (0, _extends2.default)((0, _extends2.default)({}, scrollXStyle.value), scrollYStyle.value),
          "class": (0, _classNames.default)(`${prefixCls}-content`),
          "onScroll": onScroll,
          "ref": scrollBodyRef
        }, [(0, _vue.createVNode)(TableComponent, {
          "style": (0, _extends2.default)((0, _extends2.default)({}, scrollTableStyle.value), {
            tableLayout: mergedTableLayout.value
          })
        }, {
          default: () => [bodyColGroup(), showHeader !== false && (0, _vue.createVNode)(_Header.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, headerProps), columnContext.value), null), bodyTable(), summaryNode && (0, _vue.createVNode)(_Footer.default, {
            "stickyOffsets": stickyOffsets.value,
            "flattenColumns": flattenColumns.value
          }, {
            default: () => [summaryNode]
          })]
        })]);
      }
      const ariaProps = (0, _pickAttrs.default)(attrs, {
        aria: true,
        data: true
      });
      const fullTable = () => (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, ariaProps), {}, {
        "class": (0, _classNames.default)(prefixCls, {
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
      }), [title && (0, _vue.createVNode)(_Panel.default, {
        "class": `${prefixCls}-title`
      }, {
        default: () => [title(mergedData.value)]
      }), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-container`
      }, [groupTableNode()]), footer && (0, _vue.createVNode)(_Panel.default, {
        "class": `${prefixCls}-footer`
      }, {
        default: () => [footer(mergedData.value)]
      })]);
      if (horizonScroll.value) {
        return (0, _vue.createVNode)(_vcResizeObserver.default, {
          "onResize": onFullTableResize
        }, {
          default: fullTable
        });
      }
      return fullTable();
    };
  }
});