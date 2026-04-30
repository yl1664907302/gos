"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.baseSelectPropsWithoutPrivate = void 0;
exports.isMultiple = isMultiple;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _valueUtil = require("./utils/valueUtil");
var _SelectTrigger = _interopRequireDefault(require("./SelectTrigger"));
var _Selector = _interopRequireDefault(require("./Selector"));
var _useSelectTriggerControl = _interopRequireDefault(require("./hooks/useSelectTriggerControl"));
var _useDelayReset = _interopRequireDefault(require("./hooks/useDelayReset"));
var _TransBtn = _interopRequireDefault(require("./TransBtn"));
var _useLock = _interopRequireDefault(require("./hooks/useLock"));
var _useBaseProps = require("./hooks/useBaseProps");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _isMobile = _interopRequireDefault(require("../vc-util/isMobile"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _toReactive = require("../_util/toReactive");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _createRef = _interopRequireDefault(require("../_util/createRef"));
var _LegacyContext = _interopRequireDefault(require("../vc-tree-select/LegacyContext"));
var _vnode = require("../_util/vnode");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const DEFAULT_OMIT_PROPS = ['value', 'onChange', 'removeIcon', 'placeholder', 'autofocus', 'maxTagCount', 'maxTagTextLength', 'maxTagPlaceholder', 'choiceTransitionName', 'onInputKeyDown', 'onPopupScroll', 'tabindex', 'OptionList', 'notFoundContent'];
const baseSelectPrivateProps = () => {
  return {
    prefixCls: String,
    id: String,
    omitDomProps: Array,
    // >>> Value
    displayValues: Array,
    onDisplayValuesChange: Function,
    // >>> Active
    /** Current dropdown list active item string value */
    activeValue: String,
    /** Link search input with target element */
    activeDescendantId: String,
    onActiveValueChange: Function,
    // >>> Search
    searchValue: String,
    /** Trigger onSearch, return false to prevent trigger open event */
    onSearch: Function,
    /** Trigger when search text match the `tokenSeparators`. Will provide split content */
    onSearchSplit: Function,
    maxLength: Number,
    OptionList: _vueTypes.default.any,
    /** Tell if provided `options` is empty */
    emptyOptions: Boolean
  };
};
const baseSelectPropsWithoutPrivate = () => {
  return {
    showSearch: {
      type: Boolean,
      default: undefined
    },
    tagRender: {
      type: Function
    },
    optionLabelRender: {
      type: Function
    },
    direction: {
      type: String
    },
    // MISC
    tabindex: Number,
    autofocus: Boolean,
    notFoundContent: _vueTypes.default.any,
    placeholder: _vueTypes.default.any,
    onClear: Function,
    choiceTransitionName: String,
    // >>> Mode
    mode: String,
    // >>> Status
    disabled: {
      type: Boolean,
      default: undefined
    },
    loading: {
      type: Boolean,
      default: undefined
    },
    // >>> Open
    open: {
      type: Boolean,
      default: undefined
    },
    defaultOpen: {
      type: Boolean,
      default: undefined
    },
    onDropdownVisibleChange: {
      type: Function
    },
    // >>> Customize Input
    /** @private Internal usage. Do not use in your production. */
    getInputElement: {
      type: Function
    },
    /** @private Internal usage. Do not use in your production. */
    getRawInputElement: {
      type: Function
    },
    // >>> Selector
    maxTagTextLength: Number,
    maxTagCount: {
      type: [String, Number]
    },
    maxTagPlaceholder: _vueTypes.default.any,
    // >>> Search
    tokenSeparators: {
      type: Array
    },
    // >>> Icons
    allowClear: {
      type: Boolean,
      default: undefined
    },
    showArrow: {
      type: Boolean,
      default: undefined
    },
    inputIcon: _vueTypes.default.any,
    /** Clear all icon */
    clearIcon: _vueTypes.default.any,
    /** Selector remove icon */
    removeIcon: _vueTypes.default.any,
    // >>> Dropdown
    animation: String,
    transitionName: String,
    dropdownStyle: {
      type: Object
    },
    dropdownClassName: String,
    dropdownMatchSelectWidth: {
      type: [Boolean, Number],
      default: undefined
    },
    dropdownRender: {
      type: Function
    },
    dropdownAlign: Object,
    placement: {
      type: String
    },
    getPopupContainer: {
      type: Function
    },
    // >>> Focus
    showAction: {
      type: Array
    },
    onBlur: {
      type: Function
    },
    onFocus: {
      type: Function
    },
    // >>> Rest Events
    onKeyup: Function,
    onKeydown: Function,
    onMousedown: Function,
    onPopupScroll: Function,
    onInputKeyDown: Function,
    onMouseenter: Function,
    onMouseleave: Function,
    onClick: Function
  };
};
exports.baseSelectPropsWithoutPrivate = baseSelectPropsWithoutPrivate;
const baseSelectProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, baseSelectPrivateProps()), baseSelectPropsWithoutPrivate());
};
function isMultiple(mode) {
  return mode === 'tags' || mode === 'multiple';
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'BaseSelect',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(baseSelectProps(), {
    showAction: [],
    notFoundContent: 'Not Found'
  }),
  setup(props, _ref) {
    let {
      attrs,
      expose,
      slots
    } = _ref;
    const multiple = (0, _vue.computed)(() => isMultiple(props.mode));
    const mergedShowSearch = (0, _vue.computed)(() => props.showSearch !== undefined ? props.showSearch : multiple.value || props.mode === 'combobox');
    const mobile = (0, _vue.shallowRef)(false);
    (0, _vue.onMounted)(() => {
      mobile.value = (0, _isMobile.default)();
    });
    const legacyTreeSelectContext = (0, _LegacyContext.default)();
    // ============================== Refs ==============================
    const containerRef = (0, _vue.shallowRef)(null);
    const selectorDomRef = (0, _createRef.default)();
    const triggerRef = (0, _vue.shallowRef)(null);
    const selectorRef = (0, _vue.shallowRef)(null);
    const listRef = (0, _vue.shallowRef)(null);
    const blurRef = (0, _vue.ref)(false);
    /** Used for component focused management */
    const [mockFocused, setMockFocused, cancelSetMockFocused] = (0, _useDelayReset.default)();
    const focus = () => {
      var _a;
      (_a = selectorRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = selectorRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur,
      scrollTo: arg => {
        var _a;
        return (_a = listRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(arg);
      }
    });
    const mergedSearchValue = (0, _vue.computed)(() => {
      var _a;
      if (props.mode !== 'combobox') {
        return props.searchValue;
      }
      const val = (_a = props.displayValues[0]) === null || _a === void 0 ? void 0 : _a.value;
      return typeof val === 'string' || typeof val === 'number' ? String(val) : '';
    });
    // ============================== Open ==============================
    const initOpen = props.open !== undefined ? props.open : props.defaultOpen;
    const innerOpen = (0, _vue.shallowRef)(initOpen);
    const mergedOpen = (0, _vue.shallowRef)(initOpen);
    const setInnerOpen = val => {
      innerOpen.value = props.open !== undefined ? props.open : val;
      mergedOpen.value = innerOpen.value;
    };
    (0, _vue.watch)(() => props.open, () => {
      setInnerOpen(props.open);
    });
    // Not trigger `open` in `combobox` when `notFoundContent` is empty
    const emptyListContent = (0, _vue.computed)(() => !props.notFoundContent && props.emptyOptions);
    (0, _vue.watchEffect)(() => {
      mergedOpen.value = innerOpen.value;
      if (props.disabled || emptyListContent.value && mergedOpen.value && props.mode === 'combobox') {
        mergedOpen.value = false;
      }
    });
    const triggerOpen = (0, _vue.computed)(() => emptyListContent.value ? false : mergedOpen.value);
    const onToggleOpen = newOpen => {
      const nextOpen = newOpen !== undefined ? newOpen : !mergedOpen.value;
      if (mergedOpen.value !== nextOpen && !props.disabled) {
        setInnerOpen(nextOpen);
        props.onDropdownVisibleChange && props.onDropdownVisibleChange(nextOpen);
        if (!nextOpen && popupFocused.value) {
          popupFocused.value = false;
          setMockFocused(false, () => {
            focusRef.value = false;
            blurRef.value = false;
          });
        }
      }
    };
    const tokenWithEnter = (0, _vue.computed)(() => (props.tokenSeparators || []).some(tokenSeparator => ['\n', '\r\n'].includes(tokenSeparator)));
    const onInternalSearch = (searchText, fromTyping, isCompositing) => {
      var _a, _b;
      let ret = true;
      let newSearchText = searchText;
      (_a = props.onActiveValueChange) === null || _a === void 0 ? void 0 : _a.call(props, null);
      // Check if match the `tokenSeparators`
      const patchLabels = isCompositing ? null : (0, _valueUtil.getSeparatedContent)(searchText, props.tokenSeparators);
      // Ignore combobox since it's not split-able
      if (props.mode !== 'combobox' && patchLabels) {
        newSearchText = '';
        (_b = props.onSearchSplit) === null || _b === void 0 ? void 0 : _b.call(props, patchLabels);
        // Should close when paste finish
        onToggleOpen(false);
        // Tell Selector that break next actions
        ret = false;
      }
      if (props.onSearch && mergedSearchValue.value !== newSearchText) {
        props.onSearch(newSearchText, {
          source: fromTyping ? 'typing' : 'effect'
        });
      }
      return ret;
    };
    // Only triggered when menu is closed & mode is tags
    // If menu is open, OptionList will take charge
    // If mode isn't tags, press enter is not meaningful when you can't see any option
    const onInternalSearchSubmit = searchText => {
      var _a;
      // prevent empty tags from appearing when you click the Enter button
      if (!searchText || !searchText.trim()) {
        return;
      }
      (_a = props.onSearch) === null || _a === void 0 ? void 0 : _a.call(props, searchText, {
        source: 'submit'
      });
    };
    // Close will clean up single mode search text
    (0, _vue.watch)(mergedOpen, () => {
      if (!mergedOpen.value && !multiple.value && props.mode !== 'combobox') {
        onInternalSearch('', false, false);
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    // ============================ Disabled ============================
    // Close dropdown & remove focus state when disabled change
    (0, _vue.watch)(() => props.disabled, () => {
      if (innerOpen.value && !!props.disabled) {
        setInnerOpen(false);
      }
      if (props.disabled && !blurRef.value) {
        setMockFocused(false);
      }
    }, {
      immediate: true
    });
    // ============================ Keyboard ============================
    /**
     * We record input value here to check if can press to clean up by backspace
     * - null: Key is not down, this is reset by key up
     * - true: Search text is empty when first time backspace down
     * - false: Search text is not empty when first time backspace down
     */
    const [getClearLock, setClearLock] = (0, _useLock.default)();
    // KeyDown
    const onInternalKeyDown = function (event) {
      var _a;
      const clearLock = getClearLock();
      const {
        which
      } = event;
      if (which === _KeyCode.default.ENTER) {
        // Do not submit form when type in the input
        if (props.mode !== 'combobox') {
          event.preventDefault();
        }
        // We only manage open state here, close logic should handle by list component
        if (!mergedOpen.value) {
          onToggleOpen(true);
        }
      }
      setClearLock(!!mergedSearchValue.value);
      // Remove value by `backspace`
      if (which === _KeyCode.default.BACKSPACE && !clearLock && multiple.value && !mergedSearchValue.value && props.displayValues.length) {
        const cloneDisplayValues = [...props.displayValues];
        let removedDisplayValue = null;
        for (let i = cloneDisplayValues.length - 1; i >= 0; i -= 1) {
          const current = cloneDisplayValues[i];
          if (!current.disabled) {
            cloneDisplayValues.splice(i, 1);
            removedDisplayValue = current;
            break;
          }
        }
        if (removedDisplayValue) {
          props.onDisplayValuesChange(cloneDisplayValues, {
            type: 'remove',
            values: [removedDisplayValue]
          });
        }
      }
      for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
      }
      if (mergedOpen.value && listRef.value) {
        listRef.value.onKeydown(event, ...rest);
      }
      (_a = props.onKeydown) === null || _a === void 0 ? void 0 : _a.call(props, event, ...rest);
    };
    // KeyUp
    const onInternalKeyUp = function (event) {
      for (var _len2 = arguments.length, rest = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        rest[_key2 - 1] = arguments[_key2];
      }
      if (mergedOpen.value && listRef.value) {
        listRef.value.onKeyup(event, ...rest);
      }
      if (props.onKeyup) {
        props.onKeyup(event, ...rest);
      }
    };
    // ============================ Selector ============================
    const onSelectorRemove = val => {
      const newValues = props.displayValues.filter(i => i !== val);
      props.onDisplayValuesChange(newValues, {
        type: 'remove',
        values: [val]
      });
    };
    // ========================== Focus / Blur ==========================
    /** Record real focus status */
    const focusRef = (0, _vue.shallowRef)(false);
    const onContainerFocus = function () {
      setMockFocused(true);
      if (!props.disabled) {
        if (props.onFocus && !focusRef.value) {
          props.onFocus(...arguments);
        }
        // `showAction` should handle `focus` if set
        if (props.showAction && props.showAction.includes('focus')) {
          onToggleOpen(true);
        }
      }
      focusRef.value = true;
    };
    const popupFocused = (0, _vue.ref)(false);
    const onContainerBlur = function () {
      if (popupFocused.value) {
        return;
      }
      blurRef.value = true;
      setMockFocused(false, () => {
        focusRef.value = false;
        blurRef.value = false;
        onToggleOpen(false);
      });
      if (props.disabled) {
        return;
      }
      const searchVal = mergedSearchValue.value;
      if (searchVal) {
        // `tags` mode should move `searchValue` into values
        if (props.mode === 'tags') {
          props.onSearch(searchVal, {
            source: 'submit'
          });
        } else if (props.mode === 'multiple') {
          // `multiple` mode only clean the search value but not trigger event
          props.onSearch('', {
            source: 'blur'
          });
        }
      }
      if (props.onBlur) {
        props.onBlur(...arguments);
      }
    };
    const onPopupFocusin = () => {
      popupFocused.value = true;
    };
    const onPopupFocusout = () => {
      popupFocused.value = false;
    };
    (0, _vue.provide)('VCSelectContainerEvent', {
      focus: onContainerFocus,
      blur: onContainerBlur
    });
    // Give focus back of Select
    const activeTimeoutIds = [];
    (0, _vue.onMounted)(() => {
      activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    });
    (0, _vue.onBeforeUnmount)(() => {
      activeTimeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
      activeTimeoutIds.splice(0, activeTimeoutIds.length);
    });
    const onInternalMouseDown = function (event) {
      var _a, _b;
      const {
        target
      } = event;
      const popupElement = (_a = triggerRef.value) === null || _a === void 0 ? void 0 : _a.getPopupElement();
      // We should give focus back to selector if clicked item is not focusable
      if (popupElement && popupElement.contains(target)) {
        const timeoutId = setTimeout(() => {
          var _a;
          const index = activeTimeoutIds.indexOf(timeoutId);
          if (index !== -1) {
            activeTimeoutIds.splice(index, 1);
          }
          cancelSetMockFocused();
          if (!mobile.value && !popupElement.contains(document.activeElement)) {
            (_a = selectorRef.value) === null || _a === void 0 ? void 0 : _a.focus();
          }
        });
        activeTimeoutIds.push(timeoutId);
      }
      for (var _len3 = arguments.length, restArgs = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        restArgs[_key3 - 1] = arguments[_key3];
      }
      (_b = props.onMousedown) === null || _b === void 0 ? void 0 : _b.call(props, event, ...restArgs);
    };
    // ============================= Dropdown ==============================
    const containerWidth = (0, _vue.shallowRef)(null);
    // const instance = getCurrentInstance();
    const onPopupMouseEnter = () => {
      // We need force update here since popup dom is render async
      // instance.update();
    };
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(triggerOpen, () => {
        var _a;
        if (triggerOpen.value) {
          const newWidth = Math.ceil((_a = containerRef.value) === null || _a === void 0 ? void 0 : _a.offsetWidth);
          if (containerWidth.value !== newWidth && !Number.isNaN(newWidth)) {
            containerWidth.value = newWidth;
          }
        }
      }, {
        immediate: true,
        flush: 'post'
      });
    });
    // Close when click on non-select element
    (0, _useSelectTriggerControl.default)([containerRef, triggerRef], triggerOpen, onToggleOpen);
    (0, _useBaseProps.useProvideBaseSelectProps)((0, _toReactive.toReactive)((0, _extends2.default)((0, _extends2.default)({}, (0, _vue.toRefs)(props)), {
      open: mergedOpen,
      triggerOpen,
      showSearch: mergedShowSearch,
      multiple,
      toggleOpen: onToggleOpen
    })));
    return () => {
      const _a = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          prefixCls,
          id,
          open,
          defaultOpen,
          mode,
          // Search related
          showSearch,
          searchValue,
          onSearch,
          // Icons
          allowClear,
          clearIcon,
          showArrow,
          inputIcon,
          // Others
          disabled,
          loading,
          getInputElement,
          getPopupContainer,
          placement,
          // Dropdown
          animation,
          transitionName,
          dropdownStyle,
          dropdownClassName,
          dropdownMatchSelectWidth,
          dropdownRender,
          dropdownAlign,
          showAction,
          direction,
          // Tags
          tokenSeparators,
          tagRender,
          optionLabelRender,
          // Events
          onPopupScroll,
          onDropdownVisibleChange,
          onFocus,
          onBlur,
          onKeyup,
          onKeydown,
          onMousedown,
          onClear,
          omitDomProps,
          getRawInputElement,
          displayValues,
          onDisplayValuesChange,
          emptyOptions,
          activeDescendantId,
          activeValue,
          OptionList
        } = _a,
        restProps = __rest(_a, ["prefixCls", "id", "open", "defaultOpen", "mode", "showSearch", "searchValue", "onSearch", "allowClear", "clearIcon", "showArrow", "inputIcon", "disabled", "loading", "getInputElement", "getPopupContainer", "placement", "animation", "transitionName", "dropdownStyle", "dropdownClassName", "dropdownMatchSelectWidth", "dropdownRender", "dropdownAlign", "showAction", "direction", "tokenSeparators", "tagRender", "optionLabelRender", "onPopupScroll", "onDropdownVisibleChange", "onFocus", "onBlur", "onKeyup", "onKeydown", "onMousedown", "onClear", "omitDomProps", "getRawInputElement", "displayValues", "onDisplayValuesChange", "emptyOptions", "activeDescendantId", "activeValue", "OptionList"]);
      // ============================= Input ==============================
      // Only works in `combobox`
      const customizeInputElement = mode === 'combobox' && getInputElement && getInputElement() || null;
      // Used for customize replacement for `vc-cascader`
      const customizeRawInputElement = typeof getRawInputElement === 'function' && getRawInputElement();
      const domProps = (0, _extends2.default)({}, restProps);
      // Used for raw custom input trigger
      let onTriggerVisibleChange;
      if (customizeRawInputElement) {
        onTriggerVisibleChange = newOpen => {
          onToggleOpen(newOpen);
        };
      }
      DEFAULT_OMIT_PROPS.forEach(propName => {
        delete domProps[propName];
      });
      omitDomProps === null || omitDomProps === void 0 ? void 0 : omitDomProps.forEach(propName => {
        delete domProps[propName];
      });
      // ============================= Arrow ==============================
      const mergedShowArrow = showArrow !== undefined ? showArrow : loading || !multiple.value && mode !== 'combobox';
      let arrowNode;
      if (mergedShowArrow) {
        arrowNode = (0, _vue.createVNode)(_TransBtn.default, {
          "class": (0, _classNames.default)(`${prefixCls}-arrow`, {
            [`${prefixCls}-arrow-loading`]: loading
          }),
          "customizeIcon": inputIcon,
          "customizeIconProps": {
            loading,
            searchValue: mergedSearchValue.value,
            open: mergedOpen.value,
            focused: mockFocused.value,
            showSearch: mergedShowSearch.value
          }
        }, null);
      }
      // ============================= Clear ==============================
      let clearNode;
      const onClearMouseDown = () => {
        onClear === null || onClear === void 0 ? void 0 : onClear();
        onDisplayValuesChange([], {
          type: 'clear',
          values: displayValues
        });
        onInternalSearch('', false, false);
      };
      if (!disabled && allowClear && (displayValues.length || mergedSearchValue.value)) {
        clearNode = (0, _vue.createVNode)(_TransBtn.default, {
          "class": `${prefixCls}-clear`,
          "onMousedown": onClearMouseDown,
          "customizeIcon": clearIcon
        }, {
          default: () => [(0, _vue.createTextVNode)("\xD7")]
        });
      }
      // =========================== OptionList ===========================
      const optionList = (0, _vue.createVNode)(OptionList, {
        "ref": listRef
      }, (0, _extends2.default)((0, _extends2.default)({}, legacyTreeSelectContext.customSlots), {
        option: slots.option
      }));
      // ============================= Select =============================
      const mergedClassName = (0, _classNames.default)(prefixCls, attrs.class, {
        [`${prefixCls}-focused`]: mockFocused.value,
        [`${prefixCls}-multiple`]: multiple.value,
        [`${prefixCls}-single`]: !multiple.value,
        [`${prefixCls}-allow-clear`]: allowClear,
        [`${prefixCls}-show-arrow`]: mergedShowArrow,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-loading`]: loading,
        [`${prefixCls}-open`]: mergedOpen.value,
        [`${prefixCls}-customize-input`]: customizeInputElement,
        [`${prefixCls}-show-search`]: mergedShowSearch.value
      });
      // >>> Selector
      const selectorNode = (0, _vue.createVNode)(_SelectTrigger.default, {
        "ref": triggerRef,
        "disabled": disabled,
        "prefixCls": prefixCls,
        "visible": triggerOpen.value,
        "popupElement": optionList,
        "containerWidth": containerWidth.value,
        "animation": animation,
        "transitionName": transitionName,
        "dropdownStyle": dropdownStyle,
        "dropdownClassName": dropdownClassName,
        "direction": direction,
        "dropdownMatchSelectWidth": dropdownMatchSelectWidth,
        "dropdownRender": dropdownRender,
        "dropdownAlign": dropdownAlign,
        "placement": placement,
        "getPopupContainer": getPopupContainer,
        "empty": emptyOptions,
        "getTriggerDOMNode": () => selectorDomRef.current,
        "onPopupVisibleChange": onTriggerVisibleChange,
        "onPopupMouseEnter": onPopupMouseEnter,
        "onPopupFocusin": onPopupFocusin,
        "onPopupFocusout": onPopupFocusout
      }, {
        default: () => {
          return customizeRawInputElement ? (0, _propsUtil.isValidElement)(customizeRawInputElement) && (0, _vnode.cloneElement)(customizeRawInputElement, {
            ref: selectorDomRef
          }, false, true) : (0, _vue.createVNode)(_Selector.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
            "domRef": selectorDomRef,
            "prefixCls": prefixCls,
            "inputElement": customizeInputElement,
            "ref": selectorRef,
            "id": id,
            "showSearch": mergedShowSearch.value,
            "mode": mode,
            "activeDescendantId": activeDescendantId,
            "tagRender": tagRender,
            "optionLabelRender": optionLabelRender,
            "values": displayValues,
            "open": mergedOpen.value,
            "onToggleOpen": onToggleOpen,
            "activeValue": activeValue,
            "searchValue": mergedSearchValue.value,
            "onSearch": onInternalSearch,
            "onSearchSubmit": onInternalSearchSubmit,
            "onRemove": onSelectorRemove,
            "tokenWithEnter": tokenWithEnter.value
          }), null);
        }
      });
      // >>> Render
      let renderNode;
      // Render raw
      if (customizeRawInputElement) {
        renderNode = selectorNode;
      } else {
        renderNode = (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, domProps), {}, {
          "class": mergedClassName,
          "ref": containerRef,
          "onMousedown": onInternalMouseDown,
          "onKeydown": onInternalKeyDown,
          "onKeyup": onInternalKeyUp
        }), [mockFocused.value && !mergedOpen.value && (0, _vue.createVNode)("span", {
          "style": {
            width: 0,
            height: 0,
            position: 'absolute',
            overflow: 'hidden',
            opacity: 0
          },
          "aria-live": "polite"
        }, [`${displayValues.map(_ref2 => {
          let {
            label,
            value
          } = _ref2;
          return ['number', 'string'].includes(typeof label) ? label : value;
        }).join(', ')}`]), selectorNode, arrowNode, clearNode]);
      }
      return renderNode;
    };
  }
});