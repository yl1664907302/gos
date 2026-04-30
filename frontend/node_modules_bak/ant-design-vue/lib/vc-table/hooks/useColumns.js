"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _warning = require("../../vc-util/warning");
var _legacyUtil = require("../utils/legacyUtil");
var _constant = require("../constant");
var _context = require("../../table/context");
var _vnode = require("../../_util/vnode");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function flatColumns(columns) {
  return columns.reduce((list, column) => {
    const {
      fixed
    } = column;
    // Convert `fixed='true'` to `fixed='left'` instead
    const parsedFixed = fixed === true ? 'left' : fixed;
    const subColumns = column.children;
    if (subColumns && subColumns.length > 0) {
      return [...list, ...flatColumns(subColumns).map(subColum => (0, _extends2.default)({
        fixed: parsedFixed
      }, subColum))];
    }
    return [...list, (0, _extends2.default)((0, _extends2.default)({}, column), {
      fixed: parsedFixed
    })];
  }, []);
}
function warningFixed(flattenColumns) {
  let allFixLeft = true;
  for (let i = 0; i < flattenColumns.length; i += 1) {
    const col = flattenColumns[i];
    if (allFixLeft && col.fixed !== 'left') {
      allFixLeft = false;
    } else if (!allFixLeft && col.fixed === 'left') {
      (0, _warning.warning)(false, `Index ${i - 1} of \`columns\` missing \`fixed='left'\` prop.`);
      break;
    }
  }
  let allFixRight = true;
  for (let i = flattenColumns.length - 1; i >= 0; i -= 1) {
    const col = flattenColumns[i];
    if (allFixRight && col.fixed !== 'right') {
      allFixRight = false;
    } else if (!allFixRight && col.fixed === 'right') {
      (0, _warning.warning)(false, `Index ${i + 1} of \`columns\` missing \`fixed='right'\` prop.`);
      break;
    }
  }
}
function revertForRtl(columns) {
  return columns.map(column => {
    const {
        fixed
      } = column,
      restProps = __rest(column, ["fixed"]);
    // Convert `fixed='left'` to `fixed='right'` instead
    let parsedFixed = fixed;
    if (fixed === 'left') {
      parsedFixed = 'right';
    } else if (fixed === 'right') {
      parsedFixed = 'left';
    }
    return (0, _extends2.default)({
      fixed: parsedFixed
    }, restProps);
  });
}
/**
 * Parse `columns` & `children` into `columns`.
 */
function useColumns(_ref, transformColumns) {
  let {
    prefixCls,
    columns: baseColumns,
    // children,
    expandable,
    expandedKeys,
    getRowKey,
    onTriggerExpand,
    expandIcon,
    rowExpandable,
    expandIconColumnIndex,
    direction,
    expandRowByClick,
    expandColumnWidth,
    expandFixed
  } = _ref;
  const contextSlots = (0, _context.useInjectSlots)();
  // Add expand column
  const withExpandColumns = (0, _vue.computed)(() => {
    if (expandable.value) {
      let cloneColumns = baseColumns.value.slice();
      // >>> Warning if use `expandIconColumnIndex`
      if (process.env.NODE_ENV !== 'production' && expandIconColumnIndex.value >= 0) {
        (0, _warning.warning)(false, '`expandIconColumnIndex` is deprecated. Please use `Table.EXPAND_COLUMN` in `columns` instead.');
      }
      // >>> Insert expand column if not exist
      if (!cloneColumns.includes(_constant.EXPAND_COLUMN)) {
        const expandColIndex = expandIconColumnIndex.value || 0;
        if (expandColIndex >= 0) {
          cloneColumns.splice(expandColIndex, 0, _constant.EXPAND_COLUMN);
        }
      }
      // >>> Deduplicate additional expand column
      if (process.env.NODE_ENV !== 'production' && cloneColumns.filter(c => c === _constant.EXPAND_COLUMN).length > 1) {
        (0, _warning.warning)(false, 'There exist more than one `EXPAND_COLUMN` in `columns`.');
      }
      const expandColumnIndex = cloneColumns.indexOf(_constant.EXPAND_COLUMN);
      cloneColumns = cloneColumns.filter((column, index) => column !== _constant.EXPAND_COLUMN || index === expandColumnIndex);
      // >>> Check if expand column need to fixed
      const prevColumn = baseColumns.value[expandColumnIndex];
      let fixedColumn;
      if ((expandFixed.value === 'left' || expandFixed.value) && !expandIconColumnIndex.value) {
        fixedColumn = 'left';
      } else if ((expandFixed.value === 'right' || expandFixed.value) && expandIconColumnIndex.value === baseColumns.value.length) {
        fixedColumn = 'right';
      } else {
        fixedColumn = prevColumn ? prevColumn.fixed : null;
      }
      const expandedKeysValue = expandedKeys.value;
      const rowExpandableValue = rowExpandable.value;
      const expandIconValue = expandIcon.value;
      const prefixClsValue = prefixCls.value;
      const expandRowByClickValue = expandRowByClick.value;
      // >>> Create expandable column
      const expandColumn = {
        [_legacyUtil.INTERNAL_COL_DEFINE]: {
          class: `${prefixCls.value}-expand-icon-col`,
          columnType: 'EXPAND_COLUMN'
        },
        title: (0, _vnode.customRenderSlot)(contextSlots.value, 'expandColumnTitle', {}, () => ['']),
        fixed: fixedColumn,
        class: `${prefixCls.value}-row-expand-icon-cell`,
        width: expandColumnWidth.value,
        customRender: _ref2 => {
          let {
            record,
            index
          } = _ref2;
          const rowKey = getRowKey.value(record, index);
          const expanded = expandedKeysValue.has(rowKey);
          const recordExpandable = rowExpandableValue ? rowExpandableValue(record) : true;
          const icon = expandIconValue({
            prefixCls: prefixClsValue,
            expanded,
            expandable: recordExpandable,
            record,
            onExpand: onTriggerExpand
          });
          if (expandRowByClickValue) {
            return (0, _vue.createVNode)("span", {
              "onClick": e => e.stopPropagation()
            }, [icon]);
          }
          return icon;
        }
      };
      return cloneColumns.map(col => col === _constant.EXPAND_COLUMN ? expandColumn : col);
    }
    if (process.env.NODE_ENV !== 'production' && baseColumns.value.includes(_constant.EXPAND_COLUMN)) {
      (0, _warning.warning)(false, '`expandable` is not config but there exist `EXPAND_COLUMN` in `columns`.');
    }
    return baseColumns.value.filter(col => col !== _constant.EXPAND_COLUMN);
  });
  const mergedColumns = (0, _vue.computed)(() => {
    let finalColumns = withExpandColumns.value;
    if (transformColumns.value) {
      finalColumns = transformColumns.value(finalColumns);
    }
    // Always provides at least one column for table display
    if (!finalColumns.length) {
      finalColumns = [{
        customRender: () => null
      }];
    }
    return finalColumns;
  });
  const flattenColumns = (0, _vue.computed)(() => {
    if (direction.value === 'rtl') {
      return revertForRtl(flatColumns(mergedColumns.value));
    }
    return flatColumns(mergedColumns.value);
  });
  // Only check out of production since it's waste for each render
  if (process.env.NODE_ENV !== 'production') {
    (0, _vue.watchEffect)(() => {
      setTimeout(() => {
        warningFixed(flattenColumns.value);
      });
    });
  }
  return [mergedColumns, flattenColumns];
}
var _default = exports.default = useColumns;