"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _PickerTrigger = _interopRequireDefault(require("./PickerTrigger"));
var _PickerPanel = _interopRequireDefault(require("./PickerPanel"));
var _usePickerInput = _interopRequireDefault(require("./hooks/usePickerInput"));
var _PresetPanel = _interopRequireDefault(require("./PresetPanel"));
var _miscUtil = _interopRequireWildcard(require("./utils/miscUtil"));
var _uiUtil = require("./utils/uiUtil");
var _PanelContext = require("./PanelContext");
var _dateUtil = require("./utils/dateUtil");
var _useValueTexts = _interopRequireDefault(require("./hooks/useValueTexts"));
var _useTextValueMapping = _interopRequireDefault(require("./hooks/useTextValueMapping"));
var _usePresets = _interopRequireDefault(require("./hooks/usePresets"));
var _RangeContext = require("./RangeContext");
var _useRangeDisabled = _interopRequireDefault(require("./hooks/useRangeDisabled"));
var _getExtraFooter = _interopRequireDefault(require("./utils/getExtraFooter"));
var _getRanges = _interopRequireDefault(require("./utils/getRanges"));
var _useRangeViewDates = _interopRequireDefault(require("./hooks/useRangeViewDates"));
var _useHoverValue = _interopRequireDefault(require("./hooks/useHoverValue"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _warning = require("../vc-util/warning");
var _useState = _interopRequireDefault(require("../_util/hooks/useState"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _warnUtil = require("./utils/warnUtil");
var _useElementSize = require("../_util/hooks/_vueuse/useElementSize");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function reorderValues(values, generateConfig) {
  if (values && values[0] && values[1] && generateConfig.isAfter(values[0], values[1])) {
    return [values[1], values[0]];
  }
  return values;
}
function canValueTrigger(value, index, disabled, allowEmpty) {
  if (value) {
    return true;
  }
  if (allowEmpty && allowEmpty[index]) {
    return true;
  }
  if (disabled[(index + 1) % 2]) {
    return true;
  }
  return false;
}
function RangerPicker() {
  return (0, _vue.defineComponent)({
    name: 'RangerPicker',
    inheritAttrs: false,
    props: ['prefixCls', 'id', 'popupStyle', 'dropdownClassName', 'transitionName', 'dropdownAlign', 'getPopupContainer', 'generateConfig', 'locale', 'placeholder', 'autofocus', 'disabled', 'format', 'picker', 'showTime', 'showNow', 'showHour', 'showMinute', 'showSecond', 'use12Hours', 'separator', 'value', 'defaultValue', 'defaultPickerValue', 'open', 'defaultOpen', 'disabledDate', 'disabledTime', 'dateRender', 'panelRender', 'ranges', 'allowEmpty', 'allowClear', 'suffixIcon', 'clearIcon', 'pickerRef', 'inputReadOnly', 'mode', 'renderExtraFooter', 'onChange', 'onOpenChange', 'onPanelChange', 'onCalendarChange', 'onFocus', 'onBlur', 'onMousedown', 'onMouseup', 'onMouseenter', 'onMouseleave', 'onClick', 'onOk', 'onKeydown', 'components', 'order', 'direction', 'activePickerIndex', 'autocomplete', 'minuteStep', 'hourStep', 'secondStep', 'hideDisabledOptions', 'disabledMinutes', 'presets', 'prevIcon', 'nextIcon', 'superPrevIcon', 'superNextIcon'],
    setup(props, _ref) {
      let {
        attrs,
        expose
      } = _ref;
      const needConfirmButton = (0, _vue.computed)(() => props.picker === 'date' && !!props.showTime || props.picker === 'time');
      const presets = (0, _vue.computed)(() => props.presets);
      const ranges = (0, _vue.computed)(() => props.ranges);
      const presetList = (0, _usePresets.default)(presets, ranges);
      // We record oqqpened status here in case repeat open with picker
      const openRecordsRef = (0, _vue.ref)({});
      const containerRef = (0, _vue.ref)(null);
      const panelDivRef = (0, _vue.ref)(null);
      const startInputDivRef = (0, _vue.ref)(null);
      const endInputDivRef = (0, _vue.ref)(null);
      const separatorRef = (0, _vue.ref)(null);
      const startInputRef = (0, _vue.ref)(null);
      const endInputRef = (0, _vue.ref)(null);
      const arrowRef = (0, _vue.ref)(null);
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        (0, _warnUtil.legacyPropsWarning)(props);
      }
      // ============================= Misc ==============================
      const formatList = (0, _vue.computed)(() => (0, _miscUtil.toArray)((0, _uiUtil.getDefaultFormat)(props.format, props.picker, props.showTime, props.use12Hours)));
      // Active picker
      const [mergedActivePickerIndex, setMergedActivePickerIndex] = (0, _useMergedState.default)(0, {
        value: (0, _vue.toRef)(props, 'activePickerIndex')
      });
      // Operation ref
      const operationRef = (0, _vue.ref)(null);
      const mergedDisabled = (0, _vue.computed)(() => {
        const {
          disabled
        } = props;
        if (Array.isArray(disabled)) {
          return disabled;
        }
        return [disabled || false, disabled || false];
      });
      // ============================= Value =============================
      const [mergedValue, setInnerValue] = (0, _useMergedState.default)(null, {
        value: (0, _vue.toRef)(props, 'value'),
        defaultValue: props.defaultValue,
        postState: values => props.picker === 'time' && !props.order ? values : reorderValues(values, props.generateConfig)
      });
      // =========================== View Date ===========================
      // Config view panel
      const [startViewDate, endViewDate, setViewDate] = (0, _useRangeViewDates.default)({
        values: mergedValue,
        picker: (0, _vue.toRef)(props, 'picker'),
        defaultDates: props.defaultPickerValue,
        generateConfig: (0, _vue.toRef)(props, 'generateConfig')
      });
      // ========================= Select Values =========================
      const [selectedValue, setSelectedValue] = (0, _useMergedState.default)(mergedValue.value, {
        postState: values => {
          let postValues = values;
          if (mergedDisabled.value[0] && mergedDisabled.value[1]) {
            return postValues;
          }
          // Fill disabled unit
          for (let i = 0; i < 2; i += 1) {
            if (mergedDisabled.value[i] && !(0, _miscUtil.getValue)(postValues, i) && !(0, _miscUtil.getValue)(props.allowEmpty, i)) {
              postValues = (0, _miscUtil.updateValues)(postValues, props.generateConfig.getNow(), i);
            }
          }
          return postValues;
        }
      });
      // ============================= Modes =============================
      const [mergedModes, setInnerModes] = (0, _useMergedState.default)([props.picker, props.picker], {
        value: (0, _vue.toRef)(props, 'mode')
      });
      (0, _vue.watch)(() => props.picker, () => {
        setInnerModes([props.picker, props.picker]);
      });
      const triggerModesChange = (modes, values) => {
        var _a;
        setInnerModes(modes);
        (_a = props.onPanelChange) === null || _a === void 0 ? void 0 : _a.call(props, values, modes);
      };
      // ========================= Disable Date ==========================
      const [disabledStartDate, disabledEndDate] = (0, _useRangeDisabled.default)({
        picker: (0, _vue.toRef)(props, 'picker'),
        selectedValue,
        locale: (0, _vue.toRef)(props, 'locale'),
        disabled: mergedDisabled,
        disabledDate: (0, _vue.toRef)(props, 'disabledDate'),
        generateConfig: (0, _vue.toRef)(props, 'generateConfig')
      }, openRecordsRef);
      // ============================= Open ==============================
      const [mergedOpen, triggerInnerOpen] = (0, _useMergedState.default)(false, {
        value: (0, _vue.toRef)(props, 'open'),
        defaultValue: props.defaultOpen,
        postState: postOpen => mergedDisabled.value[mergedActivePickerIndex.value] ? false : postOpen,
        onChange: newOpen => {
          var _a;
          (_a = props.onOpenChange) === null || _a === void 0 ? void 0 : _a.call(props, newOpen);
          if (!newOpen && operationRef.value && operationRef.value.onClose) {
            operationRef.value.onClose();
          }
        }
      });
      const startOpen = (0, _vue.computed)(() => mergedOpen.value && mergedActivePickerIndex.value === 0);
      const endOpen = (0, _vue.computed)(() => mergedOpen.value && mergedActivePickerIndex.value === 1);
      const panelLeft = (0, _vue.ref)(0);
      const arrowLeft = (0, _vue.ref)(0);
      // ============================= Popup =============================
      // Popup min width
      const popupMinWidth = (0, _vue.ref)(0);
      const {
        width: containerWidth
      } = (0, _useElementSize.useElementSize)(containerRef);
      (0, _vue.watch)([mergedOpen, containerWidth], () => {
        if (!mergedOpen.value && containerRef.value) {
          popupMinWidth.value = containerWidth.value;
        }
      });
      const {
        width: panelDivWidth
      } = (0, _useElementSize.useElementSize)(panelDivRef);
      const {
        width: arrowWidth
      } = (0, _useElementSize.useElementSize)(arrowRef);
      const {
        width: startInputDivWidth
      } = (0, _useElementSize.useElementSize)(startInputDivRef);
      const {
        width: separatorWidth
      } = (0, _useElementSize.useElementSize)(separatorRef);
      (0, _vue.watch)([mergedActivePickerIndex, mergedOpen, panelDivWidth, arrowWidth, startInputDivWidth, separatorWidth, () => props.direction], () => {
        arrowLeft.value = 0;
        if (mergedActivePickerIndex.value) {
          if (startInputDivRef.value && separatorRef.value) {
            arrowLeft.value = startInputDivWidth.value + separatorWidth.value;
            if (panelDivWidth.value && arrowWidth.value && arrowLeft.value > panelDivWidth.value - arrowWidth.value - (props.direction === 'rtl' || arrowRef.value.offsetLeft > arrowLeft.value ? 0 : arrowRef.value.offsetLeft)) {
              panelLeft.value = arrowLeft.value;
            }
          }
        } else if (mergedActivePickerIndex.value === 0) {
          panelLeft.value = 0;
        }
      }, {
        immediate: true
      });
      // ============================ Trigger ============================
      const triggerRef = (0, _vue.ref)();
      function triggerOpen(newOpen, index) {
        if (newOpen) {
          clearTimeout(triggerRef.value);
          openRecordsRef.value[index] = true;
          setMergedActivePickerIndex(index);
          triggerInnerOpen(newOpen);
          // Open to reset view date
          if (!mergedOpen.value) {
            setViewDate(null, index);
          }
        } else if (mergedActivePickerIndex.value === index) {
          triggerInnerOpen(newOpen);
          // Clean up async
          // This makes ref not quick refresh in case user open another input with blur trigger
          const openRecords = openRecordsRef.value;
          triggerRef.value = setTimeout(() => {
            if (openRecords === openRecordsRef.value) {
              openRecordsRef.value = {};
            }
          });
        }
      }
      function triggerOpenAndFocus(index) {
        triggerOpen(true, index);
        // Use setTimeout to make sure panel DOM exists
        setTimeout(() => {
          const inputRef = [startInputRef, endInputRef][index];
          if (inputRef.value) {
            inputRef.value.focus();
          }
        }, 0);
      }
      function triggerChange(newValue, sourceIndex) {
        let values = newValue;
        let startValue = (0, _miscUtil.getValue)(values, 0);
        let endValue = (0, _miscUtil.getValue)(values, 1);
        const {
          generateConfig,
          locale,
          picker,
          order,
          onCalendarChange,
          allowEmpty,
          onChange,
          showTime
        } = props;
        // >>>>> Format start & end values
        if (startValue && endValue && generateConfig.isAfter(startValue, endValue)) {
          if (
          // WeekPicker only compare week
          picker === 'week' && !(0, _dateUtil.isSameWeek)(generateConfig, locale.locale, startValue, endValue) ||
          // QuotaPicker only compare week
          picker === 'quarter' && !(0, _dateUtil.isSameQuarter)(generateConfig, startValue, endValue) ||
          // Other non-TimePicker compare date
          picker !== 'week' && picker !== 'quarter' && picker !== 'time' && !(showTime ? (0, _dateUtil.isEqual)(generateConfig, startValue, endValue) : (0, _dateUtil.isSameDate)(generateConfig, startValue, endValue))) {
            // Clean up end date when start date is after end date
            if (sourceIndex === 0) {
              values = [startValue, null];
              endValue = null;
            } else {
              startValue = null;
              values = [null, endValue];
            }
            // Clean up cache since invalidate
            openRecordsRef.value = {
              [sourceIndex]: true
            };
          } else if (picker !== 'time' || order !== false) {
            // Reorder when in same date
            values = reorderValues(values, generateConfig);
          }
        }
        setSelectedValue(values);
        const startStr = values && values[0] ? (0, _dateUtil.formatValue)(values[0], {
          generateConfig,
          locale,
          format: formatList.value[0]
        }) : '';
        const endStr = values && values[1] ? (0, _dateUtil.formatValue)(values[1], {
          generateConfig,
          locale,
          format: formatList.value[0]
        }) : '';
        if (onCalendarChange) {
          const info = {
            range: sourceIndex === 0 ? 'start' : 'end'
          };
          onCalendarChange(values, [startStr, endStr], info);
        }
        // >>>>> Trigger `onChange` event
        const canStartValueTrigger = canValueTrigger(startValue, 0, mergedDisabled.value, allowEmpty);
        const canEndValueTrigger = canValueTrigger(endValue, 1, mergedDisabled.value, allowEmpty);
        const canTrigger = values === null || canStartValueTrigger && canEndValueTrigger;
        if (canTrigger) {
          // Trigger onChange only when value is validate
          setInnerValue(values);
          if (onChange && (!(0, _dateUtil.isEqual)(generateConfig, (0, _miscUtil.getValue)(mergedValue.value, 0), startValue) || !(0, _dateUtil.isEqual)(generateConfig, (0, _miscUtil.getValue)(mergedValue.value, 1), endValue))) {
            onChange(values, [startStr, endStr]);
          }
        }
        // >>>>> Open picker when
        // Always open another picker if possible
        let nextOpenIndex = null;
        if (sourceIndex === 0 && !mergedDisabled.value[1]) {
          nextOpenIndex = 1;
        } else if (sourceIndex === 1 && !mergedDisabled.value[0]) {
          nextOpenIndex = 0;
        }
        if (nextOpenIndex !== null && nextOpenIndex !== mergedActivePickerIndex.value && (!openRecordsRef.value[nextOpenIndex] || !(0, _miscUtil.getValue)(values, nextOpenIndex)) && (0, _miscUtil.getValue)(values, sourceIndex)) {
          // Delay to focus to avoid input blur trigger expired selectedValues
          triggerOpenAndFocus(nextOpenIndex);
        } else {
          triggerOpen(false, sourceIndex);
        }
      }
      const forwardKeydown = e => {
        if (mergedOpen && operationRef.value && operationRef.value.onKeydown) {
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
      // ============================= Text ==============================
      const sharedTextHooksProps = {
        formatList,
        generateConfig: (0, _vue.toRef)(props, 'generateConfig'),
        locale: (0, _vue.toRef)(props, 'locale')
      };
      const [startValueTexts, firstStartValueText] = (0, _useValueTexts.default)((0, _vue.computed)(() => (0, _miscUtil.getValue)(selectedValue.value, 0)), sharedTextHooksProps);
      const [endValueTexts, firstEndValueText] = (0, _useValueTexts.default)((0, _vue.computed)(() => (0, _miscUtil.getValue)(selectedValue.value, 1)), sharedTextHooksProps);
      const onTextChange = (newText, index) => {
        const inputDate = (0, _dateUtil.parseValue)(newText, {
          locale: props.locale,
          formatList: formatList.value,
          generateConfig: props.generateConfig
        });
        const disabledFunc = index === 0 ? disabledStartDate : disabledEndDate;
        if (inputDate && !disabledFunc(inputDate)) {
          setSelectedValue((0, _miscUtil.updateValues)(selectedValue.value, inputDate, index));
          setViewDate(inputDate, index);
        }
      };
      const [startText, triggerStartTextChange, resetStartText] = (0, _useTextValueMapping.default)({
        valueTexts: startValueTexts,
        onTextChange: newText => onTextChange(newText, 0)
      });
      const [endText, triggerEndTextChange, resetEndText] = (0, _useTextValueMapping.default)({
        valueTexts: endValueTexts,
        onTextChange: newText => onTextChange(newText, 1)
      });
      const [rangeHoverValue, setRangeHoverValue] = (0, _useState.default)(null);
      // ========================== Hover Range ==========================
      const [hoverRangedValue, setHoverRangedValue] = (0, _useState.default)(null);
      const [startHoverValue, onStartEnter, onStartLeave] = (0, _useHoverValue.default)(startText, sharedTextHooksProps);
      const [endHoverValue, onEndEnter, onEndLeave] = (0, _useHoverValue.default)(endText, sharedTextHooksProps);
      const onDateMouseenter = date => {
        setHoverRangedValue((0, _miscUtil.updateValues)(selectedValue.value, date, mergedActivePickerIndex.value));
        if (mergedActivePickerIndex.value === 0) {
          onStartEnter(date);
        } else {
          onEndEnter(date);
        }
      };
      const onDateMouseleave = () => {
        setHoverRangedValue((0, _miscUtil.updateValues)(selectedValue.value, null, mergedActivePickerIndex.value));
        if (mergedActivePickerIndex.value === 0) {
          onStartLeave();
        } else {
          onEndLeave();
        }
      };
      // ============================= Input =============================
      const getSharedInputHookProps = (index, resetText) => ({
        forwardKeydown,
        onBlur: e => {
          var _a;
          (_a = props.onBlur) === null || _a === void 0 ? void 0 : _a.call(props, e);
        },
        isClickOutside: target => !(0, _uiUtil.elementsContains)([panelDivRef.value, startInputDivRef.value, endInputDivRef.value, containerRef.value], target),
        onFocus: e => {
          var _a;
          setMergedActivePickerIndex(index);
          (_a = props.onFocus) === null || _a === void 0 ? void 0 : _a.call(props, e);
        },
        triggerOpen: newOpen => {
          triggerOpen(newOpen, index);
        },
        onSubmit: () => {
          if (
          // When user typing disabledDate with keyboard and enter, this value will be empty
          !selectedValue.value ||
          // Normal disabled check
          props.disabledDate && props.disabledDate(selectedValue.value[index])) {
            return false;
          }
          triggerChange(selectedValue.value, index);
          resetText();
        },
        onCancel: () => {
          triggerOpen(false, index);
          setSelectedValue(mergedValue.value);
          resetText();
        }
      });
      const [startInputProps, {
        focused: startFocused,
        typing: startTyping
      }] = (0, _usePickerInput.default)((0, _extends2.default)((0, _extends2.default)({}, getSharedInputHookProps(0, resetStartText)), {
        blurToCancel: needConfirmButton,
        open: startOpen,
        value: startText,
        onKeydown: (e, preventDefault) => {
          var _a;
          (_a = props.onKeydown) === null || _a === void 0 ? void 0 : _a.call(props, e, preventDefault);
        }
      }));
      const [endInputProps, {
        focused: endFocused,
        typing: endTyping
      }] = (0, _usePickerInput.default)((0, _extends2.default)((0, _extends2.default)({}, getSharedInputHookProps(1, resetEndText)), {
        blurToCancel: needConfirmButton,
        open: endOpen,
        value: endText,
        onKeydown: (e, preventDefault) => {
          var _a;
          (_a = props.onKeydown) === null || _a === void 0 ? void 0 : _a.call(props, e, preventDefault);
        }
      }));
      // ========================== Click Picker ==========================
      const onPickerClick = e => {
        var _a;
        // When click inside the picker & outside the picker's input elements
        // the panel should still be opened
        (_a = props.onClick) === null || _a === void 0 ? void 0 : _a.call(props, e);
        if (!mergedOpen.value && !startInputRef.value.contains(e.target) && !endInputRef.value.contains(e.target)) {
          if (!mergedDisabled.value[0]) {
            triggerOpenAndFocus(0);
          } else if (!mergedDisabled.value[1]) {
            triggerOpenAndFocus(1);
          }
        }
      };
      const onPickerMousedown = e => {
        var _a;
        // shouldn't affect input elements if picker is active
        (_a = props.onMousedown) === null || _a === void 0 ? void 0 : _a.call(props, e);
        if (mergedOpen.value && (startFocused.value || endFocused.value) && !startInputRef.value.contains(e.target) && !endInputRef.value.contains(e.target)) {
          e.preventDefault();
        }
      };
      // ============================= Sync ==============================
      // Close should sync back with text value
      const startStr = (0, _vue.computed)(() => {
        var _a;
        return ((_a = mergedValue.value) === null || _a === void 0 ? void 0 : _a[0]) ? (0, _dateUtil.formatValue)(mergedValue.value[0], {
          locale: props.locale,
          format: 'YYYYMMDDHHmmss',
          generateConfig: props.generateConfig
        }) : '';
      });
      const endStr = (0, _vue.computed)(() => {
        var _a;
        return ((_a = mergedValue.value) === null || _a === void 0 ? void 0 : _a[1]) ? (0, _dateUtil.formatValue)(mergedValue.value[1], {
          locale: props.locale,
          format: 'YYYYMMDDHHmmss',
          generateConfig: props.generateConfig
        }) : '';
      });
      (0, _vue.watch)([mergedOpen, startValueTexts, endValueTexts], () => {
        if (!mergedOpen.value) {
          setSelectedValue(mergedValue.value);
          if (!startValueTexts.value.length || startValueTexts.value[0] === '') {
            triggerStartTextChange('');
          } else if (firstStartValueText.value !== startText.value) {
            resetStartText();
          }
          if (!endValueTexts.value.length || endValueTexts.value[0] === '') {
            triggerEndTextChange('');
          } else if (firstEndValueText.value !== endText.value) {
            resetEndText();
          }
        }
      });
      // Sync innerValue with control mode
      (0, _vue.watch)([startStr, endStr], () => {
        setSelectedValue(mergedValue.value);
      });
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        (0, _vue.watchEffect)(() => {
          const {
            value,
            disabled
          } = props;
          if (value && Array.isArray(disabled) && ((0, _miscUtil.getValue)(disabled, 0) && !(0, _miscUtil.getValue)(value, 0) || (0, _miscUtil.getValue)(disabled, 1) && !(0, _miscUtil.getValue)(value, 1))) {
            (0, _warning.warning)(false, '`disabled` should not set with empty `value`. You should set `allowEmpty` or `value` instead.');
          }
        });
      }
      expose({
        focus: () => {
          if (startInputRef.value) {
            startInputRef.value.focus();
          }
        },
        blur: () => {
          if (startInputRef.value) {
            startInputRef.value.blur();
          }
          if (endInputRef.value) {
            endInputRef.value.blur();
          }
        }
      });
      // ============================= Panel =============================
      const panelHoverRangedValue = (0, _vue.computed)(() => {
        if (mergedOpen.value && hoverRangedValue.value && hoverRangedValue.value[0] && hoverRangedValue.value[1] && props.generateConfig.isAfter(hoverRangedValue.value[1], hoverRangedValue.value[0])) {
          return hoverRangedValue.value;
        } else {
          return null;
        }
      });
      function renderPanel() {
        let panelPosition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        let panelProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        const {
          generateConfig,
          showTime,
          dateRender,
          direction,
          disabledTime,
          prefixCls,
          locale
        } = props;
        let panelShowTime = showTime;
        if (showTime && typeof showTime === 'object' && showTime.defaultValue) {
          const timeDefaultValues = showTime.defaultValue;
          panelShowTime = (0, _extends2.default)((0, _extends2.default)({}, showTime), {
            defaultValue: (0, _miscUtil.getValue)(timeDefaultValues, mergedActivePickerIndex.value) || undefined
          });
        }
        let panelDateRender = null;
        if (dateRender) {
          panelDateRender = _ref2 => {
            let {
              current: date,
              today
            } = _ref2;
            return dateRender({
              current: date,
              today,
              info: {
                range: mergedActivePickerIndex.value ? 'end' : 'start'
              }
            });
          };
        }
        return (0, _vue.createVNode)(_RangeContext.RangeContextProvider, {
          "value": {
            inRange: true,
            panelPosition,
            rangedValue: rangeHoverValue.value || selectedValue.value,
            hoverRangedValue: panelHoverRangedValue.value
          }
        }, {
          default: () => [(0, _vue.createVNode)(_PickerPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), panelProps), {}, {
            "dateRender": panelDateRender,
            "showTime": panelShowTime,
            "mode": mergedModes.value[mergedActivePickerIndex.value],
            "generateConfig": generateConfig,
            "style": undefined,
            "direction": direction,
            "disabledDate": mergedActivePickerIndex.value === 0 ? disabledStartDate : disabledEndDate,
            "disabledTime": date => {
              if (disabledTime) {
                return disabledTime(date, mergedActivePickerIndex.value === 0 ? 'start' : 'end');
              }
              return false;
            },
            "class": (0, _classNames.default)({
              [`${prefixCls}-panel-focused`]: mergedActivePickerIndex.value === 0 ? !startTyping.value : !endTyping.value
            }),
            "value": (0, _miscUtil.getValue)(selectedValue.value, mergedActivePickerIndex.value),
            "locale": locale,
            "tabIndex": -1,
            "onPanelChange": (date, newMode) => {
              // clear hover value when panel change
              if (mergedActivePickerIndex.value === 0) {
                onStartLeave(true);
              }
              if (mergedActivePickerIndex.value === 1) {
                onEndLeave(true);
              }
              triggerModesChange((0, _miscUtil.updateValues)(mergedModes.value, newMode, mergedActivePickerIndex.value), (0, _miscUtil.updateValues)(selectedValue.value, date, mergedActivePickerIndex.value));
              let viewDate = date;
              if (panelPosition === 'right' && mergedModes.value[mergedActivePickerIndex.value] === newMode) {
                viewDate = (0, _dateUtil.getClosingViewDate)(viewDate, newMode, generateConfig, -1);
              }
              setViewDate(viewDate, mergedActivePickerIndex.value);
            },
            "onOk": null,
            "onSelect": undefined,
            "onChange": undefined,
            "defaultValue": mergedActivePickerIndex.value === 0 ? (0, _miscUtil.getValue)(selectedValue.value, 1) : (0, _miscUtil.getValue)(selectedValue.value, 0)
          }), null)]
        });
      }
      const onContextSelect = (date, type) => {
        const values = (0, _miscUtil.updateValues)(selectedValue.value, date, mergedActivePickerIndex.value);
        if (type === 'submit' || type !== 'key' && !needConfirmButton.value) {
          // triggerChange will also update selected values
          triggerChange(values, mergedActivePickerIndex.value);
          // clear hover value style
          if (mergedActivePickerIndex.value === 0) {
            onStartLeave();
          } else {
            onEndLeave();
          }
        } else {
          setSelectedValue(values);
        }
      };
      (0, _PanelContext.useProvidePanel)({
        operationRef,
        hideHeader: (0, _vue.computed)(() => props.picker === 'time'),
        onDateMouseenter,
        onDateMouseleave,
        hideRanges: (0, _vue.computed)(() => true),
        onSelect: onContextSelect,
        open: mergedOpen
      });
      return () => {
        const {
          prefixCls = 'rc-picker',
          id,
          popupStyle,
          dropdownClassName,
          transitionName,
          dropdownAlign,
          getPopupContainer,
          generateConfig,
          locale,
          placeholder,
          autofocus,
          picker = 'date',
          showTime,
          separator = '~',
          disabledDate,
          panelRender,
          allowClear,
          suffixIcon,
          clearIcon,
          inputReadOnly,
          renderExtraFooter,
          onMouseenter,
          onMouseleave,
          onMouseup,
          onOk,
          components,
          direction,
          autocomplete = 'off'
        } = props;
        const arrowPositionStyle = direction === 'rtl' ? {
          right: `${arrowLeft.value}px`
        } : {
          left: `${arrowLeft.value}px`
        };
        function renderPanels() {
          let panels;
          const extraNode = (0, _getExtraFooter.default)(prefixCls, mergedModes.value[mergedActivePickerIndex.value], renderExtraFooter);
          const rangesNode = (0, _getRanges.default)({
            prefixCls,
            components,
            needConfirmButton: needConfirmButton.value,
            okDisabled: !(0, _miscUtil.getValue)(selectedValue.value, mergedActivePickerIndex.value) || disabledDate && disabledDate(selectedValue.value[mergedActivePickerIndex.value]),
            locale,
            onOk: () => {
              if ((0, _miscUtil.getValue)(selectedValue.value, mergedActivePickerIndex.value)) {
                // triggerChangeOld(selectedValue.value);
                triggerChange(selectedValue.value, mergedActivePickerIndex.value);
                if (onOk) {
                  onOk(selectedValue.value);
                }
              }
            }
          });
          if (picker !== 'time' && !showTime) {
            const viewDate = mergedActivePickerIndex.value === 0 ? startViewDate.value : endViewDate.value;
            const nextViewDate = (0, _dateUtil.getClosingViewDate)(viewDate, picker, generateConfig);
            const currentMode = mergedModes.value[mergedActivePickerIndex.value];
            const showDoublePanel = currentMode === picker;
            const leftPanel = renderPanel(showDoublePanel ? 'left' : false, {
              pickerValue: viewDate,
              onPickerValueChange: newViewDate => {
                setViewDate(newViewDate, mergedActivePickerIndex.value);
              }
            });
            const rightPanel = renderPanel('right', {
              pickerValue: nextViewDate,
              onPickerValueChange: newViewDate => {
                setViewDate((0, _dateUtil.getClosingViewDate)(newViewDate, picker, generateConfig, -1), mergedActivePickerIndex.value);
              }
            });
            if (direction === 'rtl') {
              panels = (0, _vue.createVNode)(_vue.Fragment, null, [rightPanel, showDoublePanel && leftPanel]);
            } else {
              panels = (0, _vue.createVNode)(_vue.Fragment, null, [leftPanel, showDoublePanel && rightPanel]);
            }
          } else {
            panels = renderPanel();
          }
          let mergedNodes = (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-panel-layout`
          }, [(0, _vue.createVNode)(_PresetPanel.default, {
            "prefixCls": prefixCls,
            "presets": presetList.value,
            "onClick": nextValue => {
              triggerChange(nextValue, null);
              triggerOpen(false, mergedActivePickerIndex.value);
            },
            "onHover": hoverValue => {
              setRangeHoverValue(hoverValue);
            }
          }, null), (0, _vue.createVNode)("div", null, [(0, _vue.createVNode)("div", {
            "class": `${prefixCls}-panels`
          }, [panels]), (extraNode || rangesNode) && (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-footer`
          }, [extraNode, rangesNode])])]);
          if (panelRender) {
            mergedNodes = panelRender(mergedNodes);
          }
          return (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-panel-container`,
            "style": {
              marginLeft: `${panelLeft.value}px`
            },
            "ref": panelDivRef,
            "onMousedown": e => {
              e.preventDefault();
            }
          }, [mergedNodes]);
        }
        const rangePanel = (0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${prefixCls}-range-wrapper`, `${prefixCls}-${picker}-range-wrapper`),
          "style": {
            minWidth: `${popupMinWidth.value}px`
          }
        }, [(0, _vue.createVNode)("div", {
          "ref": arrowRef,
          "class": `${prefixCls}-range-arrow`,
          "style": arrowPositionStyle
        }, null), renderPanels()]);
        // ============================= Icons =============================
        let suffixNode;
        if (suffixIcon) {
          suffixNode = (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-suffix`
          }, [suffixIcon]);
        }
        let clearNode;
        if (allowClear && ((0, _miscUtil.getValue)(mergedValue.value, 0) && !mergedDisabled.value[0] || (0, _miscUtil.getValue)(mergedValue.value, 1) && !mergedDisabled.value[1])) {
          clearNode = (0, _vue.createVNode)("span", {
            "onMousedown": e => {
              e.preventDefault();
              e.stopPropagation();
            },
            "onMouseup": e => {
              e.preventDefault();
              e.stopPropagation();
              let values = mergedValue.value;
              if (!mergedDisabled.value[0]) {
                values = (0, _miscUtil.updateValues)(values, null, 0);
              }
              if (!mergedDisabled.value[1]) {
                values = (0, _miscUtil.updateValues)(values, null, 1);
              }
              triggerChange(values, null);
              triggerOpen(false, mergedActivePickerIndex.value);
            },
            "class": `${prefixCls}-clear`
          }, [clearIcon || (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-clear-btn`
          }, null)]);
        }
        const inputSharedProps = {
          size: (0, _uiUtil.getInputSize)(picker, formatList.value[0], generateConfig)
        };
        let activeBarLeft = 0;
        let activeBarWidth = 0;
        if (startInputDivRef.value && endInputDivRef.value && separatorRef.value) {
          if (mergedActivePickerIndex.value === 0) {
            activeBarWidth = startInputDivRef.value.offsetWidth;
          } else {
            activeBarLeft = arrowLeft.value;
            activeBarWidth = endInputDivRef.value.offsetWidth;
          }
        }
        const activeBarPositionStyle = direction === 'rtl' ? {
          right: `${activeBarLeft}px`
        } : {
          left: `${activeBarLeft}px`
        };
        // ============================ Return =============================
        return (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
          "ref": containerRef,
          "class": (0, _classNames.default)(prefixCls, `${prefixCls}-range`, attrs.class, {
            [`${prefixCls}-disabled`]: mergedDisabled.value[0] && mergedDisabled.value[1],
            [`${prefixCls}-focused`]: mergedActivePickerIndex.value === 0 ? startFocused.value : endFocused.value,
            [`${prefixCls}-rtl`]: direction === 'rtl'
          }),
          "style": attrs.style,
          "onClick": onPickerClick,
          "onMouseenter": onMouseenter,
          "onMouseleave": onMouseleave,
          "onMousedown": onPickerMousedown,
          "onMouseup": onMouseup
        }, (0, _miscUtil.default)(props)), [(0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${prefixCls}-input`, {
            [`${prefixCls}-input-active`]: mergedActivePickerIndex.value === 0,
            [`${prefixCls}-input-placeholder`]: !!startHoverValue.value
          }),
          "ref": startInputDivRef
        }, [(0, _vue.createVNode)("input", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
          "id": id,
          "disabled": mergedDisabled.value[0],
          "readonly": inputReadOnly || typeof formatList.value[0] === 'function' || !startTyping.value,
          "value": startHoverValue.value || startText.value,
          "onInput": e => {
            triggerStartTextChange(e.target.value);
          },
          "autofocus": autofocus,
          "placeholder": (0, _miscUtil.getValue)(placeholder, 0) || '',
          "ref": startInputRef
        }, startInputProps.value), inputSharedProps), {}, {
          "autocomplete": autocomplete
        }), null)]), (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-range-separator`,
          "ref": separatorRef
        }, [separator]), (0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${prefixCls}-input`, {
            [`${prefixCls}-input-active`]: mergedActivePickerIndex.value === 1,
            [`${prefixCls}-input-placeholder`]: !!endHoverValue.value
          }),
          "ref": endInputDivRef
        }, [(0, _vue.createVNode)("input", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
          "disabled": mergedDisabled.value[1],
          "readonly": inputReadOnly || typeof formatList.value[0] === 'function' || !endTyping.value,
          "value": endHoverValue.value || endText.value,
          "onInput": e => {
            triggerEndTextChange(e.target.value);
          },
          "placeholder": (0, _miscUtil.getValue)(placeholder, 1) || '',
          "ref": endInputRef
        }, endInputProps.value), inputSharedProps), {}, {
          "autocomplete": autocomplete
        }), null)]), (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-active-bar`,
          "style": (0, _extends2.default)((0, _extends2.default)({}, activeBarPositionStyle), {
            width: `${activeBarWidth}px`,
            position: 'absolute'
          })
        }, null), suffixNode, clearNode, (0, _vue.createVNode)(_PickerTrigger.default, {
          "visible": mergedOpen.value,
          "popupStyle": popupStyle,
          "prefixCls": prefixCls,
          "dropdownClassName": dropdownClassName,
          "dropdownAlign": dropdownAlign,
          "getPopupContainer": getPopupContainer,
          "transitionName": transitionName,
          "range": true,
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
          popupElement: () => rangePanel
        })]);
      };
    }
  });
}
const InterRangerPicker = RangerPicker();
var _default = exports.default = InterRangerPicker;