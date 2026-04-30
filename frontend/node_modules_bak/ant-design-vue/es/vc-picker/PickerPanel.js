import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import TimePanel from './panels/TimePanel';
import DatetimePanel from './panels/DatetimePanel';
import DatePanel from './panels/DatePanel';
import WeekPanel from './panels/WeekPanel';
import MonthPanel from './panels/MonthPanel';
import QuarterPanel from './panels/QuarterPanel';
import YearPanel from './panels/YearPanel';
import DecadePanel from './panels/DecadePanel';
import { isEqual } from './utils/dateUtil';
import { useInjectPanel, useProvidePanel } from './PanelContext';
import { PickerModeMap } from './utils/uiUtil';
import { useInjectRange } from './RangeContext';
import getExtraFooter from './utils/getExtraFooter';
import getRanges from './utils/getRanges';
import { getLowerBoundTime, setDateTime, setTime } from './utils/timeUtil';
import { computed, createVNode, defineComponent, ref, toRef, watch, watchEffect } from 'vue';
import useMergedState from '../_util/hooks/useMergedState';
import { warning } from '../vc-util/warning';
import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';
function PickerPanel() {
  return defineComponent({
    name: 'PickerPanel',
    inheritAttrs: false,
    props: {
      prefixCls: String,
      locale: Object,
      generateConfig: Object,
      value: Object,
      defaultValue: Object,
      pickerValue: Object,
      defaultPickerValue: Object,
      disabledDate: Function,
      mode: String,
      picker: {
        type: String,
        default: 'date'
      },
      tabindex: {
        type: [Number, String],
        default: 0
      },
      showNow: {
        type: Boolean,
        default: undefined
      },
      showTime: [Boolean, Object],
      showToday: Boolean,
      renderExtraFooter: Function,
      dateRender: Function,
      hideHeader: {
        type: Boolean,
        default: undefined
      },
      onSelect: Function,
      onChange: Function,
      onPanelChange: Function,
      onMousedown: Function,
      onPickerValueChange: Function,
      onOk: Function,
      components: Object,
      direction: String,
      hourStep: {
        type: Number,
        default: 1
      },
      minuteStep: {
        type: Number,
        default: 1
      },
      secondStep: {
        type: Number,
        default: 1
      }
    },
    setup(props, _ref) {
      let {
        attrs
      } = _ref;
      const needConfirmButton = computed(() => props.picker === 'date' && !!props.showTime || props.picker === 'time');
      const isHourStepValid = computed(() => 24 % props.hourStep === 0);
      const isMinuteStepValid = computed(() => 60 % props.minuteStep === 0);
      const isSecondStepValid = computed(() => 60 % props.secondStep === 0);
      if (process.env.NODE_ENV !== 'production') {
        watchEffect(() => {
          const {
            generateConfig,
            value,
            hourStep = 1,
            minuteStep = 1,
            secondStep = 1
          } = props;
          warning(!value || generateConfig.isValidate(value), 'Invalidate date pass to `value`.');
          warning(!value || generateConfig.isValidate(value), 'Invalidate date pass to `defaultValue`.');
          warning(isHourStepValid.value, `\`hourStep\` ${hourStep} is invalid. It should be a factor of 24.`);
          warning(isMinuteStepValid.value, `\`minuteStep\` ${minuteStep} is invalid. It should be a factor of 60.`);
          warning(isSecondStepValid.value, `\`secondStep\` ${secondStep} is invalid. It should be a factor of 60.`);
        });
      }
      const panelContext = useInjectPanel();
      const {
        operationRef,
        onSelect: onContextSelect,
        hideRanges,
        defaultOpenValue
      } = panelContext;
      const {
        inRange,
        panelPosition,
        rangedValue,
        hoverRangedValue
      } = useInjectRange();
      const panelRef = ref({});
      // Value
      const [mergedValue, setInnerValue] = useMergedState(null, {
        value: toRef(props, 'value'),
        defaultValue: props.defaultValue,
        postState: val => {
          if (!val && (defaultOpenValue === null || defaultOpenValue === void 0 ? void 0 : defaultOpenValue.value) && props.picker === 'time') {
            return defaultOpenValue.value;
          }
          return val;
        }
      });
      // View date control
      const [viewDate, setInnerViewDate] = useMergedState(null, {
        value: toRef(props, 'pickerValue'),
        defaultValue: props.defaultPickerValue || mergedValue.value,
        postState: date => {
          const {
            generateConfig,
            showTime,
            defaultValue
          } = props;
          const now = generateConfig.getNow();
          if (!date) return now;
          // When value is null and set showTime
          if (!mergedValue.value && props.showTime) {
            if (typeof showTime === 'object') {
              return setDateTime(generateConfig, Array.isArray(date) ? date[0] : date, showTime.defaultValue || now);
            }
            if (defaultValue) {
              return setDateTime(generateConfig, Array.isArray(date) ? date[0] : date, defaultValue);
            }
            return setDateTime(generateConfig, Array.isArray(date) ? date[0] : date, now);
          }
          return date;
        }
      });
      const setViewDate = date => {
        setInnerViewDate(date);
        if (props.onPickerValueChange) {
          props.onPickerValueChange(date);
        }
      };
      // Panel control
      const getInternalNextMode = nextMode => {
        const getNextMode = PickerModeMap[props.picker];
        if (getNextMode) {
          return getNextMode(nextMode);
        }
        return nextMode;
      };
      // Save panel is changed from which panel
      const [mergedMode, setInnerMode] = useMergedState(() => {
        if (props.picker === 'time') {
          return 'time';
        }
        return getInternalNextMode('date');
      }, {
        value: toRef(props, 'mode')
      });
      watch(() => props.picker, () => {
        setInnerMode(props.picker);
      });
      const sourceMode = ref(mergedMode.value);
      const setSourceMode = val => {
        sourceMode.value = val;
      };
      const onInternalPanelChange = (newMode, viewValue) => {
        const {
          onPanelChange,
          generateConfig
        } = props;
        const nextMode = getInternalNextMode(newMode || mergedMode.value);
        setSourceMode(mergedMode.value);
        setInnerMode(nextMode);
        if (onPanelChange && (mergedMode.value !== nextMode || isEqual(generateConfig, viewDate.value, viewDate.value))) {
          onPanelChange(viewValue, nextMode);
        }
      };
      const triggerSelect = function (date, type) {
        let forceTriggerSelect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
        const {
          picker,
          generateConfig,
          onSelect,
          onChange,
          disabledDate
        } = props;
        if (mergedMode.value === picker || forceTriggerSelect) {
          setInnerValue(date);
          if (onSelect) {
            onSelect(date);
          }
          if (onContextSelect) {
            onContextSelect(date, type);
          }
          if (onChange && !isEqual(generateConfig, date, mergedValue.value) && !(disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(date))) {
            onChange(date);
          }
        }
      };
      // ========================= Interactive ==========================
      const onInternalKeydown = e => {
        if (panelRef.value && panelRef.value.onKeydown) {
          if ([KeyCode.LEFT, KeyCode.RIGHT, KeyCode.UP, KeyCode.DOWN, KeyCode.PAGE_UP, KeyCode.PAGE_DOWN, KeyCode.ENTER].includes(e.which)) {
            e.preventDefault();
          }
          return panelRef.value.onKeydown(e);
        }
        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          warning(false, 'Panel not correct handle keyDown event. Please help to fire issue about this.');
          return false;
        }
        /* eslint-enable no-lone-blocks */
      };
      const onInternalBlur = e => {
        if (panelRef.value && panelRef.value.onBlur) {
          panelRef.value.onBlur(e);
        }
      };
      const onNow = () => {
        const {
          generateConfig,
          hourStep,
          minuteStep,
          secondStep
        } = props;
        const now = generateConfig.getNow();
        const lowerBoundTime = getLowerBoundTime(generateConfig.getHour(now), generateConfig.getMinute(now), generateConfig.getSecond(now), isHourStepValid.value ? hourStep : 1, isMinuteStepValid.value ? minuteStep : 1, isSecondStepValid.value ? secondStep : 1);
        const adjustedNow = setTime(generateConfig, now, lowerBoundTime[0],
        // hour
        lowerBoundTime[1],
        // minute
        lowerBoundTime[2]);
        triggerSelect(adjustedNow, 'submit');
      };
      const classString = computed(() => {
        const {
          prefixCls,
          direction
        } = props;
        return classNames(`${prefixCls}-panel`, {
          [`${prefixCls}-panel-has-range`]: rangedValue && rangedValue.value && rangedValue.value[0] && rangedValue.value[1],
          [`${prefixCls}-panel-has-range-hover`]: hoverRangedValue && hoverRangedValue.value && hoverRangedValue.value[0] && hoverRangedValue.value[1],
          [`${prefixCls}-panel-rtl`]: direction === 'rtl'
        });
      });
      useProvidePanel(_extends(_extends({}, panelContext), {
        mode: mergedMode,
        hideHeader: computed(() => {
          var _a;
          return props.hideHeader !== undefined ? props.hideHeader : (_a = panelContext.hideHeader) === null || _a === void 0 ? void 0 : _a.value;
        }),
        hidePrevBtn: computed(() => inRange.value && panelPosition.value === 'right'),
        hideNextBtn: computed(() => inRange.value && panelPosition.value === 'left')
      }));
      watch(() => props.value, () => {
        if (props.value) {
          setInnerViewDate(props.value);
        }
      });
      return () => {
        const {
          prefixCls = 'ant-picker',
          locale,
          generateConfig,
          disabledDate,
          picker = 'date',
          tabindex = 0,
          showNow,
          showTime,
          showToday,
          renderExtraFooter,
          onMousedown,
          onOk,
          components
        } = props;
        if (operationRef && panelPosition.value !== 'right') {
          operationRef.value = {
            onKeydown: onInternalKeydown,
            onClose: () => {
              if (panelRef.value && panelRef.value.onClose) {
                panelRef.value.onClose();
              }
            }
          };
        }
        // ============================ Panels ============================
        let panelNode;
        const pickerProps = _extends(_extends(_extends({}, attrs), props), {
          operationRef: panelRef,
          prefixCls,
          viewDate: viewDate.value,
          value: mergedValue.value,
          onViewDateChange: setViewDate,
          sourceMode: sourceMode.value,
          onPanelChange: onInternalPanelChange,
          disabledDate
        });
        delete pickerProps.onChange;
        delete pickerProps.onSelect;
        switch (mergedMode.value) {
          case 'decade':
            panelNode = _createVNode(DecadePanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'year':
            panelNode = _createVNode(YearPanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'month':
            panelNode = _createVNode(MonthPanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'quarter':
            panelNode = _createVNode(QuarterPanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'week':
            panelNode = _createVNode(WeekPanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'time':
            delete pickerProps.showTime;
            panelNode = _createVNode(TimePanel, _objectSpread(_objectSpread(_objectSpread({}, pickerProps), typeof showTime === 'object' ? showTime : null), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          default:
            if (showTime) {
              panelNode = _createVNode(DatetimePanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
                "onSelect": (date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }
              }), null);
            } else {
              panelNode = _createVNode(DatePanel, _objectSpread(_objectSpread({}, pickerProps), {}, {
                "onSelect": (date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }
              }), null);
            }
        }
        // ============================ Footer ============================
        let extraFooter;
        let rangesNode;
        if (!(hideRanges === null || hideRanges === void 0 ? void 0 : hideRanges.value)) {
          extraFooter = getExtraFooter(prefixCls, mergedMode.value, renderExtraFooter);
          rangesNode = getRanges({
            prefixCls,
            components,
            needConfirmButton: needConfirmButton.value,
            okDisabled: !mergedValue.value || disabledDate && disabledDate(mergedValue.value),
            locale,
            showNow,
            onNow: needConfirmButton.value && onNow,
            onOk: () => {
              if (mergedValue.value) {
                triggerSelect(mergedValue.value, 'submit', true);
                if (onOk) {
                  onOk(mergedValue.value);
                }
              }
            }
          });
        }
        let todayNode;
        if (showToday && mergedMode.value === 'date' && picker === 'date' && !showTime) {
          const now = generateConfig.getNow();
          const todayCls = `${prefixCls}-today-btn`;
          const disabled = disabledDate && disabledDate(now);
          todayNode = _createVNode("a", {
            "class": classNames(todayCls, disabled && `${todayCls}-disabled`),
            "aria-disabled": disabled,
            "onClick": () => {
              if (!disabled) {
                triggerSelect(now, 'mouse', true);
              }
            }
          }, [locale.today]);
        }
        return _createVNode("div", {
          "tabindex": tabindex,
          "class": classNames(classString.value, attrs.class),
          "style": attrs.style,
          "onKeydown": onInternalKeydown,
          "onBlur": onInternalBlur,
          "onMousedown": onMousedown
        }, [panelNode, extraFooter || rangesNode || todayNode ? _createVNode("div", {
          "class": `${prefixCls}-footer`
        }, [extraFooter, rangesNode, todayNode]) : null]);
      };
    }
  });
}
const InterPickerPanel = PickerPanel();
export default (props => createVNode(InterPickerPanel, props));