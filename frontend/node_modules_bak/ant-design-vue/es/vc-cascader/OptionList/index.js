import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { isLeaf, toPathKey, toPathKeys, toPathValueStr, scrollIntoParentView } from '../utils/commonUtil';
import useActive from './useActive';
import useKeyboard from './useKeyboard';
import { toPathOptions } from '../utils/treeUtil';
import { computed, defineComponent, onMounted, ref, shallowRef, watch, watchEffect } from 'vue';
import { useBaseProps } from '../../vc-select';
import { useInjectCascader } from '../context';
import Column, { FIX_LABEL } from './Column';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'OptionList',
  inheritAttrs: false,
  setup(_props, context) {
    const {
      attrs,
      slots
    } = context;
    const baseProps = useBaseProps();
    const containerRef = ref();
    const rtl = computed(() => baseProps.direction === 'rtl');
    const {
      options,
      values,
      halfValues,
      fieldNames,
      changeOnSelect,
      onSelect,
      searchOptions,
      dropdownPrefixCls,
      loadData,
      expandTrigger,
      customSlots
    } = useInjectCascader();
    const mergedPrefixCls = computed(() => dropdownPrefixCls.value || baseProps.prefixCls);
    // ========================= loadData =========================
    const loadingKeys = shallowRef([]);
    const internalLoadData = valueCells => {
      // Do not load when search
      if (!loadData.value || baseProps.searchValue) {
        return;
      }
      const optionList = toPathOptions(valueCells, options.value, fieldNames.value);
      const rawOptions = optionList.map(_ref => {
        let {
          option
        } = _ref;
        return option;
      });
      const lastOption = rawOptions[rawOptions.length - 1];
      if (lastOption && !isLeaf(lastOption, fieldNames.value)) {
        const pathKey = toPathKey(valueCells);
        loadingKeys.value = [...loadingKeys.value, pathKey];
        loadData.value(rawOptions);
      }
    };
    watchEffect(() => {
      if (loadingKeys.value.length) {
        loadingKeys.value.forEach(loadingKey => {
          const valueStrCells = toPathValueStr(loadingKey);
          const optionList = toPathOptions(valueStrCells, options.value, fieldNames.value, true).map(_ref2 => {
            let {
              option
            } = _ref2;
            return option;
          });
          const lastOption = optionList[optionList.length - 1];
          if (!lastOption || lastOption[fieldNames.value.children] || isLeaf(lastOption, fieldNames.value)) {
            loadingKeys.value = loadingKeys.value.filter(key => key !== loadingKey);
          }
        });
      }
    });
    // ========================== Values ==========================
    const checkedSet = computed(() => new Set(toPathKeys(values.value)));
    const halfCheckedSet = computed(() => new Set(toPathKeys(halfValues.value)));
    // ====================== Accessibility =======================
    const [activeValueCells, setActiveValueCells] = useActive();
    // =========================== Path ===========================
    const onPathOpen = nextValueCells => {
      setActiveValueCells(nextValueCells);
      // Trigger loadData
      internalLoadData(nextValueCells);
    };
    const isSelectable = option => {
      const {
        disabled
      } = option;
      const isMergedLeaf = isLeaf(option, fieldNames.value);
      return !disabled && (isMergedLeaf || changeOnSelect.value || baseProps.multiple);
    };
    const onPathSelect = function (valuePath, leaf) {
      let fromKeyboard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      onSelect(valuePath);
      if (!baseProps.multiple && (leaf || changeOnSelect.value && (expandTrigger.value === 'hover' || fromKeyboard))) {
        baseProps.toggleOpen(false);
      }
    };
    // ========================== Option ==========================
    const mergedOptions = computed(() => {
      if (baseProps.searchValue) {
        return searchOptions.value;
      }
      return options.value;
    });
    // ========================== Column ==========================
    const optionColumns = computed(() => {
      const optionList = [{
        options: mergedOptions.value
      }];
      let currentList = mergedOptions.value;
      for (let i = 0; i < activeValueCells.value.length; i += 1) {
        const activeValueCell = activeValueCells.value[i];
        const currentOption = currentList.find(option => option[fieldNames.value.value] === activeValueCell);
        const subOptions = currentOption === null || currentOption === void 0 ? void 0 : currentOption[fieldNames.value.children];
        if (!(subOptions === null || subOptions === void 0 ? void 0 : subOptions.length)) {
          break;
        }
        currentList = subOptions;
        optionList.push({
          options: subOptions
        });
      }
      return optionList;
    });
    // ========================= Keyboard =========================
    const onKeyboardSelect = (selectValueCells, option) => {
      if (isSelectable(option)) {
        onPathSelect(selectValueCells, isLeaf(option, fieldNames.value), true);
      }
    };
    useKeyboard(context, mergedOptions, fieldNames, activeValueCells, onPathOpen, onKeyboardSelect);
    const onListMouseDown = event => {
      event.preventDefault();
    };
    onMounted(() => {
      watch(activeValueCells, cells => {
        var _a;
        for (let i = 0; i < cells.length; i += 1) {
          const cellPath = cells.slice(0, i + 1);
          const cellKeyPath = toPathKey(cellPath);
          const ele = (_a = containerRef.value) === null || _a === void 0 ? void 0 : _a.querySelector(`li[data-path-key="${cellKeyPath.replace(/\\{0,2}"/g, '\\"')}"]`);
          if (ele) {
            scrollIntoParentView(ele);
          }
        }
      }, {
        flush: 'post',
        immediate: true
      });
    });
    return () => {
      var _a, _b, _c, _d, _e;
      // ========================== Render ==========================
      const {
        notFoundContent = ((_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots)) || ((_c = (_b = customSlots.value).notFoundContent) === null || _c === void 0 ? void 0 : _c.call(_b)),
        multiple,
        toggleOpen
      } = baseProps;
      // >>>>> Empty
      const isEmpty = !((_e = (_d = optionColumns.value[0]) === null || _d === void 0 ? void 0 : _d.options) === null || _e === void 0 ? void 0 : _e.length);
      const emptyList = [{
        [fieldNames.value.value]: '__EMPTY__',
        [FIX_LABEL]: notFoundContent,
        disabled: true
      }];
      const columnProps = _extends(_extends({}, attrs), {
        multiple: !isEmpty && multiple,
        onSelect: onPathSelect,
        onActive: onPathOpen,
        onToggleOpen: toggleOpen,
        checkedSet: checkedSet.value,
        halfCheckedSet: halfCheckedSet.value,
        loadingKeys: loadingKeys.value,
        isSelectable
      });
      // >>>>> Columns
      const mergedOptionColumns = isEmpty ? [{
        options: emptyList
      }] : optionColumns.value;
      const columnNodes = mergedOptionColumns.map((col, index) => {
        const prevValuePath = activeValueCells.value.slice(0, index);
        const activeValue = activeValueCells.value[index];
        return _createVNode(Column, _objectSpread(_objectSpread({
          "key": index
        }, columnProps), {}, {
          "prefixCls": mergedPrefixCls.value,
          "options": col.options,
          "prevValuePath": prevValuePath,
          "activeValue": activeValue
        }), null);
      });
      return _createVNode("div", {
        "class": [`${mergedPrefixCls.value}-menus`, {
          [`${mergedPrefixCls.value}-menu-empty`]: isEmpty,
          [`${mergedPrefixCls.value}-rtl`]: rtl.value
        }],
        "onMousedown": onListMouseDown,
        "ref": containerRef
      }, [columnNodes]);
    };
  }
});