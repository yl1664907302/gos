"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFilterSorter;
exports.getSortData = getSortData;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _CaretDownOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CaretDownOutlined"));
var _CaretUpOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CaretUpOutlined"));
var _tooltip = _interopRequireDefault(require("../../tooltip"));
var _util = require("../util");
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _useState = _interopRequireDefault(require("../../_util/hooks/useState"));
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
const ASCEND = 'ascend';
const DESCEND = 'descend';
function getMultiplePriority(column) {
  if (typeof column.sorter === 'object' && typeof column.sorter.multiple === 'number') {
    return column.sorter.multiple;
  }
  return false;
}
function getSortFunction(sorter) {
  if (typeof sorter === 'function') {
    return sorter;
  }
  if (sorter && typeof sorter === 'object' && sorter.compare) {
    return sorter.compare;
  }
  return false;
}
function nextSortDirection(sortDirections, current) {
  if (!current) {
    return sortDirections[0];
  }
  return sortDirections[sortDirections.indexOf(current) + 1];
}
function collectSortStates(columns, init, pos) {
  let sortStates = [];
  function pushState(column, columnPos) {
    sortStates.push({
      column,
      key: (0, _util.getColumnKey)(column, columnPos),
      multiplePriority: getMultiplePriority(column),
      sortOrder: column.sortOrder
    });
  }
  (columns || []).forEach((column, index) => {
    const columnPos = (0, _util.getColumnPos)(index, pos);
    if (column.children) {
      if ('sortOrder' in column) {
        // Controlled
        pushState(column, columnPos);
      }
      sortStates = [...sortStates, ...collectSortStates(column.children, init, columnPos)];
    } else if (column.sorter) {
      if ('sortOrder' in column) {
        // Controlled
        pushState(column, columnPos);
      } else if (init && column.defaultSortOrder) {
        // Default sorter
        sortStates.push({
          column,
          key: (0, _util.getColumnKey)(column, columnPos),
          multiplePriority: getMultiplePriority(column),
          sortOrder: column.defaultSortOrder
        });
      }
    }
  });
  return sortStates;
}
function injectSorter(prefixCls, columns, sorterStates, triggerSorter, defaultSortDirections, tableLocale, tableShowSorterTooltip, pos) {
  return (columns || []).map((column, index) => {
    const columnPos = (0, _util.getColumnPos)(index, pos);
    let newColumn = column;
    if (newColumn.sorter) {
      const sortDirections = newColumn.sortDirections || defaultSortDirections;
      const showSorterTooltip = newColumn.showSorterTooltip === undefined ? tableShowSorterTooltip : newColumn.showSorterTooltip;
      const columnKey = (0, _util.getColumnKey)(newColumn, columnPos);
      const sorterState = sorterStates.find(_ref => {
        let {
          key
        } = _ref;
        return key === columnKey;
      });
      const sorterOrder = sorterState ? sorterState.sortOrder : null;
      const nextSortOrder = nextSortDirection(sortDirections, sorterOrder);
      const upNode = sortDirections.includes(ASCEND) && (0, _vue.createVNode)(_CaretUpOutlined.default, {
        "class": (0, _classNames.default)(`${prefixCls}-column-sorter-up`, {
          active: sorterOrder === ASCEND
        }),
        "role": "presentation"
      }, null);
      const downNode = sortDirections.includes(DESCEND) && (0, _vue.createVNode)(_CaretDownOutlined.default, {
        "role": "presentation",
        "class": (0, _classNames.default)(`${prefixCls}-column-sorter-down`, {
          active: sorterOrder === DESCEND
        })
      }, null);
      const {
        cancelSort,
        triggerAsc,
        triggerDesc
      } = tableLocale || {};
      let sortTip = cancelSort;
      if (nextSortOrder === DESCEND) {
        sortTip = triggerDesc;
      } else if (nextSortOrder === ASCEND) {
        sortTip = triggerAsc;
      }
      const tooltipProps = typeof showSorterTooltip === 'object' ? showSorterTooltip : {
        title: sortTip
      };
      newColumn = (0, _extends2.default)((0, _extends2.default)({}, newColumn), {
        className: (0, _classNames.default)(newColumn.className, {
          [`${prefixCls}-column-sort`]: sorterOrder
        }),
        title: renderProps => {
          const renderSortTitle = (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-column-sorters`
          }, [(0, _vue.createVNode)("span", {
            "class": `${prefixCls}-column-title`
          }, [(0, _util.renderColumnTitle)(column.title, renderProps)]), (0, _vue.createVNode)("span", {
            "class": (0, _classNames.default)(`${prefixCls}-column-sorter`, {
              [`${prefixCls}-column-sorter-full`]: !!(upNode && downNode)
            })
          }, [(0, _vue.createVNode)("span", {
            "class": `${prefixCls}-column-sorter-inner`
          }, [upNode, downNode])])]);
          return showSorterTooltip ? (0, _vue.createVNode)(_tooltip.default, tooltipProps, {
            default: () => [renderSortTitle]
          }) : renderSortTitle;
        },
        customHeaderCell: col => {
          const cell = column.customHeaderCell && column.customHeaderCell(col) || {};
          const originOnClick = cell.onClick;
          const originOKeyDown = cell.onKeydown;
          cell.onClick = event => {
            triggerSorter({
              column,
              key: columnKey,
              sortOrder: nextSortOrder,
              multiplePriority: getMultiplePriority(column)
            });
            if (originOnClick) {
              originOnClick(event);
            }
          };
          cell.onKeydown = event => {
            if (event.keyCode === _KeyCode.default.ENTER) {
              triggerSorter({
                column,
                key: columnKey,
                sortOrder: nextSortOrder,
                multiplePriority: getMultiplePriority(column)
              });
              originOKeyDown === null || originOKeyDown === void 0 ? void 0 : originOKeyDown(event);
            }
          };
          // Inform the screen-reader so it can tell the visually impaired user which column is sorted
          if (sorterOrder) {
            cell['aria-sort'] = sorterOrder === 'ascend' ? 'ascending' : 'descending';
          }
          cell.class = (0, _classNames.default)(cell.class, `${prefixCls}-column-has-sorters`);
          cell.tabindex = 0;
          return cell;
        }
      });
    }
    if ('children' in newColumn) {
      newColumn = (0, _extends2.default)((0, _extends2.default)({}, newColumn), {
        children: injectSorter(prefixCls, newColumn.children, sorterStates, triggerSorter, defaultSortDirections, tableLocale, tableShowSorterTooltip, columnPos)
      });
    }
    return newColumn;
  });
}
function stateToInfo(sorterStates) {
  const {
    column,
    sortOrder
  } = sorterStates;
  return {
    column,
    order: sortOrder,
    field: column.dataIndex,
    columnKey: column.key
  };
}
function generateSorterInfo(sorterStates) {
  const list = sorterStates.filter(_ref2 => {
    let {
      sortOrder
    } = _ref2;
    return sortOrder;
  }).map(stateToInfo);
  // =========== Legacy compatible support ===========
  // https://github.com/ant-design/ant-design/pull/19226
  if (list.length === 0 && sorterStates.length) {
    return (0, _extends2.default)((0, _extends2.default)({}, stateToInfo(sorterStates[sorterStates.length - 1])), {
      column: undefined
    });
  }
  if (list.length <= 1) {
    return list[0] || {};
  }
  return list;
}
function getSortData(data, sortStates, childrenColumnName) {
  const innerSorterStates = sortStates.slice().sort((a, b) => b.multiplePriority - a.multiplePriority);
  const cloneData = data.slice();
  const runningSorters = innerSorterStates.filter(_ref3 => {
    let {
      column: {
        sorter
      },
      sortOrder
    } = _ref3;
    return getSortFunction(sorter) && sortOrder;
  });
  // Skip if no sorter needed
  if (!runningSorters.length) {
    return cloneData;
  }
  return cloneData.sort((record1, record2) => {
    for (let i = 0; i < runningSorters.length; i += 1) {
      const sorterState = runningSorters[i];
      const {
        column: {
          sorter
        },
        sortOrder
      } = sorterState;
      const compareFn = getSortFunction(sorter);
      if (compareFn && sortOrder) {
        const compareResult = compareFn(record1, record2, sortOrder);
        if (compareResult !== 0) {
          return sortOrder === ASCEND ? compareResult : -compareResult;
        }
      }
    }
    return 0;
  }).map(record => {
    const subRecords = record[childrenColumnName];
    if (subRecords) {
      return (0, _extends2.default)((0, _extends2.default)({}, record), {
        [childrenColumnName]: getSortData(subRecords, sortStates, childrenColumnName)
      });
    }
    return record;
  });
}
function useFilterSorter(_ref4) {
  let {
    prefixCls,
    mergedColumns,
    onSorterChange,
    sortDirections,
    tableLocale,
    showSorterTooltip
  } = _ref4;
  const [sortStates, setSortStates] = (0, _useState.default)(collectSortStates(mergedColumns.value, true));
  const mergedSorterStates = (0, _vue.computed)(() => {
    let validate = true;
    const collectedStates = collectSortStates(mergedColumns.value, false);
    // Return if not controlled
    if (!collectedStates.length) {
      return sortStates.value;
    }
    const validateStates = [];
    function patchStates(state) {
      if (validate) {
        validateStates.push(state);
      } else {
        validateStates.push((0, _extends2.default)((0, _extends2.default)({}, state), {
          sortOrder: null
        }));
      }
    }
    let multipleMode = null;
    collectedStates.forEach(state => {
      if (multipleMode === null) {
        patchStates(state);
        if (state.sortOrder) {
          if (state.multiplePriority === false) {
            validate = false;
          } else {
            multipleMode = true;
          }
        }
      } else if (multipleMode && state.multiplePriority !== false) {
        patchStates(state);
      } else {
        validate = false;
        patchStates(state);
      }
    });
    return validateStates;
  });
  // Get render columns title required props
  const columnTitleSorterProps = (0, _vue.computed)(() => {
    const sortColumns = mergedSorterStates.value.map(_ref5 => {
      let {
        column,
        sortOrder
      } = _ref5;
      return {
        column,
        order: sortOrder
      };
    });
    return {
      sortColumns,
      // Legacy
      sortColumn: sortColumns[0] && sortColumns[0].column,
      sortOrder: sortColumns[0] && sortColumns[0].order
    };
  });
  function triggerSorter(sortState) {
    let newSorterStates;
    if (sortState.multiplePriority === false || !mergedSorterStates.value.length || mergedSorterStates.value[0].multiplePriority === false) {
      newSorterStates = [sortState];
    } else {
      newSorterStates = [...mergedSorterStates.value.filter(_ref6 => {
        let {
          key
        } = _ref6;
        return key !== sortState.key;
      }), sortState];
    }
    setSortStates(newSorterStates);
    onSorterChange(generateSorterInfo(newSorterStates), newSorterStates);
  }
  const transformColumns = innerColumns => injectSorter(prefixCls.value, innerColumns, mergedSorterStates.value, triggerSorter, sortDirections.value, tableLocale.value, showSorterTooltip.value);
  const sorters = (0, _vue.computed)(() => generateSorterInfo(mergedSorterStates.value));
  return [transformColumns, mergedSorterStates, columnTitleSorterProps, sorters];
}