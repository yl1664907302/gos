"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SHOW_CHILD", {
  enumerable: true,
  get: function () {
    return _commonUtil.SHOW_CHILD;
  }
});
Object.defineProperty(exports, "SHOW_PARENT", {
  enumerable: true,
  get: function () {
    return _commonUtil.SHOW_PARENT;
  }
});
exports.default = void 0;
exports.internalCascaderProps = internalCascaderProps;
exports.multipleCascaderProps = multipleCascaderProps;
exports.singleCascaderProps = singleCascaderProps;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _BaseSelect = require("../vc-select/BaseSelect");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _type = require("../_util/type");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _useId = _interopRequireDefault(require("../vc-select/hooks/useId"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _commonUtil = require("./utils/commonUtil");
var _useEntities = _interopRequireDefault(require("./hooks/useEntities"));
var _useSearchConfig = _interopRequireDefault(require("./hooks/useSearchConfig"));
var _useSearchOptions = _interopRequireDefault(require("./hooks/useSearchOptions"));
var _useMissingValues = _interopRequireDefault(require("./hooks/useMissingValues"));
var _treeUtil = require("./utils/treeUtil");
var _conductUtil = require("../vc-tree/utils/conductUtil");
var _useDisplayValues = _interopRequireDefault(require("./hooks/useDisplayValues"));
var _context = require("./context");
var _OptionList = _interopRequireDefault(require("./OptionList"));
var _vcSelect = require("../vc-select");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _useMaxLevel = _interopRequireDefault(require("../vc-tree/useMaxLevel"));
function baseCascaderProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)((0, _BaseSelect.baseSelectPropsWithoutPrivate)(), ['tokenSeparators', 'mode', 'showSearch'])), {
    // MISC
    id: String,
    prefixCls: String,
    fieldNames: (0, _type.objectType)(),
    children: Array,
    // Value
    value: {
      type: [String, Number, Array]
    },
    defaultValue: {
      type: [String, Number, Array]
    },
    changeOnSelect: {
      type: Boolean,
      default: undefined
    },
    displayRender: Function,
    checkable: {
      type: Boolean,
      default: undefined
    },
    showCheckedStrategy: {
      type: String,
      default: _commonUtil.SHOW_PARENT
    },
    // Search
    showSearch: {
      type: [Boolean, Object],
      default: undefined
    },
    searchValue: String,
    onSearch: Function,
    // Trigger
    expandTrigger: String,
    // Options
    options: Array,
    /** @private Internal usage. Do not use in your production. */
    dropdownPrefixCls: String,
    loadData: Function,
    // Open
    /** @deprecated Use `open` instead */
    popupVisible: {
      type: Boolean,
      default: undefined
    },
    dropdownClassName: String,
    dropdownMenuColumnStyle: {
      type: Object,
      default: undefined
    },
    /** @deprecated Use `dropdownStyle` instead */
    popupStyle: {
      type: Object,
      default: undefined
    },
    dropdownStyle: {
      type: Object,
      default: undefined
    },
    /** @deprecated Use `placement` instead */
    popupPlacement: String,
    placement: String,
    /** @deprecated Use `onDropdownVisibleChange` instead */
    onPopupVisibleChange: Function,
    onDropdownVisibleChange: Function,
    // Icon
    expandIcon: _vueTypes.default.any,
    loadingIcon: _vueTypes.default.any
  });
}
function singleCascaderProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, baseCascaderProps()), {
    checkable: Boolean,
    onChange: Function
  });
}
function multipleCascaderProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, baseCascaderProps()), {
    checkable: Boolean,
    onChange: Function
  });
}
function internalCascaderProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, baseCascaderProps()), {
    onChange: Function,
    customSlots: Object
  });
}
function isMultipleValue(value) {
  return Array.isArray(value) && Array.isArray(value[0]);
}
function toRawValues(value) {
  if (!value) {
    return [];
  }
  if (isMultipleValue(value)) {
    return value;
  }
  return (value.length === 0 ? [] : [value]).map(val => Array.isArray(val) ? val : [val]);
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Cascader',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(internalCascaderProps(), {}),
  setup(props, _ref) {
    let {
      attrs,
      expose,
      slots
    } = _ref;
    const mergedId = (0, _useId.default)((0, _vue.toRef)(props, 'id'));
    const multiple = (0, _vue.computed)(() => !!props.checkable);
    // =========================== Values ===========================
    const [rawValues, setRawValues] = (0, _useMergedState.default)(props.defaultValue, {
      value: (0, _vue.computed)(() => props.value),
      postState: toRawValues
    });
    // ========================= FieldNames =========================
    const mergedFieldNames = (0, _vue.computed)(() => (0, _commonUtil.fillFieldNames)(props.fieldNames));
    // =========================== Option ===========================
    const mergedOptions = (0, _vue.computed)(() => props.options || []);
    // Only used in multiple mode, this fn will not call in single mode
    const pathKeyEntities = (0, _useEntities.default)(mergedOptions, mergedFieldNames);
    /** Convert path key back to value format */
    const getValueByKeyPath = pathKeys => {
      const keyPathEntities = pathKeyEntities.value;
      return pathKeys.map(pathKey => {
        const {
          nodes
        } = keyPathEntities[pathKey];
        return nodes.map(node => node[mergedFieldNames.value.value]);
      });
    };
    // =========================== Search ===========================
    const [mergedSearchValue, setSearchValue] = (0, _useMergedState.default)('', {
      value: (0, _vue.computed)(() => props.searchValue),
      postState: search => search || ''
    });
    const onInternalSearch = (searchText, info) => {
      setSearchValue(searchText);
      if (info.source !== 'blur' && props.onSearch) {
        props.onSearch(searchText);
      }
    };
    const {
      showSearch: mergedShowSearch,
      searchConfig: mergedSearchConfig
    } = (0, _useSearchConfig.default)((0, _vue.toRef)(props, 'showSearch'));
    const searchOptions = (0, _useSearchOptions.default)(mergedSearchValue, mergedOptions, mergedFieldNames, (0, _vue.computed)(() => props.dropdownPrefixCls || props.prefixCls), mergedSearchConfig, (0, _vue.toRef)(props, 'changeOnSelect'));
    // =========================== Values ===========================
    const missingValuesInfo = (0, _useMissingValues.default)(mergedOptions, mergedFieldNames, rawValues);
    // Fill `rawValues` with checked conduction values
    const [checkedValues, halfCheckedValues, missingCheckedValues] = [(0, _vue.ref)([]), (0, _vue.ref)([]), (0, _vue.ref)([])];
    const {
      maxLevel,
      levelEntities
    } = (0, _useMaxLevel.default)(pathKeyEntities);
    (0, _vue.watchEffect)(() => {
      const [existValues, missingValues] = missingValuesInfo.value;
      if (!multiple.value || !rawValues.value.length) {
        [checkedValues.value, halfCheckedValues.value, missingCheckedValues.value] = [existValues, [], missingValues];
        return;
      }
      const keyPathValues = (0, _commonUtil.toPathKeys)(existValues);
      const keyPathEntities = pathKeyEntities.value;
      const {
        checkedKeys,
        halfCheckedKeys
      } = (0, _conductUtil.conductCheck)(keyPathValues, true, keyPathEntities, maxLevel.value, levelEntities.value);
      // Convert key back to value cells
      [checkedValues.value, halfCheckedValues.value, missingCheckedValues.value] = [getValueByKeyPath(checkedKeys), getValueByKeyPath(halfCheckedKeys), missingValues];
    });
    const deDuplicatedValues = (0, _vue.computed)(() => {
      const checkedKeys = (0, _commonUtil.toPathKeys)(checkedValues.value);
      const deduplicateKeys = (0, _treeUtil.formatStrategyValues)(checkedKeys, pathKeyEntities.value, props.showCheckedStrategy);
      return [...missingCheckedValues.value, ...getValueByKeyPath(deduplicateKeys)];
    });
    const displayValues = (0, _useDisplayValues.default)(deDuplicatedValues, mergedOptions, mergedFieldNames, multiple, (0, _vue.toRef)(props, 'displayRender'));
    // =========================== Change ===========================
    const triggerChange = nextValues => {
      setRawValues(nextValues);
      // Save perf if no need trigger event
      if (props.onChange) {
        const nextRawValues = toRawValues(nextValues);
        const valueOptions = nextRawValues.map(valueCells => (0, _treeUtil.toPathOptions)(valueCells, mergedOptions.value, mergedFieldNames.value).map(valueOpt => valueOpt.option));
        const triggerValues = multiple.value ? nextRawValues : nextRawValues[0];
        const triggerOptions = multiple.value ? valueOptions : valueOptions[0];
        props.onChange(triggerValues, triggerOptions);
      }
    };
    // =========================== Select ===========================
    const onInternalSelect = valuePath => {
      setSearchValue('');
      if (!multiple.value) {
        triggerChange(valuePath);
      } else {
        // Prepare conduct required info
        const pathKey = (0, _commonUtil.toPathKey)(valuePath);
        const checkedPathKeys = (0, _commonUtil.toPathKeys)(checkedValues.value);
        const halfCheckedPathKeys = (0, _commonUtil.toPathKeys)(halfCheckedValues.value);
        const existInChecked = checkedPathKeys.includes(pathKey);
        const existInMissing = missingCheckedValues.value.some(valueCells => (0, _commonUtil.toPathKey)(valueCells) === pathKey);
        // Do update
        let nextCheckedValues = checkedValues.value;
        let nextMissingValues = missingCheckedValues.value;
        if (existInMissing && !existInChecked) {
          // Missing value only do filter
          nextMissingValues = missingCheckedValues.value.filter(valueCells => (0, _commonUtil.toPathKey)(valueCells) !== pathKey);
        } else {
          // Update checked key first
          const nextRawCheckedKeys = existInChecked ? checkedPathKeys.filter(key => key !== pathKey) : [...checkedPathKeys, pathKey];
          // Conduction by selected or not
          let checkedKeys;
          if (existInChecked) {
            ({
              checkedKeys
            } = (0, _conductUtil.conductCheck)(nextRawCheckedKeys, {
              checked: false,
              halfCheckedKeys: halfCheckedPathKeys
            }, pathKeyEntities.value, maxLevel.value, levelEntities.value));
          } else {
            ({
              checkedKeys
            } = (0, _conductUtil.conductCheck)(nextRawCheckedKeys, true, pathKeyEntities.value, maxLevel.value, levelEntities.value));
          }
          // Roll up to parent level keys
          const deDuplicatedKeys = (0, _treeUtil.formatStrategyValues)(checkedKeys, pathKeyEntities.value, props.showCheckedStrategy);
          nextCheckedValues = getValueByKeyPath(deDuplicatedKeys);
        }
        triggerChange([...nextMissingValues, ...nextCheckedValues]);
      }
    };
    // Display Value change logic
    const onDisplayValuesChange = (_, info) => {
      if (info.type === 'clear') {
        triggerChange([]);
        return;
      }
      // Cascader do not support `add` type. Only support `remove`
      const {
        valueCells
      } = info.values[0];
      onInternalSelect(valueCells);
    };
    // ============================ Open ============================
    if (process.env.NODE_ENV !== 'production') {
      (0, _vue.watchEffect)(() => {
        (0, _devWarning.default)(!props.onPopupVisibleChange, 'Cascader', '`popupVisibleChange` is deprecated. Please use `dropdownVisibleChange` instead.');
        (0, _devWarning.default)(props.popupVisible === undefined, 'Cascader', '`popupVisible` is deprecated. Please use `open` instead.');
        (0, _devWarning.default)(props.popupPlacement === undefined, 'Cascader', '`popupPlacement` is deprecated. Please use `placement` instead.');
        (0, _devWarning.default)(props.popupStyle === undefined, 'Cascader', '`popupStyle` is deprecated. Please use `dropdownStyle` instead.');
      });
    }
    const mergedOpen = (0, _vue.computed)(() => props.open !== undefined ? props.open : props.popupVisible);
    const mergedDropdownStyle = (0, _vue.computed)(() => props.dropdownStyle || props.popupStyle || {});
    const mergedPlacement = (0, _vue.computed)(() => props.placement || props.popupPlacement);
    const onInternalDropdownVisibleChange = nextVisible => {
      var _a, _b;
      (_a = props.onDropdownVisibleChange) === null || _a === void 0 ? void 0 : _a.call(props, nextVisible);
      (_b = props.onPopupVisibleChange) === null || _b === void 0 ? void 0 : _b.call(props, nextVisible);
    };
    const {
      changeOnSelect,
      checkable,
      dropdownPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      dropdownMenuColumnStyle,
      customSlots,
      dropdownClassName
    } = (0, _vue.toRefs)(props);
    (0, _context.useProvideCascader)({
      options: mergedOptions,
      fieldNames: mergedFieldNames,
      values: checkedValues,
      halfValues: halfCheckedValues,
      changeOnSelect,
      onSelect: onInternalSelect,
      checkable,
      searchOptions,
      dropdownPrefixCls,
      loadData,
      expandTrigger,
      expandIcon,
      loadingIcon,
      dropdownMenuColumnStyle,
      customSlots
    });
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
    const pickProps = (0, _vue.computed)(() => {
      return (0, _omit.default)(props, ['id', 'prefixCls', 'fieldNames',
      // Value
      'defaultValue', 'value', 'changeOnSelect', 'onChange', 'displayRender', 'checkable',
      // Search
      'searchValue', 'onSearch', 'showSearch',
      // Trigger
      'expandTrigger',
      // Options
      'options', 'dropdownPrefixCls', 'loadData',
      // Open
      'popupVisible', 'open', 'dropdownClassName', 'dropdownMenuColumnStyle', 'popupPlacement', 'placement', 'onDropdownVisibleChange', 'onPopupVisibleChange',
      // Icon
      'expandIcon', 'loadingIcon', 'customSlots', 'showCheckedStrategy',
      // Children
      'children']);
    });
    return () => {
      const emptyOptions = !(mergedSearchValue.value ? searchOptions.value : mergedOptions.value).length;
      const {
        dropdownMatchSelectWidth = false
      } = props;
      const dropdownStyle =
      // Search to match width
      mergedSearchValue.value && mergedSearchConfig.value.matchInputWidth ||
      // Empty keep the width
      emptyOptions ? {} : {
        minWidth: 'auto'
      };
      return (0, _vue.createVNode)(_vcSelect.BaseSelect, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickProps.value), attrs), {}, {
        "ref": selectRef,
        "id": mergedId,
        "prefixCls": props.prefixCls,
        "dropdownMatchSelectWidth": dropdownMatchSelectWidth,
        "dropdownStyle": (0, _extends2.default)((0, _extends2.default)({}, mergedDropdownStyle.value), dropdownStyle),
        "displayValues": displayValues.value,
        "onDisplayValuesChange": onDisplayValuesChange,
        "mode": multiple.value ? 'multiple' : undefined,
        "searchValue": mergedSearchValue.value,
        "onSearch": onInternalSearch,
        "showSearch": mergedShowSearch.value,
        "OptionList": _OptionList.default,
        "emptyOptions": emptyOptions,
        "open": mergedOpen.value,
        "dropdownClassName": dropdownClassName.value,
        "placement": mergedPlacement.value,
        "onDropdownVisibleChange": onInternalDropdownVisibleChange,
        "getRawInputElement": () => {
          var _a;
          return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
        }
      }), slots);
    };
  }
});