import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import OptionList from './OptionList';
import { formatStrategyValues, SHOW_CHILD } from './utils/strategyUtil';
import { useProvideSelectContext } from './TreeSelectContext';
import { useProvideLegacySelectContext } from './LegacyContext';
import useTreeData from './hooks/useTreeData';
import { toArray, fillFieldNames, isNil } from './utils/valueUtil';
import useCache from './hooks/useCache';
import useDataEntities from './hooks/useDataEntities';
import { fillAdditionalInfo, fillLegacyProps } from './utils/legacyUtil';
import useCheckedKeys from './hooks/useCheckedKeys';
import useFilterTreeData from './hooks/useFilterTreeData';
import warningProps from './utils/warningPropsUtil';
import { baseSelectPropsWithoutPrivate } from '../vc-select/BaseSelect';
import { computed, defineComponent, ref, shallowRef, toRaw, toRef, toRefs, watchEffect } from 'vue';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import { BaseSelect } from '../vc-select';
import { initDefaultProps } from '../_util/props-util';
import useId from '../vc-select/hooks/useId';
import useMergedState from '../_util/hooks/useMergedState';
import { conductCheck } from '../vc-tree/utils/conductUtil';
import { warning } from '../vc-util/warning';
import { toReactive } from '../_util/toReactive';
import useMaxLevel from '../vc-tree/useMaxLevel';
export function treeSelectProps() {
  return _extends(_extends({}, omit(baseSelectPropsWithoutPrivate(), ['mode'])), {
    prefixCls: String,
    id: String,
    value: {
      type: [String, Number, Object, Array]
    },
    defaultValue: {
      type: [String, Number, Object, Array]
    },
    onChange: {
      type: Function
    },
    searchValue: String,
    /** @deprecated Use `searchValue` instead */
    inputValue: String,
    onSearch: {
      type: Function
    },
    autoClearSearchValue: {
      type: Boolean,
      default: undefined
    },
    filterTreeNode: {
      type: [Boolean, Function],
      default: undefined
    },
    treeNodeFilterProp: String,
    // >>> Select
    onSelect: Function,
    onDeselect: Function,
    showCheckedStrategy: {
      type: String
    },
    treeNodeLabelProp: String,
    fieldNames: {
      type: Object
    },
    // >>> Mode
    multiple: {
      type: Boolean,
      default: undefined
    },
    treeCheckable: {
      type: Boolean,
      default: undefined
    },
    treeCheckStrictly: {
      type: Boolean,
      default: undefined
    },
    labelInValue: {
      type: Boolean,
      default: undefined
    },
    // >>> Data
    treeData: {
      type: Array
    },
    treeDataSimpleMode: {
      type: [Boolean, Object],
      default: undefined
    },
    loadData: {
      type: Function
    },
    treeLoadedKeys: {
      type: Array
    },
    onTreeLoad: {
      type: Function
    },
    // >>> Expanded
    treeDefaultExpandAll: {
      type: Boolean,
      default: undefined
    },
    treeExpandedKeys: {
      type: Array
    },
    treeDefaultExpandedKeys: {
      type: Array
    },
    onTreeExpand: {
      type: Function
    },
    // >>> Options
    virtual: {
      type: Boolean,
      default: undefined
    },
    listHeight: Number,
    listItemHeight: Number,
    onDropdownVisibleChange: {
      type: Function
    },
    // >>> Tree
    treeLine: {
      type: [Boolean, Object],
      default: undefined
    },
    treeIcon: PropTypes.any,
    showTreeIcon: {
      type: Boolean,
      default: undefined
    },
    switcherIcon: PropTypes.any,
    treeMotion: PropTypes.any,
    children: Array,
    treeExpandAction: String,
    showArrow: {
      type: Boolean,
      default: undefined
    },
    showSearch: {
      type: Boolean,
      default: undefined
    },
    open: {
      type: Boolean,
      default: undefined
    },
    defaultOpen: {
      type: Boolean,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: undefined
    },
    placeholder: PropTypes.any,
    maxTagPlaceholder: {
      type: Function
    },
    dropdownPopupAlign: PropTypes.any,
    customSlots: Object
  });
}
function isRawValue(value) {
  return !value || typeof value !== 'object';
}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'TreeSelect',
  inheritAttrs: false,
  props: initDefaultProps(treeSelectProps(), {
    treeNodeFilterProp: 'value',
    autoClearSearchValue: true,
    showCheckedStrategy: SHOW_CHILD,
    listHeight: 200,
    listItemHeight: 20,
    prefixCls: 'vc-tree-select'
  }),
  setup(props, _ref) {
    let {
      attrs,
      expose,
      slots
    } = _ref;
    const mergedId = useId(toRef(props, 'id'));
    const treeConduction = computed(() => props.treeCheckable && !props.treeCheckStrictly);
    const mergedCheckable = computed(() => props.treeCheckable || props.treeCheckStrictly);
    const mergedLabelInValue = computed(() => props.treeCheckStrictly || props.labelInValue);
    const mergedMultiple = computed(() => mergedCheckable.value || props.multiple);
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      watchEffect(() => {
        warningProps(props);
      });
    }
    // ========================= FieldNames =========================
    const mergedFieldNames = computed(() => fillFieldNames(props.fieldNames));
    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = useMergedState('', {
      value: computed(() => props.searchValue !== undefined ? props.searchValue : props.inputValue),
      postState: search => search || ''
    });
    const onInternalSearch = searchText => {
      var _a;
      setSearchValue(searchText);
      (_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, searchText);
    };
    // ============================ Data ============================
    // `useTreeData` only do convert of `children` or `simpleMode`.
    // Else will return origin `treeData` for perf consideration.
    // Do not do anything to loop the data.
    const mergedTreeData = useTreeData(toRef(props, 'treeData'), toRef(props, 'children'), toRef(props, 'treeDataSimpleMode'));
    const {
      keyEntities,
      valueEntities
    } = useDataEntities(mergedTreeData, mergedFieldNames);
    /** Get `missingRawValues` which not exist in the tree yet */
    const splitRawValues = newRawValues => {
      const missingRawValues = [];
      const existRawValues = [];
      // Keep missing value in the cache
      newRawValues.forEach(val => {
        if (valueEntities.value.has(val)) {
          existRawValues.push(val);
        } else {
          missingRawValues.push(val);
        }
      });
      return {
        missingRawValues,
        existRawValues
      };
    };
    // Filtered Tree
    const filteredTreeData = useFilterTreeData(mergedTreeData, mergedSearchValue, {
      fieldNames: mergedFieldNames,
      treeNodeFilterProp: toRef(props, 'treeNodeFilterProp'),
      filterTreeNode: toRef(props, 'filterTreeNode')
    });
    // =========================== Label ============================
    const getLabel = item => {
      if (item) {
        if (props.treeNodeLabelProp) {
          return item[props.treeNodeLabelProp];
        }
        // Loop from fieldNames
        const {
          _title: titleList
        } = mergedFieldNames.value;
        for (let i = 0; i < titleList.length; i += 1) {
          const title = item[titleList[i]];
          if (title !== undefined) {
            return title;
          }
        }
      }
    };
    // ========================= Wrap Value =========================
    const toLabeledValues = draftValues => {
      const values = toArray(draftValues);
      return values.map(val => {
        if (isRawValue(val)) {
          return {
            value: val
          };
        }
        return val;
      });
    };
    const convert2LabelValues = draftValues => {
      const values = toLabeledValues(draftValues);
      return values.map(item => {
        let {
          label: rawLabel
        } = item;
        const {
          value: rawValue,
          halfChecked: rawHalfChecked
        } = item;
        let rawDisabled;
        const entity = valueEntities.value.get(rawValue);
        // Fill missing label & status
        if (entity) {
          rawLabel = rawLabel !== null && rawLabel !== void 0 ? rawLabel : getLabel(entity.node);
          rawDisabled = entity.node.disabled;
        }
        return {
          label: rawLabel,
          value: rawValue,
          halfChecked: rawHalfChecked,
          disabled: rawDisabled
        };
      });
    };
    // =========================== Values ===========================
    const [internalValue, setInternalValue] = useMergedState(props.defaultValue, {
      value: toRef(props, 'value')
    });
    const rawMixedLabeledValues = computed(() => toLabeledValues(internalValue.value));
    // Split value into full check and half check
    const rawLabeledValues = shallowRef([]);
    const rawHalfLabeledValues = shallowRef([]);
    watchEffect(() => {
      const fullCheckValues = [];
      const halfCheckValues = [];
      rawMixedLabeledValues.value.forEach(item => {
        if (item.halfChecked) {
          halfCheckValues.push(item);
        } else {
          fullCheckValues.push(item);
        }
      });
      rawLabeledValues.value = fullCheckValues;
      rawHalfLabeledValues.value = halfCheckValues;
    });
    // const [mergedValues] = useCache(rawLabeledValues);
    const rawValues = computed(() => rawLabeledValues.value.map(item => item.value));
    const {
      maxLevel,
      levelEntities
    } = useMaxLevel(keyEntities);
    // Convert value to key. Will fill missed keys for conduct check.
    const [rawCheckedValues, rawHalfCheckedValues] = useCheckedKeys(rawLabeledValues, rawHalfLabeledValues, treeConduction, keyEntities, maxLevel, levelEntities);
    // Convert rawCheckedKeys to check strategy related values
    const displayValues = computed(() => {
      // Collect keys which need to show
      const displayKeys = formatStrategyValues(rawCheckedValues.value, props.showCheckedStrategy, keyEntities.value, mergedFieldNames.value);
      // Convert to value and filled with label
      const values = displayKeys.map(key => {
        var _a, _b, _c;
        return (_c = (_b = (_a = keyEntities.value[key]) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b[mergedFieldNames.value.value]) !== null && _c !== void 0 ? _c : key;
      });
      // Back fill with origin label
      const labeledValues = values.map(val => {
        const targetItem = rawLabeledValues.value.find(item => item.value === val);
        return {
          value: val,
          label: targetItem === null || targetItem === void 0 ? void 0 : targetItem.label
        };
      });
      const rawDisplayValues = convert2LabelValues(labeledValues);
      const firstVal = rawDisplayValues[0];
      if (!mergedMultiple.value && firstVal && isNil(firstVal.value) && isNil(firstVal.label)) {
        return [];
      }
      return rawDisplayValues.map(item => {
        var _a;
        return _extends(_extends({}, item), {
          label: (_a = item.label) !== null && _a !== void 0 ? _a : item.value
        });
      });
    });
    const [cachedDisplayValues] = useCache(displayValues);
    // =========================== Change ===========================
    const triggerChange = (newRawValues, extra, source) => {
      const labeledValues = convert2LabelValues(newRawValues);
      setInternalValue(labeledValues);
      // Clean up if needed
      if (props.autoClearSearchValue) {
        setSearchValue('');
      }
      // Generate rest parameters is costly, so only do it when necessary
      if (props.onChange) {
        let eventValues = newRawValues;
        if (treeConduction.value) {
          const formattedKeyList = formatStrategyValues(newRawValues, props.showCheckedStrategy, keyEntities.value, mergedFieldNames.value);
          eventValues = formattedKeyList.map(key => {
            const entity = valueEntities.value.get(key);
            return entity ? entity.node[mergedFieldNames.value.value] : key;
          });
        }
        const {
          triggerValue,
          selected
        } = extra || {
          triggerValue: undefined,
          selected: undefined
        };
        let returnRawValues = eventValues;
        // We need fill half check back
        if (props.treeCheckStrictly) {
          const halfValues = rawHalfLabeledValues.value.filter(item => !eventValues.includes(item.value));
          returnRawValues = [...returnRawValues, ...halfValues];
        }
        const returnLabeledValues = convert2LabelValues(returnRawValues);
        const additionalInfo = {
          // [Legacy] Always return as array contains label & value
          preValue: rawLabeledValues.value,
          triggerValue
        };
        // [Legacy] Fill legacy data if user query.
        // This is expansive that we only fill when user query
        // https://github.com/react-component/tree-select/blob/fe33eb7c27830c9ac70cd1fdb1ebbe7bc679c16a/src/Select.jsx
        let showPosition = true;
        if (props.treeCheckStrictly || source === 'selection' && !selected) {
          showPosition = false;
        }
        fillAdditionalInfo(additionalInfo, triggerValue, newRawValues, mergedTreeData.value, showPosition, mergedFieldNames.value);
        if (mergedCheckable.value) {
          additionalInfo.checked = selected;
        } else {
          additionalInfo.selected = selected;
        }
        const returnValues = mergedLabelInValue.value ? returnLabeledValues : returnLabeledValues.map(item => item.value);
        props.onChange(mergedMultiple.value ? returnValues : returnValues[0], mergedLabelInValue.value ? null : returnLabeledValues.map(item => item.label), additionalInfo);
      }
    };
    // ========================== Options ===========================
    /** Trigger by option list */
    const onOptionSelect = (selectedKey, _ref2) => {
      let {
        selected,
        source
      } = _ref2;
      var _a, _b, _c;
      const keyEntitiesValue = toRaw(keyEntities.value);
      const valueEntitiesValue = toRaw(valueEntities.value);
      const entity = keyEntitiesValue[selectedKey];
      const node = entity === null || entity === void 0 ? void 0 : entity.node;
      const selectedValue = (_a = node === null || node === void 0 ? void 0 : node[mergedFieldNames.value.value]) !== null && _a !== void 0 ? _a : selectedKey;
      // Never be falsy but keep it safe
      if (!mergedMultiple.value) {
        // Single mode always set value
        triggerChange([selectedValue], {
          selected: true,
          triggerValue: selectedValue
        }, 'option');
      } else {
        let newRawValues = selected ? [...rawValues.value, selectedValue] : rawCheckedValues.value.filter(v => v !== selectedValue);
        // Add keys if tree conduction
        if (treeConduction.value) {
          // Should keep missing values
          const {
            missingRawValues,
            existRawValues
          } = splitRawValues(newRawValues);
          const keyList = existRawValues.map(val => valueEntitiesValue.get(val).key);
          // Conduction by selected or not
          let checkedKeys;
          if (selected) {
            ({
              checkedKeys
            } = conductCheck(keyList, true, keyEntitiesValue, maxLevel.value, levelEntities.value));
          } else {
            ({
              checkedKeys
            } = conductCheck(keyList, {
              checked: false,
              halfCheckedKeys: rawHalfCheckedValues.value
            }, keyEntitiesValue, maxLevel.value, levelEntities.value));
          }
          // Fill back of keys
          newRawValues = [...missingRawValues, ...checkedKeys.map(key => keyEntitiesValue[key].node[mergedFieldNames.value.value])];
        }
        triggerChange(newRawValues, {
          selected,
          triggerValue: selectedValue
        }, source || 'option');
      }
      // Trigger select event
      if (selected || !mergedMultiple.value) {
        (_b = props.onSelect) === null || _b === void 0 ? void 0 : _b.call(props, selectedValue, fillLegacyProps(node));
      } else {
        (_c = props.onDeselect) === null || _c === void 0 ? void 0 : _c.call(props, selectedValue, fillLegacyProps(node));
      }
    };
    // ========================== Dropdown ==========================
    const onInternalDropdownVisibleChange = open => {
      if (props.onDropdownVisibleChange) {
        const legacyParam = {};
        Object.defineProperty(legacyParam, 'documentClickClose', {
          get() {
            warning(false, 'Second param of `onDropdownVisibleChange` has been removed.');
            return false;
          }
        });
        props.onDropdownVisibleChange(open, legacyParam);
      }
    };
    // ====================== Display Change ========================
    const onDisplayValuesChange = (newValues, info) => {
      const newRawValues = newValues.map(item => item.value);
      if (info.type === 'clear') {
        triggerChange(newRawValues, {}, 'selection');
        return;
      }
      // TreeSelect only have multiple mode which means display change only has remove
      if (info.values.length) {
        onOptionSelect(info.values[0].value, {
          selected: false,
          source: 'selection'
        });
      }
    };
    const {
      treeNodeFilterProp,
      // Data
      loadData,
      treeLoadedKeys,
      onTreeLoad,
      // Expanded
      treeDefaultExpandAll,
      treeExpandedKeys,
      treeDefaultExpandedKeys,
      onTreeExpand,
      // Options
      virtual,
      listHeight,
      listItemHeight,
      // Tree
      treeLine,
      treeIcon,
      showTreeIcon,
      switcherIcon,
      treeMotion,
      customSlots,
      dropdownMatchSelectWidth,
      treeExpandAction
    } = toRefs(props);
    useProvideLegacySelectContext(toReactive({
      checkable: mergedCheckable,
      loadData,
      treeLoadedKeys,
      onTreeLoad,
      checkedKeys: rawCheckedValues,
      halfCheckedKeys: rawHalfCheckedValues,
      treeDefaultExpandAll,
      treeExpandedKeys,
      treeDefaultExpandedKeys,
      onTreeExpand,
      treeIcon,
      treeMotion,
      showTreeIcon,
      switcherIcon,
      treeLine,
      treeNodeFilterProp,
      keyEntities,
      customSlots
    }));
    useProvideSelectContext(toReactive({
      virtual,
      listHeight,
      listItemHeight,
      treeData: filteredTreeData,
      fieldNames: mergedFieldNames,
      onSelect: onOptionSelect,
      dropdownMatchSelectWidth,
      treeExpandAction
    }));
    const selectRef = ref();
    expose({
      focus() {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur() {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.blur();
      },
      scrollTo(arg) {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(arg);
      }
    });
    return () => {
      var _a;
      const restProps = omit(props, ['id', 'prefixCls', 'customSlots',
      // Value
      'value', 'defaultValue', 'onChange', 'onSelect', 'onDeselect',
      // Search
      'searchValue', 'inputValue', 'onSearch', 'autoClearSearchValue', 'filterTreeNode', 'treeNodeFilterProp',
      // Selector
      'showCheckedStrategy', 'treeNodeLabelProp',
      //  Mode
      'multiple', 'treeCheckable', 'treeCheckStrictly', 'labelInValue',
      // FieldNames
      'fieldNames',
      // Data
      'treeDataSimpleMode', 'treeData', 'children', 'loadData', 'treeLoadedKeys', 'onTreeLoad',
      // Expanded
      'treeDefaultExpandAll', 'treeExpandedKeys', 'treeDefaultExpandedKeys', 'onTreeExpand',
      // Options
      'virtual', 'listHeight', 'listItemHeight', 'onDropdownVisibleChange',
      // Tree
      'treeLine', 'treeIcon', 'showTreeIcon', 'switcherIcon', 'treeMotion']);
      return _createVNode(BaseSelect, _objectSpread(_objectSpread(_objectSpread({
        "ref": selectRef
      }, attrs), restProps), {}, {
        "id": mergedId,
        "prefixCls": props.prefixCls,
        "mode": mergedMultiple.value ? 'multiple' : undefined,
        "displayValues": cachedDisplayValues.value,
        "onDisplayValuesChange": onDisplayValuesChange,
        "searchValue": mergedSearchValue.value,
        "onSearch": onInternalSearch,
        "OptionList": OptionList,
        "emptyOptions": !mergedTreeData.value.length,
        "onDropdownVisibleChange": onInternalDropdownVisibleChange,
        "tagRender": props.tagRender || slots.tagRender,
        "dropdownMatchSelectWidth": (_a = props.dropdownMatchSelectWidth) !== null && _a !== void 0 ? _a : true
      }), slots);
    };
  }
});