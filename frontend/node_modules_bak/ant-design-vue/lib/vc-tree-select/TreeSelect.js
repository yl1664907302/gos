"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.treeSelectProps = treeSelectProps;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _OptionList = _interopRequireDefault(require("./OptionList"));
var _strategyUtil = require("./utils/strategyUtil");
var _TreeSelectContext = require("./TreeSelectContext");
var _LegacyContext = require("./LegacyContext");
var _useTreeData = _interopRequireDefault(require("./hooks/useTreeData"));
var _valueUtil = require("./utils/valueUtil");
var _useCache = _interopRequireDefault(require("./hooks/useCache"));
var _useDataEntities = _interopRequireDefault(require("./hooks/useDataEntities"));
var _legacyUtil = require("./utils/legacyUtil");
var _useCheckedKeys = _interopRequireDefault(require("./hooks/useCheckedKeys"));
var _useFilterTreeData = _interopRequireDefault(require("./hooks/useFilterTreeData"));
var _warningPropsUtil = _interopRequireDefault(require("./utils/warningPropsUtil"));
var _BaseSelect = require("../vc-select/BaseSelect");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _vcSelect = require("../vc-select");
var _propsUtil = require("../_util/props-util");
var _useId = _interopRequireDefault(require("../vc-select/hooks/useId"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _conductUtil = require("../vc-tree/utils/conductUtil");
var _warning = require("../vc-util/warning");
var _toReactive = require("../_util/toReactive");
var _useMaxLevel = _interopRequireDefault(require("../vc-tree/useMaxLevel"));
function treeSelectProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)((0, _BaseSelect.baseSelectPropsWithoutPrivate)(), ['mode'])), {
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
    treeIcon: _vueTypes.default.any,
    showTreeIcon: {
      type: Boolean,
      default: undefined
    },
    switcherIcon: _vueTypes.default.any,
    treeMotion: _vueTypes.default.any,
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
    placeholder: _vueTypes.default.any,
    maxTagPlaceholder: {
      type: Function
    },
    dropdownPopupAlign: _vueTypes.default.any,
    customSlots: Object
  });
}
function isRawValue(value) {
  return !value || typeof value !== 'object';
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TreeSelect',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(treeSelectProps(), {
    treeNodeFilterProp: 'value',
    autoClearSearchValue: true,
    showCheckedStrategy: _strategyUtil.SHOW_CHILD,
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
    const mergedId = (0, _useId.default)((0, _vue.toRef)(props, 'id'));
    const treeConduction = (0, _vue.computed)(() => props.treeCheckable && !props.treeCheckStrictly);
    const mergedCheckable = (0, _vue.computed)(() => props.treeCheckable || props.treeCheckStrictly);
    const mergedLabelInValue = (0, _vue.computed)(() => props.treeCheckStrictly || props.labelInValue);
    const mergedMultiple = (0, _vue.computed)(() => mergedCheckable.value || props.multiple);
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      (0, _vue.watchEffect)(() => {
        (0, _warningPropsUtil.default)(props);
      });
    }
    // ========================= FieldNames =========================
    const mergedFieldNames = (0, _vue.computed)(() => (0, _valueUtil.fillFieldNames)(props.fieldNames));
    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = (0, _useMergedState.default)('', {
      value: (0, _vue.computed)(() => props.searchValue !== undefined ? props.searchValue : props.inputValue),
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
    const mergedTreeData = (0, _useTreeData.default)((0, _vue.toRef)(props, 'treeData'), (0, _vue.toRef)(props, 'children'), (0, _vue.toRef)(props, 'treeDataSimpleMode'));
    const {
      keyEntities,
      valueEntities
    } = (0, _useDataEntities.default)(mergedTreeData, mergedFieldNames);
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
    const filteredTreeData = (0, _useFilterTreeData.default)(mergedTreeData, mergedSearchValue, {
      fieldNames: mergedFieldNames,
      treeNodeFilterProp: (0, _vue.toRef)(props, 'treeNodeFilterProp'),
      filterTreeNode: (0, _vue.toRef)(props, 'filterTreeNode')
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
      const values = (0, _valueUtil.toArray)(draftValues);
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
    const [internalValue, setInternalValue] = (0, _useMergedState.default)(props.defaultValue, {
      value: (0, _vue.toRef)(props, 'value')
    });
    const rawMixedLabeledValues = (0, _vue.computed)(() => toLabeledValues(internalValue.value));
    // Split value into full check and half check
    const rawLabeledValues = (0, _vue.shallowRef)([]);
    const rawHalfLabeledValues = (0, _vue.shallowRef)([]);
    (0, _vue.watchEffect)(() => {
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
    const rawValues = (0, _vue.computed)(() => rawLabeledValues.value.map(item => item.value));
    const {
      maxLevel,
      levelEntities
    } = (0, _useMaxLevel.default)(keyEntities);
    // Convert value to key. Will fill missed keys for conduct check.
    const [rawCheckedValues, rawHalfCheckedValues] = (0, _useCheckedKeys.default)(rawLabeledValues, rawHalfLabeledValues, treeConduction, keyEntities, maxLevel, levelEntities);
    // Convert rawCheckedKeys to check strategy related values
    const displayValues = (0, _vue.computed)(() => {
      // Collect keys which need to show
      const displayKeys = (0, _strategyUtil.formatStrategyValues)(rawCheckedValues.value, props.showCheckedStrategy, keyEntities.value, mergedFieldNames.value);
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
      if (!mergedMultiple.value && firstVal && (0, _valueUtil.isNil)(firstVal.value) && (0, _valueUtil.isNil)(firstVal.label)) {
        return [];
      }
      return rawDisplayValues.map(item => {
        var _a;
        return (0, _extends2.default)((0, _extends2.default)({}, item), {
          label: (_a = item.label) !== null && _a !== void 0 ? _a : item.value
        });
      });
    });
    const [cachedDisplayValues] = (0, _useCache.default)(displayValues);
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
          const formattedKeyList = (0, _strategyUtil.formatStrategyValues)(newRawValues, props.showCheckedStrategy, keyEntities.value, mergedFieldNames.value);
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
        (0, _legacyUtil.fillAdditionalInfo)(additionalInfo, triggerValue, newRawValues, mergedTreeData.value, showPosition, mergedFieldNames.value);
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
      const keyEntitiesValue = (0, _vue.toRaw)(keyEntities.value);
      const valueEntitiesValue = (0, _vue.toRaw)(valueEntities.value);
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
            } = (0, _conductUtil.conductCheck)(keyList, true, keyEntitiesValue, maxLevel.value, levelEntities.value));
          } else {
            ({
              checkedKeys
            } = (0, _conductUtil.conductCheck)(keyList, {
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
        (_b = props.onSelect) === null || _b === void 0 ? void 0 : _b.call(props, selectedValue, (0, _legacyUtil.fillLegacyProps)(node));
      } else {
        (_c = props.onDeselect) === null || _c === void 0 ? void 0 : _c.call(props, selectedValue, (0, _legacyUtil.fillLegacyProps)(node));
      }
    };
    // ========================== Dropdown ==========================
    const onInternalDropdownVisibleChange = open => {
      if (props.onDropdownVisibleChange) {
        const legacyParam = {};
        Object.defineProperty(legacyParam, 'documentClickClose', {
          get() {
            (0, _warning.warning)(false, 'Second param of `onDropdownVisibleChange` has been removed.');
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
    } = (0, _vue.toRefs)(props);
    (0, _LegacyContext.useProvideLegacySelectContext)((0, _toReactive.toReactive)({
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
    (0, _TreeSelectContext.useProvideSelectContext)((0, _toReactive.toReactive)({
      virtual,
      listHeight,
      listItemHeight,
      treeData: filteredTreeData,
      fieldNames: mergedFieldNames,
      onSelect: onOptionSelect,
      dropdownMatchSelectWidth,
      treeExpandAction
    }));
    const selectRef = (0, _vue.ref)();
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
      const restProps = (0, _omit.default)(props, ['id', 'prefixCls', 'customSlots',
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
      return (0, _vue.createVNode)(_vcSelect.BaseSelect, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": selectRef
      }, attrs), restProps), {}, {
        "id": mergedId,
        "prefixCls": props.prefixCls,
        "mode": mergedMultiple.value ? 'multiple' : undefined,
        "displayValues": cachedDisplayValues.value,
        "onDisplayValuesChange": onDisplayValuesChange,
        "searchValue": mergedSearchValue.value,
        "onSearch": onInternalSearch,
        "OptionList": _OptionList.default,
        "emptyOptions": !mergedTreeData.value.length,
        "onDropdownVisibleChange": onInternalDropdownVisibleChange,
        "tagRender": props.tagRender || slots.tagRender,
        "dropdownMatchSelectWidth": (_a = props.dropdownMatchSelectWidth) !== null && _a !== void 0 ? _a : true
      }), slots);
    };
  }
});