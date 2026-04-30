import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import CaretDownOutlined from "@ant-design/icons-vue/es/icons/CaretDownOutlined";
import CaretUpOutlined from "@ant-design/icons-vue/es/icons/CaretUpOutlined";
import Tooltip from '../../tooltip';
import { getColumnKey, getColumnPos, renderColumnTitle } from '../util';
import classNames from '../../_util/classNames';
import { computed } from 'vue';
import useState from '../../_util/hooks/useState';
import KeyCode from '../../_util/KeyCode';
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
      key: getColumnKey(column, columnPos),
      multiplePriority: getMultiplePriority(column),
      sortOrder: column.sortOrder
    });
  }
  (columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos);
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
          key: getColumnKey(column, columnPos),
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
    const columnPos = getColumnPos(index, pos);
    let newColumn = column;
    if (newColumn.sorter) {
      const sortDirections = newColumn.sortDirections || defaultSortDirections;
      const showSorterTooltip = newColumn.showSorterTooltip === undefined ? tableShowSorterTooltip : newColumn.showSorterTooltip;
      const columnKey = getColumnKey(newColumn, columnPos);
      const sorterState = sorterStates.find(_ref => {
        let {
          key
        } = _ref;
        return key === columnKey;
      });
      const sorterOrder = sorterState ? sorterState.sortOrder : null;
      const nextSortOrder = nextSortDirection(sortDirections, sorterOrder);
      const upNode = sortDirections.includes(ASCEND) && _createVNode(CaretUpOutlined, {
        "class": classNames(`${prefixCls}-column-sorter-up`, {
          active: sorterOrder === ASCEND
        }),
        "role": "presentation"
      }, null);
      const downNode = sortDirections.includes(DESCEND) && _createVNode(CaretDownOutlined, {
        "role": "presentation",
        "class": classNames(`${prefixCls}-column-sorter-down`, {
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
      newColumn = _extends(_extends({}, newColumn), {
        className: classNames(newColumn.className, {
          [`${prefixCls}-column-sort`]: sorterOrder
        }),
        title: renderProps => {
          const renderSortTitle = _createVNode("div", {
            "class": `${prefixCls}-column-sorters`
          }, [_createVNode("span", {
            "class": `${prefixCls}-column-title`
          }, [renderColumnTitle(column.title, renderProps)]), _createVNode("span", {
            "class": classNames(`${prefixCls}-column-sorter`, {
              [`${prefixCls}-column-sorter-full`]: !!(upNode && downNode)
            })
          }, [_createVNode("span", {
            "class": `${prefixCls}-column-sorter-inner`
          }, [upNode, downNode])])]);
          return showSorterTooltip ? _createVNode(Tooltip, tooltipProps, {
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
            if (event.keyCode === KeyCode.ENTER) {
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
          cell.class = classNames(cell.class, `${prefixCls}-column-has-sorters`);
          cell.tabindex = 0;
          return cell;
        }
      });
    }
    if ('children' in newColumn) {
      newColumn = _extends(_extends({}, newColumn), {
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
    return _extends(_extends({}, stateToInfo(sorterStates[sorterStates.length - 1])), {
      column: undefined
    });
  }
  if (list.length <= 1) {
    return list[0] || {};
  }
  return list;
}
export function getSortData(data, sortStates, childrenColumnName) {
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
      return _extends(_extends({}, record), {
        [childrenColumnName]: getSortData(subRecords, sortStates, childrenColumnName)
      });
    }
    return record;
  });
}
export default function useFilterSorter(_ref4) {
  let {
    prefixCls,
    mergedColumns,
    onSorterChange,
    sortDirections,
    tableLocale,
    showSorterTooltip
  } = _ref4;
  const [sortStates, setSortStates] = useState(collectSortStates(mergedColumns.value, true));
  const mergedSorterStates = computed(() => {
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
        validateStates.push(_extends(_extends({}, state), {
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
  const columnTitleSorterProps = computed(() => {
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
  const sorters = computed(() => generateSorterInfo(mergedSorterStates.value));
  return [transformColumns, mergedSorterStates, columnTitleSorterProps, sorters];
}