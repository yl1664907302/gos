"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _propsUtil = require("../../_util/props-util");
var _valueUtil = require("../utils/valueUtil");
var _context = require("../../table/context");
var _legacyUtil = require("../utils/legacyUtil");
var _HoverContext = require("../context/HoverContext");
var _StickyContext = require("../context/StickyContext");
var _warning = require("../../vc-util/warning");
var _eagerComputed = _interopRequireDefault(require("../../_util/eagerComputed"));
var _vnode = require("../../_util/vnode");
var _class = require("../../vc-util/Dom/class");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/** Check if cell is in hover range */
function inHoverRange(cellStartRow, cellRowSpan, startRow, endRow) {
  const cellEndRow = cellStartRow + cellRowSpan - 1;
  return cellStartRow <= endRow && cellEndRow >= startRow;
}
function isRenderCell(data) {
  return data && typeof data === 'object' && !Array.isArray(data) && !(0, _vue.isVNode)(data);
}
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'Cell',
  props: ['prefixCls', 'record', 'index', 'renderIndex', 'dataIndex', 'customRender', 'component', 'colSpan', 'rowSpan', 'fixLeft', 'fixRight', 'firstFixLeft', 'lastFixLeft', 'firstFixRight', 'lastFixRight', 'appendNode', 'additionalProps', 'ellipsis', 'align', 'rowType', 'isSticky', 'column', 'cellType', 'transformCellText'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const contextSlots = (0, _context.useInjectSlots)();
    const {
      onHover,
      startRow,
      endRow
    } = (0, _HoverContext.useInjectHover)();
    const colSpan = (0, _vue.computed)(() => {
      var _a, _b, _c, _d;
      return (_c = (_a = props.colSpan) !== null && _a !== void 0 ? _a : (_b = props.additionalProps) === null || _b === void 0 ? void 0 : _b.colSpan) !== null && _c !== void 0 ? _c : (_d = props.additionalProps) === null || _d === void 0 ? void 0 : _d.colspan;
    });
    const rowSpan = (0, _vue.computed)(() => {
      var _a, _b, _c, _d;
      return (_c = (_a = props.rowSpan) !== null && _a !== void 0 ? _a : (_b = props.additionalProps) === null || _b === void 0 ? void 0 : _b.rowSpan) !== null && _c !== void 0 ? _c : (_d = props.additionalProps) === null || _d === void 0 ? void 0 : _d.rowspan;
    });
    const hovering = (0, _eagerComputed.default)(() => {
      const {
        index
      } = props;
      return inHoverRange(index, rowSpan.value || 1, startRow.value, endRow.value);
    });
    const supportSticky = (0, _StickyContext.useInjectSticky)();
    // ====================== Hover =======================
    const onMouseenter = (event, mergedRowSpan) => {
      var _a;
      const {
        record,
        index,
        additionalProps
      } = props;
      if (record) {
        onHover(index, index + mergedRowSpan - 1);
      }
      (_a = additionalProps === null || additionalProps === void 0 ? void 0 : additionalProps.onMouseenter) === null || _a === void 0 ? void 0 : _a.call(additionalProps, event);
    };
    const onMouseleave = event => {
      var _a;
      const {
        record,
        additionalProps
      } = props;
      if (record) {
        onHover(-1, -1);
      }
      (_a = additionalProps === null || additionalProps === void 0 ? void 0 : additionalProps.onMouseleave) === null || _a === void 0 ? void 0 : _a.call(additionalProps, event);
    };
    const getTitle = vnodes => {
      const vnode = (0, _propsUtil.filterEmpty)(vnodes)[0];
      if ((0, _vue.isVNode)(vnode)) {
        if (vnode.type === _vue.Text) {
          return vnode.children;
        } else {
          return Array.isArray(vnode.children) ? getTitle(vnode.children) : undefined;
        }
      } else {
        return vnode;
      }
    };
    const hoverRef = (0, _vue.shallowRef)(null);
    (0, _vue.watch)([hovering, () => props.prefixCls, hoverRef], () => {
      const cellDom = (0, _propsUtil.findDOMNode)(hoverRef.value);
      if (!cellDom) return;
      if (hovering.value) {
        (0, _class.addClass)(cellDom, `${props.prefixCls}-cell-row-hover`);
      } else {
        (0, _class.removeClass)(cellDom, `${props.prefixCls}-cell-row-hover`);
      }
    });
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const {
        prefixCls,
        record,
        index,
        renderIndex,
        dataIndex,
        customRender,
        component: Component = 'td',
        fixLeft,
        fixRight,
        firstFixLeft,
        lastFixLeft,
        firstFixRight,
        lastFixRight,
        appendNode = (_a = slots.appendNode) === null || _a === void 0 ? void 0 : _a.call(slots),
        additionalProps = {},
        ellipsis,
        align,
        rowType,
        isSticky,
        column = {},
        cellType
      } = props;
      const cellPrefixCls = `${prefixCls}-cell`;
      // ==================== Child Node ====================
      let cellProps;
      let childNode;
      const children = (_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots);
      if ((0, _valueUtil.validateValue)(children) || cellType === 'header') {
        childNode = children;
      } else {
        const value = (0, _valueUtil.getPathValue)(record, dataIndex);
        // Customize render node
        childNode = value;
        if (customRender) {
          const renderData = customRender({
            text: value,
            value,
            record,
            index,
            renderIndex,
            column: column.__originColumn__
          });
          if (isRenderCell(renderData)) {
            if (process.env.NODE_ENV !== 'production') {
              (0, _warning.warning)(false, '`columns.customRender` return cell props is deprecated with perf issue, please use `customCell` instead.');
            }
            childNode = renderData.children;
            cellProps = renderData.props;
          } else {
            childNode = renderData;
          }
        }
        if (!(_legacyUtil.INTERNAL_COL_DEFINE in column) && cellType === 'body' && contextSlots.value.bodyCell && !((_c = column.slots) === null || _c === void 0 ? void 0 : _c.customRender)) {
          const child = (0, _vnode.customRenderSlot)(contextSlots.value, 'bodyCell', {
            text: value,
            value,
            record,
            index,
            column: column.__originColumn__
          }, () => {
            const fallback = childNode === undefined ? value : childNode;
            return [typeof fallback === 'object' && (0, _propsUtil.isValidElement)(fallback) || typeof fallback !== 'object' ? fallback : null];
          });
          childNode = (0, _propsUtil.flattenChildren)(child);
        }
        /** maybe we should @deprecated */
        if (props.transformCellText) {
          childNode = props.transformCellText({
            text: childNode,
            record,
            index,
            column: column.__originColumn__
          });
        }
      }
      // Not crash if final `childNode` is not validate VueNode
      if (typeof childNode === 'object' && !Array.isArray(childNode) && !(0, _vue.isVNode)(childNode)) {
        childNode = null;
      }
      if (ellipsis && (lastFixLeft || firstFixRight)) {
        const _childNode = function () {
          return childNode;
        }();
        childNode = (0, _vue.createVNode)("span", {
          "class": `${cellPrefixCls}-content`
        }, [childNode]);
      }
      if (Array.isArray(childNode) && childNode.length === 1) {
        childNode = childNode[0];
      }
      const _g = cellProps || {},
        {
          colSpan: cellColSpan,
          rowSpan: cellRowSpan,
          style: cellStyle,
          class: cellClassName
        } = _g,
        restCellProps = __rest(_g, ["colSpan", "rowSpan", "style", "class"]);
      const mergedColSpan = (_d = cellColSpan !== undefined ? cellColSpan : colSpan.value) !== null && _d !== void 0 ? _d : 1;
      const mergedRowSpan = (_e = cellRowSpan !== undefined ? cellRowSpan : rowSpan.value) !== null && _e !== void 0 ? _e : 1;
      if (mergedColSpan === 0 || mergedRowSpan === 0) {
        return null;
      }
      // ====================== Fixed =======================
      const fixedStyle = {};
      const isFixLeft = typeof fixLeft === 'number' && supportSticky.value;
      const isFixRight = typeof fixRight === 'number' && supportSticky.value;
      if (isFixLeft) {
        fixedStyle.position = 'sticky';
        fixedStyle.left = `${fixLeft}px`;
      }
      if (isFixRight) {
        fixedStyle.position = 'sticky';
        fixedStyle.right = `${fixRight}px`;
      }
      // ====================== Align =======================
      const alignStyle = {};
      if (align) {
        alignStyle.textAlign = align;
      }
      // ====================== Render ======================
      let title;
      const ellipsisConfig = ellipsis === true ? {
        showTitle: true
      } : ellipsis;
      if (ellipsisConfig && (ellipsisConfig.showTitle || rowType === 'header')) {
        if (typeof childNode === 'string' || typeof childNode === 'number') {
          title = childNode.toString();
        } else if ((0, _vue.isVNode)(childNode)) {
          title = getTitle([childNode]);
        }
      }
      const componentProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
        title
      }, restCellProps), additionalProps), {
        colSpan: mergedColSpan !== 1 ? mergedColSpan : null,
        rowSpan: mergedRowSpan !== 1 ? mergedRowSpan : null,
        class: (0, _classNames.default)(cellPrefixCls, {
          [`${cellPrefixCls}-fix-left`]: isFixLeft && supportSticky.value,
          [`${cellPrefixCls}-fix-left-first`]: firstFixLeft && supportSticky.value,
          [`${cellPrefixCls}-fix-left-last`]: lastFixLeft && supportSticky.value,
          [`${cellPrefixCls}-fix-right`]: isFixRight && supportSticky.value,
          [`${cellPrefixCls}-fix-right-first`]: firstFixRight && supportSticky.value,
          [`${cellPrefixCls}-fix-right-last`]: lastFixRight && supportSticky.value,
          [`${cellPrefixCls}-ellipsis`]: ellipsis,
          [`${cellPrefixCls}-with-append`]: appendNode,
          [`${cellPrefixCls}-fix-sticky`]: (isFixLeft || isFixRight) && isSticky && supportSticky.value
        }, additionalProps.class, cellClassName),
        onMouseenter: e => {
          onMouseenter(e, mergedRowSpan);
        },
        onMouseleave,
        style: [additionalProps.style, alignStyle, fixedStyle, cellStyle]
      });
      return (0, _vue.createVNode)(Component, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, componentProps), {}, {
        "ref": hoverRef
      }), {
        default: () => [appendNode, childNode, (_f = slots.dragHandle) === null || _f === void 0 ? void 0 : _f.call(slots)]
      });
    };
  }
});