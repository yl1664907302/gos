"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _commonUtil = require("../utils/commonUtil");
var _useActive = _interopRequireDefault(require("./useActive"));
var _useKeyboard = _interopRequireDefault(require("./useKeyboard"));
var _treeUtil = require("../utils/treeUtil");
var _vcSelect = require("../../vc-select");
var _context = require("../context");
var _Column = _interopRequireWildcard(require("./Column"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var _default = exports.default = (0, _vue.defineComponent)({
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
    const baseProps = (0, _vcSelect.useBaseProps)();
    const containerRef = (0, _vue.ref)();
    const rtl = (0, _vue.computed)(() => baseProps.direction === 'rtl');
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
    } = (0, _context.useInjectCascader)();
    const mergedPrefixCls = (0, _vue.computed)(() => dropdownPrefixCls.value || baseProps.prefixCls);
    // ========================= loadData =========================
    const loadingKeys = (0, _vue.shallowRef)([]);
    const internalLoadData = valueCells => {
      // Do not load when search
      if (!loadData.value || baseProps.searchValue) {
        return;
      }
      const optionList = (0, _treeUtil.toPathOptions)(valueCells, options.value, fieldNames.value);
      const rawOptions = optionList.map(_ref => {
        let {
          option
        } = _ref;
        return option;
      });
      const lastOption = rawOptions[rawOptions.length - 1];
      if (lastOption && !(0, _commonUtil.isLeaf)(lastOption, fieldNames.value)) {
        const pathKey = (0, _commonUtil.toPathKey)(valueCells);
        loadingKeys.value = [...loadingKeys.value, pathKey];
        loadData.value(rawOptions);
      }
    };
    (0, _vue.watchEffect)(() => {
      if (loadingKeys.value.length) {
        loadingKeys.value.forEach(loadingKey => {
          const valueStrCells = (0, _commonUtil.toPathValueStr)(loadingKey);
          const optionList = (0, _treeUtil.toPathOptions)(valueStrCells, options.value, fieldNames.value, true).map(_ref2 => {
            let {
              option
            } = _ref2;
            return option;
          });
          const lastOption = optionList[optionList.length - 1];
          if (!lastOption || lastOption[fieldNames.value.children] || (0, _commonUtil.isLeaf)(lastOption, fieldNames.value)) {
            loadingKeys.value = loadingKeys.value.filter(key => key !== loadingKey);
          }
        });
      }
    });
    // ========================== Values ==========================
    const checkedSet = (0, _vue.computed)(() => new Set((0, _commonUtil.toPathKeys)(values.value)));
    const halfCheckedSet = (0, _vue.computed)(() => new Set((0, _commonUtil.toPathKeys)(halfValues.value)));
    // ====================== Accessibility =======================
    const [activeValueCells, setActiveValueCells] = (0, _useActive.default)();
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
      const isMergedLeaf = (0, _commonUtil.isLeaf)(option, fieldNames.value);
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
    const mergedOptions = (0, _vue.computed)(() => {
      if (baseProps.searchValue) {
        return searchOptions.value;
      }
      return options.value;
    });
    // ========================== Column ==========================
    const optionColumns = (0, _vue.computed)(() => {
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
        onPathSelect(selectValueCells, (0, _commonUtil.isLeaf)(option, fieldNames.value), true);
      }
    };
    (0, _useKeyboard.default)(context, mergedOptions, fieldNames, activeValueCells, onPathOpen, onKeyboardSelect);
    const onListMouseDown = event => {
      event.preventDefault();
    };
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(activeValueCells, cells => {
        var _a;
        for (let i = 0; i < cells.length; i += 1) {
          const cellPath = cells.slice(0, i + 1);
          const cellKeyPath = (0, _commonUtil.toPathKey)(cellPath);
          const ele = (_a = containerRef.value) === null || _a === void 0 ? void 0 : _a.querySelector(`li[data-path-key="${cellKeyPath.replace(/\\{0,2}"/g, '\\"')}"]`);
          if (ele) {
            (0, _commonUtil.scrollIntoParentView)(ele);
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
        [_Column.FIX_LABEL]: notFoundContent,
        disabled: true
      }];
      const columnProps = (0, _extends2.default)((0, _extends2.default)({}, attrs), {
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
        return (0, _vue.createVNode)(_Column.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
          "key": index
        }, columnProps), {}, {
          "prefixCls": mergedPrefixCls.value,
          "options": col.options,
          "prevValuePath": prevValuePath,
          "activeValue": activeValue
        }), null);
      });
      return (0, _vue.createVNode)("div", {
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