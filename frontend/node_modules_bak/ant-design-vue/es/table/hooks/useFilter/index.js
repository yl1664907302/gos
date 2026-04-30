import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import devWarning from '../../../vc-util/devWarning';
import useState from '../../../_util/hooks/useState';
import { computed } from 'vue';
import { getColumnPos, renderColumnTitle, getColumnKey } from '../../util';
import FilterDropdown from './FilterDropdown';
function collectFilterStates(columns, init, pos) {
  let filterStates = [];
  (columns || []).forEach((column, index) => {
    var _a, _b;
    const columnPos = getColumnPos(index, pos);
    const hasFilterDropdown = column.filterDropdown || ((_a = column === null || column === void 0 ? void 0 : column.slots) === null || _a === void 0 ? void 0 : _a.filterDropdown) || column.customFilterDropdown;
    if (column.filters || hasFilterDropdown || 'onFilter' in column) {
      if ('filteredValue' in column) {
        // Controlled
        let filteredValues = column.filteredValue;
        if (!hasFilterDropdown) {
          filteredValues = (_b = filteredValues === null || filteredValues === void 0 ? void 0 : filteredValues.map(String)) !== null && _b !== void 0 ? _b : filteredValues;
        }
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: filteredValues,
          forceFiltered: column.filtered
        });
      } else {
        // Uncontrolled
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: init && column.defaultFilteredValue ? column.defaultFilteredValue : undefined,
          forceFiltered: column.filtered
        });
      }
    }
    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children, init, columnPos)];
    }
  });
  return filterStates;
}
function injectFilter(prefixCls, dropdownPrefixCls, columns, filterStates, locale, triggerFilter, getPopupContainer, pos) {
  return columns.map((column, index) => {
    var _a;
    const columnPos = getColumnPos(index, pos);
    const {
      filterMultiple = true,
      filterMode,
      filterSearch
    } = column;
    let newColumn = column;
    const hasFilterDropdown = column.filterDropdown || ((_a = column === null || column === void 0 ? void 0 : column.slots) === null || _a === void 0 ? void 0 : _a.filterDropdown) || column.customFilterDropdown;
    if (newColumn.filters || hasFilterDropdown) {
      const columnKey = getColumnKey(newColumn, columnPos);
      const filterState = filterStates.find(_ref => {
        let {
          key
        } = _ref;
        return columnKey === key;
      });
      newColumn = _extends(_extends({}, newColumn), {
        title: renderProps => _createVNode(FilterDropdown, {
          "tablePrefixCls": prefixCls,
          "prefixCls": `${prefixCls}-filter`,
          "dropdownPrefixCls": dropdownPrefixCls,
          "column": newColumn,
          "columnKey": columnKey,
          "filterState": filterState,
          "filterMultiple": filterMultiple,
          "filterMode": filterMode,
          "filterSearch": filterSearch,
          "triggerFilter": triggerFilter,
          "locale": locale,
          "getPopupContainer": getPopupContainer
        }, {
          default: () => [renderColumnTitle(column.title, renderProps)]
        })
      });
    }
    if ('children' in newColumn) {
      newColumn = _extends(_extends({}, newColumn), {
        children: injectFilter(prefixCls, dropdownPrefixCls, newColumn.children, filterStates, locale, triggerFilter, getPopupContainer, columnPos)
      });
    }
    return newColumn;
  });
}
export function flattenKeys(filters) {
  let keys = [];
  (filters || []).forEach(_ref2 => {
    let {
      value,
      children
    } = _ref2;
    keys.push(value);
    if (children) {
      keys = [...keys, ...flattenKeys(children)];
    }
  });
  return keys;
}
function generateFilterInfo(filterStates) {
  const currentFilters = {};
  filterStates.forEach(_ref3 => {
    let {
      key,
      filteredKeys,
      column
    } = _ref3;
    var _a;
    const hasFilterDropdown = column.filterDropdown || ((_a = column === null || column === void 0 ? void 0 : column.slots) === null || _a === void 0 ? void 0 : _a.filterDropdown) || column.customFilterDropdown;
    const {
      filters
    } = column;
    if (hasFilterDropdown) {
      currentFilters[key] = filteredKeys || null;
    } else if (Array.isArray(filteredKeys)) {
      const keys = flattenKeys(filters);
      currentFilters[key] = keys.filter(originKey => filteredKeys.includes(String(originKey)));
    } else {
      currentFilters[key] = null;
    }
  });
  return currentFilters;
}
export function getFilterData(data, filterStates) {
  return filterStates.reduce((currentData, filterState) => {
    const {
      column: {
        onFilter,
        filters
      },
      filteredKeys
    } = filterState;
    if (onFilter && filteredKeys && filteredKeys.length) {
      return currentData.filter(record => filteredKeys.some(key => {
        const keys = flattenKeys(filters);
        const keyIndex = keys.findIndex(k => String(k) === String(key));
        const realKey = keyIndex !== -1 ? keys[keyIndex] : key;
        return onFilter(realKey, record);
      }));
    }
    return currentData;
  }, data);
}
function getMergedColumns(rawMergedColumns) {
  return rawMergedColumns.flatMap(column => {
    if ('children' in column) {
      return [column, ...getMergedColumns(column.children || [])];
    }
    return [column];
  });
}
function useFilter(_ref4) {
  let {
    prefixCls,
    dropdownPrefixCls,
    mergedColumns: rawMergedColumns,
    locale,
    onFilterChange,
    getPopupContainer
  } = _ref4;
  const mergedColumns = computed(() => getMergedColumns(rawMergedColumns.value));
  const [filterStates, setFilterStates] = useState(collectFilterStates(mergedColumns.value, true));
  const mergedFilterStates = computed(() => {
    const collectedStates = collectFilterStates(mergedColumns.value, false);
    if (collectedStates.length === 0) {
      return collectedStates;
    }
    let filteredKeysIsAllNotControlled = true;
    let filteredKeysIsAllControlled = true;
    collectedStates.forEach(_ref5 => {
      let {
        filteredKeys
      } = _ref5;
      if (filteredKeys !== undefined) {
        filteredKeysIsAllNotControlled = false;
      } else {
        filteredKeysIsAllControlled = false;
      }
    });
    // Return if not controlled
    if (filteredKeysIsAllNotControlled) {
      // Filter column may have been removed
      const keyList = (mergedColumns.value || []).map((column, index) => getColumnKey(column, getColumnPos(index)));
      return filterStates.value.filter(_ref6 => {
        let {
          key
        } = _ref6;
        return keyList.includes(key);
      }).map(item => {
        const col = mergedColumns.value[keyList.findIndex(key => key === item.key)];
        return _extends(_extends({}, item), {
          column: _extends(_extends({}, item.column), col),
          forceFiltered: col.filtered
        });
      });
    }
    devWarning(filteredKeysIsAllControlled, 'Table', 'Columns should all contain `filteredValue` or not contain `filteredValue`.');
    return collectedStates;
  });
  const filters = computed(() => generateFilterInfo(mergedFilterStates.value));
  const triggerFilter = filterState => {
    const newFilterStates = mergedFilterStates.value.filter(_ref7 => {
      let {
        key
      } = _ref7;
      return key !== filterState.key;
    });
    newFilterStates.push(filterState);
    setFilterStates(newFilterStates);
    onFilterChange(generateFilterInfo(newFilterStates), newFilterStates);
  };
  const transformColumns = innerColumns => {
    return injectFilter(prefixCls.value, dropdownPrefixCls.value, innerColumns, mergedFilterStates.value, locale.value, triggerFilter, getPopupContainer.value);
  };
  return [transformColumns, mergedFilterStates, filters];
}
export default useFilter;