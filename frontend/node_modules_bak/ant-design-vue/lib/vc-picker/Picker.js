"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _PickerPanel = _interopRequireDefault(require("./PickerPanel"));
var _PickerTrigger = _interopRequireDefault(require("./PickerTrigger"));
var _PresetPanel = _interopRequireDefault(require("./PresetPanel"));
var _dateUtil = require("./utils/dateUtil");
var _miscUtil = _interopRequireWildcard(require("./utils/miscUtil"));
var _PanelContext = require("./PanelContext");
var _uiUtil = require("./utils/uiUtil");
var _usePickerInput = _interopRequireDefault(require("./hooks/usePickerInput"));
var _useTextValueMapping = _interopRequireDefault(require("./hooks/useTextValueMapping"));
var _useValueTexts = _interopRequireDefault(require("./hooks/useValueTexts"));
var _useHoverValue = _interopRequireDefault(require("./hooks/useHoverValue"));
var _usePresets = _interopRequireDefault(require("./hooks/usePresets"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _warning = require("../vc-util/warning");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _warnUtil = require("./utils/warnUtil");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Removed:
 *  - getCalendarContainer: use `getPopupContainer` instead
 *  - onOk
 *
 * New Feature:
 *  - picker
 *  - allowEmpty
 *  - selectable
 *
 * Tips: Should add faq about `datetime` mode with `defaultValue`
 */

function Picker() {
  return (0, _vue.defineComponent)({
    name: 'Picker',
    inheritAttrs: false,
    props: ['prefixCls', 'id', 'tabindex', 'dropdownClassName', 'dropdownAlign', 'popupStyle', 'transitionName', 'generateConfig', 'locale', 'inputReadOnly', 'allowClear', 'autofocus', 'showTime', 'showNow', 'showHour', 'showMinute', 'showSecond', 'picker', 'format', 'use12Hours', 'value', 'defaultValue', 'open', 'defaultOpen', 'defaultOpenValue', 'suffixIcon', 'presets', 'clearIcon', 'disabled', 'disabledDate', 'placeholder', 'getPopupContainer', 'panelRender', 'inputRender', 'onChange', 'onOpenChange', 'onPanelChange', 'onFocus', 'onBlur', 'onMousedown', 'onMouseup', 'onMouseenter', 'onMouseleave', 'onContextmenu', 'onClick', 'onKeydown', 'onSelect', 'direction', 'autocomplete', 'showToday', 'renderExtraFooter', 'dateRender', 'minuteStep', 'hourStep', 'secondStep', 'hideDisabledOptions'],
    setup(props, _ref) {
      let {
        attrs,
        expose
      } = _ref;
      const inputRef = (0, _vue.ref)(null);
      const presets = (0, _vue.computed)(() => props.presets);
      const presetList = (0, _usePresets.default)(presets);
      const picker = (0, _vue.computed)(() => {
        var _a;
        return (_a = props.picker) !== null && _a !== void 0 ? _a : 'date';
      });
      const needConfirmButton = (0, _vue.computed)(() => picker.value === 'date' && !!props.showTime || picker.value === 'time');
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        (0, _warnUtil.legacyPropsWarning)(props);
      }
      // ============================= State =============================
      const formatList = (0, _vue.computed)(() => (0, _miscUtil.toArray)((0, _uiUtil.getDefaultFormat)(props.format, picker.value, props.showTime, props.use12Hours)));
      // Panel ref
      const panelDivRef = (0, _vue.ref)(null);
      const inputDivRef = (0, _vue.ref)(null);
      const containerRef = (0, _vue.ref)(null);
      // Real value
      const [mergedValue, setInnerValue] = (0, _useMergedState.default)(null, {
        value: (0, _vue.toRef)(props, 'value'),
        defaultValue: props.defaultValue
      });
      const selectedValue = (0, _vue.ref)(mergedValue.value);
      const setSelectedValue = val => {
        selectedValue.value = val;
      };
      // Operation ref
      const operationRef = (0, _vue.ref)(null);
      // Open
      const [mergedOpen, triggerInnerOpen] = (0, _useMergedState.default)(false, {
        value: (0, _vue.toRef)(props, 'open'),
        defaultValue: props.defaultOpen,
        postState: postOpen => props.disabled ? false : postOpen,
        onChange: newOpen => {
          if (props.onOpenChange) {
            props.onOpenChange(newOpen);
          }
          if (!newOpen && operationRef.value && operationRef.value.onClose) {
            operationRef.value.onClose();
          }
        }
      });
      // ============================= Text ==============================
      const [valueTexts, firstValueText] = (0, _useValueTexts.default)(selectedValue, {
        formatList,
        generateConfig: (0, _vue.toRef)(props, 'generateConfig'),
        locale: (0, _vue.toRef)(props, 'locale')
      });
      const [text, triggerTextChange, resetText] = (0, _useTextValueMapping.default)({
        valueTexts,
        onTextChange: newText => {
          const inputDate = (0, _dateUtil.parseValue)(newText, {
            locale: props.locale,
            formatList: formatList.value,
            generateConfig: props.generateConfig
          });
          if (inputDate && (!props.disabledDate || !props.disabledDate(inputDate))) {
            setSelectedValue(inputDate);
          }
        }
      });
      // ============================ Trigger ============================
      const triggerChange = newValue => {
        const {
          onChange,
          generateConfig,
          locale
        } = props;
        setSelectedValue(newValue);
        setInnerValue(newValue);
        if (onChange && !(0, _dateUtil.isEqual)(generateConfig, mergedValue.value, newValue)) {
          onChange(newValue, newValue ? (0, _dateUtil.formatValue)(newValue, {
            generateConfig,
            locale,
            format: formatList.value[0]
          }) : '');
        }
      };
      const triggerOpen = newOpen => {
        if (props.disabled && newOpen) {
          return;
        }
        triggerInnerOpen(newOpen);
      };
      const forwardKeydown = e => {
        if (mergedOpen.value && operationRef.value && operationRef.value.onKeydown) {
          // Let popup panel handle keyboard
          return operationRef.value.onKeydown(e);
        }
        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          (0, _warning.warning)(false, 'Picker not correct forward Keydown operation. Please help to fire issue about this.');
          return false;
        }
      };
      const onInternalMouseup = function () {
        if (props.onMouseup) {
          props.onMouseup(...arguments);
        }
        if (inputRef.value) {
          inputRef.value.focus();
          triggerOpen(true);
        }
      };
      // ============================= Input =============================
      const [inputProps, {
        focused,
        typing
      }] = (0, _usePickerInput.default)({
        blurToCancel: needConfirmButton,
        open: mergedOpen,
        value: text,
        triggerOpen,
        forwardKeydown,
        isClickOutside: target => !(0, _uiUtil.elementsContains)([panelDivRef.value, inputDivRef.value, containerRef.value], target),
        onSubmit: () => {
          if (
          // When user typing disabledDate with keyboard and enter, this value will be empty
          !selectedValue.value ||
          // Normal disabled check
          props.disabledDate && props.disabledDate(selectedValue.value)) {
            return false;
          }
          triggerChange(selectedValue.value);
          triggerOpen(false);
          resetText();
          return true;
        },
        onCancel: () => {
          triggerOpen(false);
          setSelectedValue(mergedValue.value);
          resetText();
        },
        onKeydown: (e, preventDefault) => {
          var _a;
          (_a = props.onKeydown) === null || _a === void 0 ? void 0 : _a.call(props, e, preventDefault);
        },
        onFocus: e => {
          var _a;
          (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
        },
        onBlur: e => {
          var _a;
          (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        }
      });
      // ============================= Sync ==============================
      // Close should sync back with text value
      (0, _vue.watch)([mergedOpen, valueTexts], () => {
        if (!mergedOpen.value) {
          setSelectedValue(mergedValue.value);
          if (!valueTexts.value.length || valueTexts.value[0] === '') {
            triggerTextChange('');
          } else if (firstValueText.value !== text.value) {
            resetText();
          }
        }
      });
      // Change picker should sync back with text value
      (0, _vue.watch)(picker, () => {
        if (!mergedOpen.value) {
          resetText();
        }
      });
      // Sync innerValue with control mode
      (0, _vue.watch)(mergedValue, () => {
        // Sync select value
        setSelectedValue(mergedValue.value);
      });
      const [hoverValue, onEnter, onLeave] = (0, _useHoverValue.default)(text, {
        formatList,
        generateConfig: (0, _vue.toRef)(props, 'generateConfig'),
        locale: (0, _vue.toRef)(props, 'locale')
      });
      const onContextSelect = (date, type) => {
        if (type === 'submit' || type !== 'key' && !needConfirmButton.value) {
          // triggerChange will also update selected values
          triggerChange(date);
          triggerOpen(false);
        }
      };
      (0, _PanelContext.useProvidePanel)({
        operationRef,
        hideHeader: (0, _vue.computed)(() => picker.value === 'time'),
        onSelect: onContextSelect,
        open: mergedOpen,
        defaultOpenValue: (0, _vue.toRef)(props, 'defaultOpenValue'),
        onDateMouseenter: onEnter,
        onDateMouseleave: onLeave
      });
      expose({
        focus: () => {
          if (inputRef.value) {
            inputRef.value.focus();
          }
        },
        blur: () => {
          if (inputRef.value) {
            inputRef.value.blur();
          }
        }
      });
      return () => {
        const {
          prefixCls = 'rc-picker',
          id,
          tabindex,
          dropdownClassName,
          dropdownAlign,
          popupStyle,
          transitionName,
          generateConfig,
          locale,
          inputReadOnly,
          allowClear,
          autofocus,
          picker = 'date',
          defaultOpenValue,
          suffixIcon,
          clearIcon,
          disabled,
          placeholder,
          getPopupContainer,
          panelRender,
          onMousedown,
          onMouseenter,
          onMouseleave,
          onContextmenu,
          onClick,
          onSelect,
          direction,
          autocomplete = 'off'
        } = props;
        // ============================= Panel =============================
        const panelProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), attrs), {
          class: (0, _classNames.default)({
            [`${prefixCls}-panel-focused`]: !typing.value
          }),
          style: undefined,
          pickerValue: undefined,
          onPickerValueChange: undefined,
          onChange: null
        });
        let panelNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-panel-layout`
        }, [(0, _vue.createVNode)(_PresetPanel.default, {
          "prefixCls": prefixCls,
          "presets": presetList.value,
          "onClick": nextValue => {
            triggerChange(nextValue);
            triggerOpen(false);
          }
        }, null), (0, _vue.createVNode)(_PickerPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, panelProps), {}, {
          "generateConfig": generateConfig,
          "value": selectedValue.value,
          "locale": locale,
          "tabindex": -1,
          "onSelect": date => {
            onSelect === null || onSelect === void 0 ? void 0 : onSelect(date);
            setSelectedValue(date);
          },
          "direction": direction,
          "onPanelChange": (viewDate, mode) => {
            const {
              onPanelChange
            } = props;
            onLeave(true);
            onPanelChange === null || onPanelChange === void 0 ? void 0 : onPanelChange(viewDate, mode);
          }
        }), null)]);
        if (panelRender) {
          panelNode = panelRender(panelNode);
        }
        const panel = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-panel-container`,
          "ref": panelDivRef,
          "onMousedown": e => {
            e.preventDefault();
          }
        }, [panelNode]);
        let suffixNode;
        if (suffixIcon) {
          suffixNode = (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-suffix`
          }, [suffixIcon]);
        }
        let clearNode;
        if (allowClear && mergedValue.value && !disabled) {
          clearNode = (0, _vue.createVNode)("span", {
            "onMousedown": e => {
              e.preventDefault();
              e.stopPropagation();
            },
            "onMouseup": e => {
              e.preventDefault();
              e.stopPropagation();
              triggerChange(null);
              triggerOpen(false);
            },
            "class": `${prefixCls}-clear`,
            "role": "button"
          }, [clearIcon || (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-clear-btn`
          }, null)]);
        }
        const mergedInputProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
          id,
          tabindex,
          disabled,
          readonly: inputReadOnly || typeof formatList.value[0] === 'function' || !typing.value,
          value: hoverValue.value || text.value,
          onInput: e => {
            triggerTextChange(e.target.value);
          },
          autofocus,
          placeholder,
          ref: inputRef,
          title: text.value
        }, inputProps.value), {
          size: (0, _uiUtil.getInputSize)(picker, formatList.value[0], generateConfig)
        }), (0, _miscUtil.default)(props)), {
          autocomplete
        });
        const inputNode = props.inputRender ? props.inputRender(mergedInputProps) : (0, _vue.createVNode)("input", mergedInputProps, null);
        // ============================ Warning ============================
        if (process.env.NODE_ENV !== 'production') {
          (0, _warning.warning)(!defaultOpenValue, '`defaultOpenValue` may confuse user for the current value status. Please use `defaultValue` instead.');
        }
        // ============================ Return =============================
        const popupPlacement = direction === 'rtl' ? 'bottomRight' : 'bottomLeft';
        return (0, _vue.createVNode)("div", {
          "ref": containerRef,
          "class": (0, _classNames.default)(prefixCls, attrs.class, {
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-focused`]: focused.value,
            [`${prefixCls}-rtl`]: direction === 'rtl'
          }),
          "style": attrs.style,
          "onMousedown": onMousedown,
          "onMouseup": onInternalMouseup,
          "onMouseenter": onMouseenter,
          "onMouseleave": onMouseleave,
          "onContextmenu": onContextmenu,
          "onClick": onClick
        }, [(0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${prefixCls}-input`, {
            [`${prefixCls}-input-placeholder`]: !!hoverValue.value
          }),
          "ref": inputDivRef
        }, [inputNode, suffixNode, clearNode]), (0, _vue.createVNode)(_PickerTrigger.default, {
          "visible": mergedOpen.value,
          "popupStyle": popupStyle,
          "prefixCls": prefixCls,
          "dropdownClassName": dropdownClassName,
          "dropdownAlign": dropdownAlign,
          "getPopupContainer": getPopupContainer,
          "transitionName": transitionName,
          "popupPlacement": popupPlacement,
          "direction": direction
        }, {
          default: () => [(0, _vue.createVNode)("div", {
            "style": {
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          }, null)],
          popupElement: () => panel
        })]);
      };
    }
  });
}
var _default = exports.default = Picker();