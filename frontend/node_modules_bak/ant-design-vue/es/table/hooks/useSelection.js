import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import DownOutlined from "@ant-design/icons-vue/es/icons/DownOutlined";
import { INTERNAL_COL_DEFINE } from '../../vc-table';
import { arrAdd, arrDel } from '../../vc-tree/util';
import { conductCheck } from '../../vc-tree/utils/conductUtil';
import { convertDataToEntities } from '../../vc-tree/utils/treeUtil';
import devWarning from '../../vc-util/devWarning';
import useMergedState from '../../_util/hooks/useMergedState';
import useState from '../../_util/hooks/useState';
import { watchEffect, computed, shallowRef } from 'vue';
import Checkbox from '../../checkbox';
import Dropdown from '../../dropdown';
import Menu from '../../menu';
import Radio from '../../radio';
import useMaxLevel from '../../vc-tree/useMaxLevel';
// TODO: warning if use ajax!!!
export const SELECTION_COLUMN = {};
export const SELECTION_ALL = 'SELECT_ALL';
export const SELECTION_INVERT = 'SELECT_INVERT';
export const SELECTION_NONE = 'SELECT_NONE';
const EMPTY_LIST = [];
function flattenData(childrenColumnName, data) {
  let list = [];
  (data || []).forEach(record => {
    list.push(record);
    if (record && typeof record === 'object' && childrenColumnName in record) {
      list = [...list, ...flattenData(childrenColumnName, record[childrenColumnName])];
    }
  });
  return list;
}
export default function useSelection(rowSelectionRef, configRef) {
  const mergedRowSelection = computed(() => {
    const temp = rowSelectionRef.value || {};
    const {
      checkStrictly = true
    } = temp;
    return _extends(_extends({}, temp), {
      checkStrictly
    });
  });
  // ========================= Keys =========================
  const [mergedSelectedKeys, setMergedSelectedKeys] = useMergedState(mergedRowSelection.value.selectedRowKeys || mergedRowSelection.value.defaultSelectedRowKeys || EMPTY_LIST, {
    value: computed(() => mergedRowSelection.value.selectedRowKeys)
  });
  // ======================== Caches ========================
  const preserveRecordsRef = shallowRef(new Map());
  const updatePreserveRecordsCache = keys => {
    if (mergedRowSelection.value.preserveSelectedRowKeys) {
      const newCache = new Map();
      // Keep key if mark as preserveSelectedRowKeys
      keys.forEach(key => {
        let record = configRef.getRecordByKey(key);
        if (!record && preserveRecordsRef.value.has(key)) {
          record = preserveRecordsRef.value.get(key);
        }
        newCache.set(key, record);
      });
      // Refresh to new cache
      preserveRecordsRef.value = newCache;
    }
  };
  watchEffect(() => {
    updatePreserveRecordsCache(mergedSelectedKeys.value);
  });
  const keyEntities = computed(() => mergedRowSelection.value.checkStrictly ? null : convertDataToEntities(configRef.data.value, {
    externalGetKey: configRef.getRowKey.value,
    childrenPropName: configRef.childrenColumnName.value
  }).keyEntities);
  // Get flatten data
  const flattedData = computed(() => flattenData(configRef.childrenColumnName.value, configRef.pageData.value));
  // Get all checkbox props
  const checkboxPropsMap = computed(() => {
    const map = new Map();
    const getRowKey = configRef.getRowKey.value;
    const getCheckboxProps = mergedRowSelection.value.getCheckboxProps;
    flattedData.value.forEach((record, index) => {
      const key = getRowKey(record, index);
      const checkboxProps = (getCheckboxProps ? getCheckboxProps(record) : null) || {};
      map.set(key, checkboxProps);
      if (process.env.NODE_ENV !== 'production' && ('checked' in checkboxProps || 'defaultChecked' in checkboxProps)) {
        devWarning(false, 'Table', 'Do not set `checked` or `defaultChecked` in `getCheckboxProps`. Please use `selectedRowKeys` instead.');
      }
    });
    return map;
  });
  const {
    maxLevel,
    levelEntities
  } = useMaxLevel(keyEntities);
  const isCheckboxDisabled = r => {
    var _a;
    return !!((_a = checkboxPropsMap.value.get(configRef.getRowKey.value(r))) === null || _a === void 0 ? void 0 : _a.disabled);
  };
  const selectKeysState = computed(() => {
    if (mergedRowSelection.value.checkStrictly) {
      return [mergedSelectedKeys.value || [], []];
    }
    const {
      checkedKeys,
      halfCheckedKeys
    } = conductCheck(mergedSelectedKeys.value, true, keyEntities.value, maxLevel.value, levelEntities.value, isCheckboxDisabled);
    return [checkedKeys || [], halfCheckedKeys];
  });
  const derivedSelectedKeys = computed(() => selectKeysState.value[0]);
  const derivedHalfSelectedKeys = computed(() => selectKeysState.value[1]);
  const derivedSelectedKeySet = computed(() => {
    const keys = mergedRowSelection.value.type === 'radio' ? derivedSelectedKeys.value.slice(0, 1) : derivedSelectedKeys.value;
    return new Set(keys);
  });
  const derivedHalfSelectedKeySet = computed(() => mergedRowSelection.value.type === 'radio' ? new Set() : new Set(derivedHalfSelectedKeys.value));
  // Save last selected key to enable range selection
  const [lastSelectedKey, setLastSelectedKey] = useState(null);
  // // Reset if rowSelection reset
  // we use computed to reset, donot need setMergedSelectedKeys again like react
  // https://github.com/vueComponent/ant-design-vue/issues/4885
  // watchEffect(() => {
  //   if (!rowSelectionRef.value) {
  //     setMergedSelectedKeys([]);
  //   }
  // });
  const setSelectedKeys = keys => {
    let availableKeys;
    let records;
    updatePreserveRecordsCache(keys);
    const {
      preserveSelectedRowKeys,
      onChange: onSelectionChange
    } = mergedRowSelection.value;
    const {
      getRecordByKey
    } = configRef;
    if (preserveSelectedRowKeys) {
      availableKeys = keys;
      records = keys.map(key => preserveRecordsRef.value.get(key));
    } else {
      // Filter key which not exist in the `dataSource`
      availableKeys = [];
      records = [];
      keys.forEach(key => {
        const record = getRecordByKey(key);
        if (record !== undefined) {
          availableKeys.push(key);
          records.push(record);
        }
      });
    }
    setMergedSelectedKeys(availableKeys);
    onSelectionChange === null || onSelectionChange === void 0 ? void 0 : onSelectionChange(availableKeys, records);
  };
  // ====================== Selections ======================
  // Trigger single `onSelect` event
  const triggerSingleSelection = (key, selected, keys, event) => {
    const {
      onSelect
    } = mergedRowSelection.value;
    const {
      getRecordByKey
    } = configRef || {};
    if (onSelect) {
      const rows = keys.map(k => getRecordByKey(k));
      onSelect(getRecordByKey(key), selected, rows, event);
    }
    setSelectedKeys(keys);
  };
  const mergedSelections = computed(() => {
    const {
      onSelectInvert,
      onSelectNone,
      selections,
      hideSelectAll
    } = mergedRowSelection.value;
    const {
      data,
      pageData,
      getRowKey,
      locale: tableLocale
    } = configRef;
    if (!selections || hideSelectAll) {
      return null;
    }
    const selectionList = selections === true ? [SELECTION_ALL, SELECTION_INVERT, SELECTION_NONE] : selections;
    return selectionList.map(selection => {
      if (selection === SELECTION_ALL) {
        return {
          key: 'all',
          text: tableLocale.value.selectionAll,
          onSelect() {
            setSelectedKeys(data.value.map((record, index) => getRowKey.value(record, index)).filter(key => {
              const checkProps = checkboxPropsMap.value.get(key);
              return !(checkProps === null || checkProps === void 0 ? void 0 : checkProps.disabled) || derivedSelectedKeySet.value.has(key);
            }));
          }
        };
      }
      if (selection === SELECTION_INVERT) {
        return {
          key: 'invert',
          text: tableLocale.value.selectInvert,
          onSelect() {
            const keySet = new Set(derivedSelectedKeySet.value);
            pageData.value.forEach((record, index) => {
              const key = getRowKey.value(record, index);
              const checkProps = checkboxPropsMap.value.get(key);
              if (!(checkProps === null || checkProps === void 0 ? void 0 : checkProps.disabled)) {
                if (keySet.has(key)) {
                  keySet.delete(key);
                } else {
                  keySet.add(key);
                }
              }
            });
            const keys = Array.from(keySet);
            if (onSelectInvert) {
              devWarning(false, 'Table', '`onSelectInvert` will be removed in future. Please use `onChange` instead.');
              onSelectInvert(keys);
            }
            setSelectedKeys(keys);
          }
        };
      }
      if (selection === SELECTION_NONE) {
        return {
          key: 'none',
          text: tableLocale.value.selectNone,
          onSelect() {
            onSelectNone === null || onSelectNone === void 0 ? void 0 : onSelectNone();
            setSelectedKeys(Array.from(derivedSelectedKeySet.value).filter(key => {
              const checkProps = checkboxPropsMap.value.get(key);
              return checkProps === null || checkProps === void 0 ? void 0 : checkProps.disabled;
            }));
          }
        };
      }
      return selection;
    });
  });
  const flattedDataLength = computed(() => flattedData.value.length);
  // ======================= Columns ========================
  const transformColumns = columns => {
    var _a;
    const {
      onSelectAll,
      onSelectMultiple,
      columnWidth: selectionColWidth,
      type: selectionType,
      fixed,
      renderCell: customizeRenderCell,
      hideSelectAll,
      checkStrictly
    } = mergedRowSelection.value;
    const {
      prefixCls,
      getRecordByKey,
      getRowKey,
      expandType,
      getPopupContainer
    } = configRef;
    if (!rowSelectionRef.value) {
      if (process.env.NODE_ENV !== 'production') {
        devWarning(!columns.includes(SELECTION_COLUMN), 'Table', '`rowSelection` is not config but `SELECTION_COLUMN` exists in the `columns`.');
      }
      return columns.filter(col => col !== SELECTION_COLUMN);
    }
    // Support selection
    let cloneColumns = columns.slice();
    const keySet = new Set(derivedSelectedKeySet.value);
    // Record key only need check with enabled
    const recordKeys = flattedData.value.map(getRowKey.value).filter(key => !checkboxPropsMap.value.get(key).disabled);
    const checkedCurrentAll = recordKeys.every(key => keySet.has(key));
    const checkedCurrentSome = recordKeys.some(key => keySet.has(key));
    const onSelectAllChange = () => {
      const changeKeys = [];
      if (checkedCurrentAll) {
        recordKeys.forEach(key => {
          keySet.delete(key);
          changeKeys.push(key);
        });
      } else {
        recordKeys.forEach(key => {
          if (!keySet.has(key)) {
            keySet.add(key);
            changeKeys.push(key);
          }
        });
      }
      const keys = Array.from(keySet);
      onSelectAll === null || onSelectAll === void 0 ? void 0 : onSelectAll(!checkedCurrentAll, keys.map(k => getRecordByKey(k)), changeKeys.map(k => getRecordByKey(k)));
      setSelectedKeys(keys);
    };
    // ===================== Render =====================
    // Title Cell
    let title;
    if (selectionType !== 'radio') {
      let customizeSelections;
      if (mergedSelections.value) {
        const menu = _createVNode(Menu, {
          "getPopupContainer": getPopupContainer.value
        }, {
          default: () => [mergedSelections.value.map((selection, index) => {
            const {
              key,
              text,
              onSelect: onSelectionClick
            } = selection;
            return _createVNode(Menu.Item, {
              "key": key || index,
              "onClick": () => {
                onSelectionClick === null || onSelectionClick === void 0 ? void 0 : onSelectionClick(recordKeys);
              }
            }, {
              default: () => [text]
            });
          })]
        });
        customizeSelections = _createVNode("div", {
          "class": `${prefixCls.value}-selection-extra`
        }, [_createVNode(Dropdown, {
          "overlay": menu,
          "getPopupContainer": getPopupContainer.value
        }, {
          default: () => [_createVNode("span", null, [_createVNode(DownOutlined, null, null)])]
        })]);
      }
      const allDisabledData = flattedData.value.map((record, index) => {
        const key = getRowKey.value(record, index);
        const checkboxProps = checkboxPropsMap.value.get(key) || {};
        return _extends({
          checked: keySet.has(key)
        }, checkboxProps);
      }).filter(_ref => {
        let {
          disabled
        } = _ref;
        return disabled;
      });
      const allDisabled = !!allDisabledData.length && allDisabledData.length === flattedDataLength.value;
      const allDisabledAndChecked = allDisabled && allDisabledData.every(_ref2 => {
        let {
          checked
        } = _ref2;
        return checked;
      });
      const allDisabledSomeChecked = allDisabled && allDisabledData.some(_ref3 => {
        let {
          checked
        } = _ref3;
        return checked;
      });
      title = !hideSelectAll && _createVNode("div", {
        "class": `${prefixCls.value}-selection`
      }, [_createVNode(Checkbox, {
        "checked": !allDisabled ? !!flattedDataLength.value && checkedCurrentAll : allDisabledAndChecked,
        "indeterminate": !allDisabled ? !checkedCurrentAll && checkedCurrentSome : !allDisabledAndChecked && allDisabledSomeChecked,
        "onChange": onSelectAllChange,
        "disabled": flattedDataLength.value === 0 || allDisabled,
        "aria-label": customizeSelections ? 'Custom selection' : 'Select all',
        "skipGroup": true
      }, null), customizeSelections]);
    }
    // Body Cell
    let renderCell;
    if (selectionType === 'radio') {
      renderCell = _ref4 => {
        let {
          record,
          index
        } = _ref4;
        const key = getRowKey.value(record, index);
        const checked = keySet.has(key);
        return {
          node: _createVNode(Radio, _objectSpread(_objectSpread({}, checkboxPropsMap.value.get(key)), {}, {
            "checked": checked,
            "onClick": e => e.stopPropagation(),
            "onChange": event => {
              if (!keySet.has(key)) {
                triggerSingleSelection(key, true, [key], event.nativeEvent);
              }
            }
          }), null),
          checked
        };
      };
    } else {
      renderCell = _ref5 => {
        let {
          record,
          index
        } = _ref5;
        var _a;
        const key = getRowKey.value(record, index);
        const checked = keySet.has(key);
        const indeterminate = derivedHalfSelectedKeySet.value.has(key);
        const checkboxProps = checkboxPropsMap.value.get(key);
        let mergedIndeterminate;
        if (expandType.value === 'nest') {
          mergedIndeterminate = indeterminate;
          devWarning(typeof (checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.indeterminate) !== 'boolean', 'Table', 'set `indeterminate` using `rowSelection.getCheckboxProps` is not allowed with tree structured dataSource.');
        } else {
          mergedIndeterminate = (_a = checkboxProps === null || checkboxProps === void 0 ? void 0 : checkboxProps.indeterminate) !== null && _a !== void 0 ? _a : indeterminate;
        }
        // Record checked
        return {
          node: _createVNode(Checkbox, _objectSpread(_objectSpread({}, checkboxProps), {}, {
            "indeterminate": mergedIndeterminate,
            "checked": checked,
            "skipGroup": true,
            "onClick": e => e.stopPropagation(),
            "onChange": _ref6 => {
              let {
                nativeEvent
              } = _ref6;
              const {
                shiftKey
              } = nativeEvent;
              let startIndex = -1;
              let endIndex = -1;
              // Get range of this
              if (shiftKey && checkStrictly) {
                const pointKeys = new Set([lastSelectedKey.value, key]);
                recordKeys.some((recordKey, recordIndex) => {
                  if (pointKeys.has(recordKey)) {
                    if (startIndex === -1) {
                      startIndex = recordIndex;
                    } else {
                      endIndex = recordIndex;
                      return true;
                    }
                  }
                  return false;
                });
              }
              if (endIndex !== -1 && startIndex !== endIndex && checkStrictly) {
                // Batch update selections
                const rangeKeys = recordKeys.slice(startIndex, endIndex + 1);
                const changedKeys = [];
                if (checked) {
                  rangeKeys.forEach(recordKey => {
                    if (keySet.has(recordKey)) {
                      changedKeys.push(recordKey);
                      keySet.delete(recordKey);
                    }
                  });
                } else {
                  rangeKeys.forEach(recordKey => {
                    if (!keySet.has(recordKey)) {
                      changedKeys.push(recordKey);
                      keySet.add(recordKey);
                    }
                  });
                }
                const keys = Array.from(keySet);
                onSelectMultiple === null || onSelectMultiple === void 0 ? void 0 : onSelectMultiple(!checked, keys.map(recordKey => getRecordByKey(recordKey)), changedKeys.map(recordKey => getRecordByKey(recordKey)));
                setSelectedKeys(keys);
              } else {
                // Single record selected
                const originCheckedKeys = derivedSelectedKeys.value;
                if (checkStrictly) {
                  const checkedKeys = checked ? arrDel(originCheckedKeys, key) : arrAdd(originCheckedKeys, key);
                  triggerSingleSelection(key, !checked, checkedKeys, nativeEvent);
                } else {
                  // Always fill first
                  const result = conductCheck([...originCheckedKeys, key], true, keyEntities.value, maxLevel.value, levelEntities.value, isCheckboxDisabled);
                  const {
                    checkedKeys,
                    halfCheckedKeys
                  } = result;
                  let nextCheckedKeys = checkedKeys;
                  // If remove, we do it again to correction
                  if (checked) {
                    const tempKeySet = new Set(checkedKeys);
                    tempKeySet.delete(key);
                    nextCheckedKeys = conductCheck(Array.from(tempKeySet), {
                      checked: false,
                      halfCheckedKeys
                    }, keyEntities.value, maxLevel.value, levelEntities.value, isCheckboxDisabled).checkedKeys;
                  }
                  triggerSingleSelection(key, !checked, nextCheckedKeys, nativeEvent);
                }
              }
              setLastSelectedKey(key);
            }
          }), null),
          checked
        };
      };
    }
    const renderSelectionCell = _ref7 => {
      let {
        record,
        index
      } = _ref7;
      const {
        node,
        checked
      } = renderCell({
        record,
        index
      });
      if (customizeRenderCell) {
        return customizeRenderCell(checked, record, index, node);
      }
      return node;
    };
    // Insert selection column if not exist
    if (!cloneColumns.includes(SELECTION_COLUMN)) {
      // Always after expand icon
      if (cloneColumns.findIndex(col => {
        var _a;
        return ((_a = col[INTERNAL_COL_DEFINE]) === null || _a === void 0 ? void 0 : _a.columnType) === 'EXPAND_COLUMN';
      }) === 0) {
        const [expandColumn, ...restColumns] = cloneColumns;
        cloneColumns = [expandColumn, SELECTION_COLUMN, ...restColumns];
      } else {
        // Normal insert at first column
        cloneColumns = [SELECTION_COLUMN, ...cloneColumns];
      }
    }
    // Deduplicate selection column
    const selectionColumnIndex = cloneColumns.indexOf(SELECTION_COLUMN);
    if (process.env.NODE_ENV !== 'production' && cloneColumns.filter(col => col === SELECTION_COLUMN).length > 1) {
      devWarning(false, 'Table', 'Multiple `SELECTION_COLUMN` exist in `columns`.');
    }
    cloneColumns = cloneColumns.filter((column, index) => column !== SELECTION_COLUMN || index === selectionColumnIndex);
    // Fixed column logic
    const prevCol = cloneColumns[selectionColumnIndex - 1];
    const nextCol = cloneColumns[selectionColumnIndex + 1];
    let mergedFixed = fixed;
    if (mergedFixed === undefined) {
      if ((nextCol === null || nextCol === void 0 ? void 0 : nextCol.fixed) !== undefined) {
        mergedFixed = nextCol.fixed;
      } else if ((prevCol === null || prevCol === void 0 ? void 0 : prevCol.fixed) !== undefined) {
        mergedFixed = prevCol.fixed;
      }
    }
    if (mergedFixed && prevCol && ((_a = prevCol[INTERNAL_COL_DEFINE]) === null || _a === void 0 ? void 0 : _a.columnType) === 'EXPAND_COLUMN' && prevCol.fixed === undefined) {
      prevCol.fixed = mergedFixed;
    }
    // Replace with real selection column
    const selectionColumn = {
      fixed: mergedFixed,
      width: selectionColWidth,
      className: `${prefixCls.value}-selection-column`,
      title: mergedRowSelection.value.columnTitle || title,
      customRender: renderSelectionCell,
      [INTERNAL_COL_DEFINE]: {
        class: `${prefixCls.value}-selection-col`
      }
    };
    return cloneColumns.map(col => col === SELECTION_COLUMN ? selectionColumn : col);
  };
  return [transformColumns, derivedSelectedKeySet];
}