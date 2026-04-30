import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import PickerTrigger from './PickerTrigger';
import PickerPanel from './PickerPanel';
import usePickerInput from './hooks/usePickerInput';
import PresetPanel from './PresetPanel';
import getDataOrAriaProps, { toArray, getValue, updateValues } from './utils/miscUtil';
import { getDefaultFormat, getInputSize, elementsContains } from './utils/uiUtil';
import { useProvidePanel } from './PanelContext';
import { isEqual, getClosingViewDate, isSameDate, isSameWeek, isSameQuarter, formatValue, parseValue } from './utils/dateUtil';
import useValueTexts from './hooks/useValueTexts';
import useTextValueMapping from './hooks/useTextValueMapping';
import usePresets from './hooks/usePresets';
import { RangeContextProvider } from './RangeContext';
import useRangeDisabled from './hooks/useRangeDisabled';
import getExtraFooter from './utils/getExtraFooter';
import getRanges from './utils/getRanges';
import useRangeViewDates from './hooks/useRangeViewDates';
import useHoverValue from './hooks/useHoverValue';
import { computed, defineComponent, ref, toRef, watch, watchEffect } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { warning } from '../vc-util/warning';
import useState from '../_util/hooks/useState';
import classNames from '../_util/classNames';
import { legacyPropsWarning } from './utils/warnUtil';
import { useElementSize } from '../_util/hooks/_vueuse/useElementSize';
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
  return defineComponent({
    name: 'RangerPicker',
    inheritAttrs: false,
    props: ['prefixCls', 'id', 'popupStyle', 'dropdownClassName', 'transitionName', 'dropdownAlign', 'getPopupContainer', 'generateConfig', 'locale', 'placeholder', 'autofocus', 'disabled', 'format', 'picker', 'showTime', 'showNow', 'showHour', 'showMinute', 'showSecond', 'use12Hours', 'separator', 'value', 'defaultValue', 'defaultPickerValue', 'open', 'defaultOpen', 'disabledDate', 'disabledTime', 'dateRender', 'panelRender', 'ranges', 'allowEmpty', 'allowClear', 'suffixIcon', 'clearIcon', 'pickerRef', 'inputReadOnly', 'mode', 'renderExtraFooter', 'onChange', 'onOpenChange', 'onPanelChange', 'onCalendarChange', 'onFocus', 'onBlur', 'onMousedown', 'onMouseup', 'onMouseenter', 'onMouseleave', 'onClick', 'onOk', 'onKeydown', 'components', 'order', 'direction', 'activePickerIndex', 'autocomplete', 'minuteStep', 'hourStep', 'secondStep', 'hideDisabledOptions', 'disabledMinutes', 'presets', 'prevIcon', 'nextIcon', 'superPrevIcon', 'superNextIcon'],
    setup(props, _ref) {
      let {
        attrs,
        expose
      } = _ref;
      const needConfirmButton = computed(() => props.picker === 'date' && !!props.showTime || props.picker === 'time');
      const presets = computed(() => props.presets);
      const ranges = computed(() => props.ranges);
      const presetList = usePresets(presets, ranges);
      // We record oqqpened status here in case repeat open with picker
      const openRecordsRef = ref({});
      const containerRef = ref(null);
      const panelDivRef = ref(null);
      const startInputDivRef = ref(null);
      const endInputDivRef = ref(null);
      const separatorRef = ref(null);
      const startInputRef = ref(null);
      const endInputRef = ref(null);
      const arrowRef = ref(null);
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        legacyPropsWarning(props);
      }
      // ============================= Misc ==============================
      const formatList = computed(() => toArray(getDefaultFormat(props.format, props.picker, props.showTime, props.use12Hours)));
      // Active picker
      const [mergedActivePickerIndex, setMergedActivePickerIndex] = useMergedState(0, {
        value: toRef(props, 'activePickerIndex')
      });
      // Operation ref
      const operationRef = ref(null);
      const mergedDisabled = computed(() => {
        const {
          disabled
        } = props;
        if (Array.isArray(disabled)) {
          return disabled;
        }
        return [disabled || false, disabled || false];
      });
      // ============================= Value =============================
      const [mergedValue, setInnerValue] = useMergedState(null, {
        value: toRef(props, 'value'),
        defaultValue: props.defaultValue,
        postState: values => props.picker === 'time' && !props.order ? values : reorderValues(values, props.generateConfig)
      });
      // =========================== View Date ===========================
      // Config view panel
      const [startViewDate, endViewDate, setViewDate] = useRangeViewDates({
        values: mergedValue,
        picker: toRef(props, 'picker'),
        defaultDates: props.defaultPickerValue,
        generateConfig: toRef(props, 'generateConfig')
      });
      // ========================= Select Values =========================
      const [selectedValue, setSelectedValue] = useMergedState(mergedValue.value, {
        postState: values => {
          let postValues = values;
          if (mergedDisabled.value[0] && mergedDisabled.value[1]) {
            return postValues;
          }
          // Fill disabled unit
          for (let i = 0; i < 2; i += 1) {
            if (mergedDisabled.value[i] && !getValue(postValues, i) && !getValue(props.allowEmpty, i)) {
              postValues = updateValues(postValues, props.generateConfig.getNow(), i);
            }
          }
          return postValues;
        }
      });
      // ============================= Modes =============================
      const [mergedModes, setInnerModes] = useMergedState([props.picker, props.picker], {
        value: toRef(props, 'mode')
      });
      watch(() => props.picker, () => {
        setInnerModes([props.picker, props.picker]);
      });
      const triggerModesChange = (modes, values) => {
        var _a;
        setInnerModes(modes);
        (_a = props.onPanelChange) === null || _a === void 0 ? void 0 : _a.call(props, values, modes);
      };
      // ========================= Disable Date ==========================
      const [disabledStartDate, disabledEndDate] = useRangeDisabled({
        picker: toRef(props, 'picker'),
        selectedValue,
        locale: toRef(props, 'locale'),
        disabled: mergedDisabled,
        disabledDate: toRef(props, 'disabledDate'),
        generateConfig: toRef(props, 'generateConfig')
      }, openRecordsRef);
      // ============================= Open ==============================
      const [mergedOpen, triggerInnerOpen] = useMergedState(false, {
        value: toRef(props, 'open'),
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
      const startOpen = computed(() => mergedOpen.value && mergedActivePickerIndex.value === 0);
      const endOpen = computed(() => mergedOpen.value && mergedActivePickerIndex.value === 1);
      const panelLeft = ref(0);
      const arrowLeft = ref(0);
      // ============================= Popup =============================
      // Popup min width
      const popupMinWidth = ref(0);
      const {
        width: containerWidth
      } = useElementSize(containerRef);
      watch([mergedOpen, containerWidth], () => {
        if (!mergedOpen.value && containerRef.value) {
          popupMinWidth.value = containerWidth.value;
        }
      });
      const {
        width: panelDivWidth
      } = useElementSize(panelDivRef);
      const {
        width: arrowWidth
      } = useElementSize(arrowRef);
      const {
        width: startInputDivWidth
      } = useElementSize(startInputDivRef);
      const {
        width: separatorWidth
      } = useElementSize(separatorRef);
      watch([mergedActivePickerIndex, mergedOpen, panelDivWidth, arrowWidth, startInputDivWidth, separatorWidth, () => props.direction], () => {
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
      const triggerRef = ref();
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
        let startValue = getValue(values, 0);
        let endValue = getValue(values, 1);
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
          picker === 'week' && !isSameWeek(generateConfig, locale.locale, startValue, endValue) ||
          // QuotaPicker only compare week
          picker === 'quarter' && !isSameQuarter(generateConfig, startValue, endValue) ||
          // Other non-TimePicker compare date
          picker !== 'week' && picker !== 'quarter' && picker !== 'time' && !(showTime ? isEqual(generateConfig, startValue, endValue) : isSameDate(generateConfig, startValue, endValue))) {
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
        const startStr = values && values[0] ? formatValue(values[0], {
          generateConfig,
          locale,
          format: formatList.value[0]
        }) : '';
        const endStr = values && values[1] ? formatValue(values[1], {
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
          if (onChange && (!isEqual(generateConfig, getValue(mergedValue.value, 0), startValue) || !isEqual(generateConfig, getValue(mergedValue.value, 1), endValue))) {
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
        if (nextOpenIndex !== null && nextOpenIndex !== mergedActivePickerIndex.value && (!openRecordsRef.value[nextOpenIndex] || !getValue(values, nextOpenIndex)) && getValue(values, sourceIndex)) {
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
          warning(false, 'Picker not correct forward Keydown operation. Please help to fire issue about this.');
          return false;
        }
      };
      // ============================= Text ==============================
      const sharedTextHooksProps = {
        formatList,
        generateConfig: toRef(props, 'generateConfig'),
        locale: toRef(props, 'locale')
      };
      const [startValueTexts, firstStartValueText] = useValueTexts(computed(() => getValue(selectedValue.value, 0)), sharedTextHooksProps);
      const [endValueTexts, firstEndValueText] = useValueTexts(computed(() => getValue(selectedValue.value, 1)), sharedTextHooksProps);
      const onTextChange = (newText, index) => {
        const inputDate = parseValue(newText, {
          locale: props.locale,
          formatList: formatList.value,
          generateConfig: props.generateConfig
        });
        const disabledFunc = index === 0 ? disabledStartDate : disabledEndDate;
        if (inputDate && !disabledFunc(inputDate)) {
          setSelectedValue(updateValues(selectedValue.value, inputDate, index));
          setViewDate(inputDate, index);
        }
      };
      const [startText, triggerStartTextChange, resetStartText] = useTextValueMapping({
        valueTexts: startValueTexts,
        onTextChange: newText => onTextChange(newText, 0)
      });
      const [endText, triggerEndTextChange, resetEndText] = useTextValueMapping({
        valueTexts: endValueTexts,
        onTextChange: newText => onTextChange(newText, 1)
      });
      const [rangeHoverValue, setRangeHoverValue] = useState(null);
      // ========================== Hover Range ==========================
      const [hoverRangedValue, setHoverRangedValue] = useState(null);
      const [startHoverValue, onStartEnter, onStartLeave] = useHoverValue(startText, sharedTextHooksProps);
      const [endHoverValue, onEndEnter, onEndLeave] = useHoverValue(endText, sharedTextHooksProps);
      const onDateMouseenter = date => {
        setHoverRangedValue(updateValues(selectedValue.value, date, mergedActivePickerIndex.value));
        if (mergedActivePickerIndex.value === 0) {
          onStartEnter(date);
        } else {
          onEndEnter(date);
        }
      };
      const onDateMouseleave = () => {
        setHoverRangedValue(updateValues(selectedValue.value, null, mergedActivePickerIndex.value));
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
        isClickOutside: target => !elementsContains([panelDivRef.value, startInputDivRef.value, endInputDivRef.value, containerRef.value], target),
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
      }] = usePickerInput(_extends(_extends({}, getSharedInputHookProps(0, resetStartText)), {
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
      }] = usePickerInput(_extends(_extends({}, getSharedInputHookProps(1, resetEndText)), {
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
      const startStr = computed(() => {
        var _a;
        return ((_a = mergedValue.value) === null || _a === void 0 ? void 0 : _a[0]) ? formatValue(mergedValue.value[0], {
          locale: props.locale,
          format: 'YYYYMMDDHHmmss',
          generateConfig: props.generateConfig
        }) : '';
      });
      const endStr = computed(() => {
        var _a;
        return ((_a = mergedValue.value) === null || _a === void 0 ? void 0 : _a[1]) ? formatValue(mergedValue.value[1], {
          locale: props.locale,
          format: 'YYYYMMDDHHmmss',
          generateConfig: props.generateConfig
        }) : '';
      });
      watch([mergedOpen, startValueTexts, endValueTexts], () => {
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
      watch([startStr, endStr], () => {
        setSelectedValue(mergedValue.value);
      });
      // ============================ Warning ============================
      if (process.env.NODE_ENV !== 'production') {
        watchEffect(() => {
          const {
            value,
            disabled
          } = props;
          if (value && Array.isArray(disabled) && (getValue(disabled, 0) && !getValue(value, 0) || getValue(disabled, 1) && !getValue(value, 1))) {
            warning(false, '`disabled` should not set with empty `value`. You should set `allowEmpty` or `value` instead.');
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
      const panelHoverRangedValue = computed(() => {
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
          panelShowTime = _extends(_extends({}, showTime), {
            defaultValue: getValue(timeDefaultValues, mergedActivePickerIndex.value) || undefined
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
        return _createVNode(RangeContextProvider, {
          "value": {
            inRange: true,
            panelPosition,
            rangedValue: rangeHoverValue.value || selectedValue.value,
            hoverRangedValue: panelHoverRangedValue.value
          }
        }, {
          default: () => [_createVNode(PickerPanel, _objectSpread(_objectSpread(_objectSpread({}, props), panelProps), {}, {
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
            "class": classNames({
              [`${prefixCls}-panel-focused`]: mergedActivePickerIndex.value === 0 ? !startTyping.value : !endTyping.value
            }),
            "value": getValue(selectedValue.value, mergedActivePickerIndex.value),
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
              triggerModesChange(updateValues(mergedModes.value, newMode, mergedActivePickerIndex.value), updateValues(selectedValue.value, date, mergedActivePickerIndex.value));
              let viewDate = date;
              if (panelPosition === 'right' && mergedModes.value[mergedActivePickerIndex.value] === newMode) {
                viewDate = getClosingViewDate(viewDate, newMode, generateConfig, -1);
              }
              setViewDate(viewDate, mergedActivePickerIndex.value);
            },
            "onOk": null,
            "onSelect": undefined,
            "onChange": undefined,
            "defaultValue": mergedActivePickerIndex.value === 0 ? getValue(selectedValue.value, 1) : getValue(selectedValue.value, 0)
          }), null)]
        });
      }
      const onContextSelect = (date, type) => {
        const values = updateValues(selectedValue.value, date, mergedActivePickerIndex.value);
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
      useProvidePanel({
        operationRef,
        hideHeader: computed(() => props.picker === 'time'),
        onDateMouseenter,
        onDateMouseleave,
        hideRanges: computed(() => true),
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
          const extraNode = getExtraFooter(prefixCls, mergedModes.value[mergedActivePickerIndex.value], renderExtraFooter);
          const rangesNode = getRanges({
            prefixCls,
            components,
            needConfirmButton: needConfirmButton.value,
            okDisabled: !getValue(selectedValue.value, mergedActivePickerIndex.value) || disabledDate && disabledDate(selectedValue.value[mergedActivePickerIndex.value]),
            locale,
            onOk: () => {
              if (getValue(selectedValue.value, mergedActivePickerIndex.value)) {
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
            const nextViewDate = getClosingViewDate(viewDate, picker, generateConfig);
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
                setViewDate(getClosingViewDate(newViewDate, picker, generateConfig, -1), mergedActivePickerIndex.value);
              }
            });
            if (direction === 'rtl') {
              panels = _createVNode(_Fragment, null, [rightPanel, showDoublePanel && leftPanel]);
            } else {
              panels = _createVNode(_Fragment, null, [leftPanel, showDoublePanel && rightPanel]);
            }
          } else {
            panels = renderPanel();
          }
          let mergedNodes = _createVNode("div", {
            "class": `${prefixCls}-panel-layout`
          }, [_createVNode(PresetPanel, {
            "prefixCls": prefixCls,
            "presets": presetList.value,
            "onClick": nextValue => {
              triggerChange(nextValue, null);
              triggerOpen(false, mergedActivePickerIndex.value);
            },
            "onHover": hoverValue => {
              setRangeHoverValue(hoverValue);
            }
          }, null), _createVNode("div", null, [_createVNode("div", {
            "class": `${prefixCls}-panels`
          }, [panels]), (extraNode || rangesNode) && _createVNode("div", {
            "class": `${prefixCls}-footer`
          }, [extraNode, rangesNode])])]);
          if (panelRender) {
            mergedNodes = panelRender(mergedNodes);
          }
          return _createVNode("div", {
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
        const rangePanel = _createVNode("div", {
          "class": classNames(`${prefixCls}-range-wrapper`, `${prefixCls}-${picker}-range-wrapper`),
          "style": {
            minWidth: `${popupMinWidth.value}px`
          }
        }, [_createVNode("div", {
          "ref": arrowRef,
          "class": `${prefixCls}-range-arrow`,
          "style": arrowPositionStyle
        }, null), renderPanels()]);
        // ============================= Icons =============================
        let suffixNode;
        if (suffixIcon) {
          suffixNode = _createVNode("span", {
            "class": `${prefixCls}-suffix`
          }, [suffixIcon]);
        }
        let clearNode;
        if (allowClear && (getValue(mergedValue.value, 0) && !mergedDisabled.value[0] || getValue(mergedValue.value, 1) && !mergedDisabled.value[1])) {
          clearNode = _createVNode("span", {
            "onMousedown": e => {
              e.preventDefault();
              e.stopPropagation();
            },
            "onMouseup": e => {
              e.preventDefault();
              e.stopPropagation();
              let values = mergedValue.value;
              if (!mergedDisabled.value[0]) {
                values = updateValues(values, null, 0);
              }
              if (!mergedDisabled.value[1]) {
                values = updateValues(values, null, 1);
              }
              triggerChange(values, null);
              triggerOpen(false, mergedActivePickerIndex.value);
            },
            "class": `${prefixCls}-clear`
          }, [clearIcon || _createVNode("span", {
            "class": `${prefixCls}-clear-btn`
          }, null)]);
        }
        const inputSharedProps = {
          size: getInputSize(picker, formatList.value[0], generateConfig)
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
        return _createVNode("div", _objectSpread({
          "ref": containerRef,
          "class": classNames(prefixCls, `${prefixCls}-range`, attrs.class, {
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
        }, getDataOrAriaProps(props)), [_createVNode("div", {
          "class": classNames(`${prefixCls}-input`, {
            [`${prefixCls}-input-active`]: mergedActivePickerIndex.value === 0,
            [`${prefixCls}-input-placeholder`]: !!startHoverValue.value
          }),
          "ref": startInputDivRef
        }, [_createVNode("input", _objectSpread(_objectSpread(_objectSpread({
          "id": id,
          "disabled": mergedDisabled.value[0],
          "readonly": inputReadOnly || typeof formatList.value[0] === 'function' || !startTyping.value,
          "value": startHoverValue.value || startText.value,
          "onInput": e => {
            triggerStartTextChange(e.target.value);
          },
          "autofocus": autofocus,
          "placeholder": getValue(placeholder, 0) || '',
          "ref": startInputRef
        }, startInputProps.value), inputSharedProps), {}, {
          "autocomplete": autocomplete
        }), null)]), _createVNode("div", {
          "class": `${prefixCls}-range-separator`,
          "ref": separatorRef
        }, [separator]), _createVNode("div", {
          "class": classNames(`${prefixCls}-input`, {
            [`${prefixCls}-input-active`]: mergedActivePickerIndex.value === 1,
            [`${prefixCls}-input-placeholder`]: !!endHoverValue.value
          }),
          "ref": endInputDivRef
        }, [_createVNode("input", _objectSpread(_objectSpread(_objectSpread({
          "disabled": mergedDisabled.value[1],
          "readonly": inputReadOnly || typeof formatList.value[0] === 'function' || !endTyping.value,
          "value": endHoverValue.value || endText.value,
          "onInput": e => {
            triggerEndTextChange(e.target.value);
          },
          "placeholder": getValue(placeholder, 1) || '',
          "ref": endInputRef
        }, endInputProps.value), inputSharedProps), {}, {
          "autocomplete": autocomplete
        }), null)]), _createVNode("div", {
          "class": `${prefixCls}-active-bar`,
          "style": _extends(_extends({}, activeBarPositionStyle), {
            width: `${activeBarWidth}px`,
            position: 'absolute'
          })
        }, null), suffixNode, clearNode, _createVNode(PickerTrigger, {
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
          default: () => [_createVNode("div", {
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
export default InterRangerPicker;