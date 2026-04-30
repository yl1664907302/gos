"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _TimePanel = _interopRequireDefault(require("./panels/TimePanel"));
var _DatetimePanel = _interopRequireDefault(require("./panels/DatetimePanel"));
var _DatePanel = _interopRequireDefault(require("./panels/DatePanel"));
var _WeekPanel = _interopRequireDefault(require("./panels/WeekPanel"));
var _MonthPanel = _interopRequireDefault(require("./panels/MonthPanel"));
var _QuarterPanel = _interopRequireDefault(require("./panels/QuarterPanel"));
var _YearPanel = _interopRequireDefault(require("./panels/YearPanel"));
var _DecadePanel = _interopRequireDefault(require("./panels/DecadePanel"));
var _dateUtil = require("./utils/dateUtil");
var _PanelContext = require("./PanelContext");
var _uiUtil = require("./utils/uiUtil");
var _RangeContext = require("./RangeContext");
var _getExtraFooter = _interopRequireDefault(require("./utils/getExtraFooter"));
var _getRanges = _interopRequireDefault(require("./utils/getRanges"));
var _timeUtil = require("./utils/timeUtil");
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _warning = require("../vc-util/warning");
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
function PickerPanel() {
  return (0, _vue.defineComponent)({
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
      const needConfirmButton = (0, _vue.computed)(() => props.picker === 'date' && !!props.showTime || props.picker === 'time');
      const isHourStepValid = (0, _vue.computed)(() => 24 % props.hourStep === 0);
      const isMinuteStepValid = (0, _vue.computed)(() => 60 % props.minuteStep === 0);
      const isSecondStepValid = (0, _vue.computed)(() => 60 % props.secondStep === 0);
      if (process.env.NODE_ENV !== 'production') {
        (0, _vue.watchEffect)(() => {
          const {
            generateConfig,
            value,
            hourStep = 1,
            minuteStep = 1,
            secondStep = 1
          } = props;
          (0, _warning.warning)(!value || generateConfig.isValidate(value), 'Invalidate date pass to `value`.');
          (0, _warning.warning)(!value || generateConfig.isValidate(value), 'Invalidate date pass to `defaultValue`.');
          (0, _warning.warning)(isHourStepValid.value, `\`hourStep\` ${hourStep} is invalid. It should be a factor of 24.`);
          (0, _warning.warning)(isMinuteStepValid.value, `\`minuteStep\` ${minuteStep} is invalid. It should be a factor of 60.`);
          (0, _warning.warning)(isSecondStepValid.value, `\`secondStep\` ${secondStep} is invalid. It should be a factor of 60.`);
        });
      }
      const panelContext = (0, _PanelContext.useInjectPanel)();
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
      } = (0, _RangeContext.useInjectRange)();
      const panelRef = (0, _vue.ref)({});
      // Value
      const [mergedValue, setInnerValue] = (0, _useMergedState.default)(null, {
        value: (0, _vue.toRef)(props, 'value'),
        defaultValue: props.defaultValue,
        postState: val => {
          if (!val && (defaultOpenValue === null || defaultOpenValue === void 0 ? void 0 : defaultOpenValue.value) && props.picker === 'time') {
            return defaultOpenValue.value;
          }
          return val;
        }
      });
      // View date control
      const [viewDate, setInnerViewDate] = (0, _useMergedState.default)(null, {
        value: (0, _vue.toRef)(props, 'pickerValue'),
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
              return (0, _timeUtil.setDateTime)(generateConfig, Array.isArray(date) ? date[0] : date, showTime.defaultValue || now);
            }
            if (defaultValue) {
              return (0, _timeUtil.setDateTime)(generateConfig, Array.isArray(date) ? date[0] : date, defaultValue);
            }
            return (0, _timeUtil.setDateTime)(generateConfig, Array.isArray(date) ? date[0] : date, now);
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
        const getNextMode = _uiUtil.PickerModeMap[props.picker];
        if (getNextMode) {
          return getNextMode(nextMode);
        }
        return nextMode;
      };
      // Save panel is changed from which panel
      const [mergedMode, setInnerMode] = (0, _useMergedState.default)(() => {
        if (props.picker === 'time') {
          return 'time';
        }
        return getInternalNextMode('date');
      }, {
        value: (0, _vue.toRef)(props, 'mode')
      });
      (0, _vue.watch)(() => props.picker, () => {
        setInnerMode(props.picker);
      });
      const sourceMode = (0, _vue.ref)(mergedMode.value);
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
        if (onPanelChange && (mergedMode.value !== nextMode || (0, _dateUtil.isEqual)(generateConfig, viewDate.value, viewDate.value))) {
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
          if (onChange && !(0, _dateUtil.isEqual)(generateConfig, date, mergedValue.value) && !(disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(date))) {
            onChange(date);
          }
        }
      };
      // ========================= Interactive ==========================
      const onInternalKeydown = e => {
        if (panelRef.value && panelRef.value.onKeydown) {
          if ([_KeyCode.default.LEFT, _KeyCode.default.RIGHT, _KeyCode.default.UP, _KeyCode.default.DOWN, _KeyCode.default.PAGE_UP, _KeyCode.default.PAGE_DOWN, _KeyCode.default.ENTER].includes(e.which)) {
            e.preventDefault();
          }
          return panelRef.value.onKeydown(e);
        }
        /* istanbul ignore next */
        /* eslint-disable no-lone-blocks */
        {
          (0, _warning.warning)(false, 'Panel not correct handle keyDown event. Please help to fire issue about this.');
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
        const lowerBoundTime = (0, _timeUtil.getLowerBoundTime)(generateConfig.getHour(now), generateConfig.getMinute(now), generateConfig.getSecond(now), isHourStepValid.value ? hourStep : 1, isMinuteStepValid.value ? minuteStep : 1, isSecondStepValid.value ? secondStep : 1);
        const adjustedNow = (0, _timeUtil.setTime)(generateConfig, now, lowerBoundTime[0],
        // hour
        lowerBoundTime[1],
        // minute
        lowerBoundTime[2]);
        triggerSelect(adjustedNow, 'submit');
      };
      const classString = (0, _vue.computed)(() => {
        const {
          prefixCls,
          direction
        } = props;
        return (0, _classNames.default)(`${prefixCls}-panel`, {
          [`${prefixCls}-panel-has-range`]: rangedValue && rangedValue.value && rangedValue.value[0] && rangedValue.value[1],
          [`${prefixCls}-panel-has-range-hover`]: hoverRangedValue && hoverRangedValue.value && hoverRangedValue.value[0] && hoverRangedValue.value[1],
          [`${prefixCls}-panel-rtl`]: direction === 'rtl'
        });
      });
      (0, _PanelContext.useProvidePanel)((0, _extends2.default)((0, _extends2.default)({}, panelContext), {
        mode: mergedMode,
        hideHeader: (0, _vue.computed)(() => {
          var _a;
          return props.hideHeader !== undefined ? props.hideHeader : (_a = panelContext.hideHeader) === null || _a === void 0 ? void 0 : _a.value;
        }),
        hidePrevBtn: (0, _vue.computed)(() => inRange.value && panelPosition.value === 'right'),
        hideNextBtn: (0, _vue.computed)(() => inRange.value && panelPosition.value === 'left')
      }));
      (0, _vue.watch)(() => props.value, () => {
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
        const pickerProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), props), {
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
            panelNode = (0, _vue.createVNode)(_DecadePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'year':
            panelNode = (0, _vue.createVNode)(_YearPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'month':
            panelNode = (0, _vue.createVNode)(_MonthPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'quarter':
            panelNode = (0, _vue.createVNode)(_QuarterPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'week':
            panelNode = (0, _vue.createVNode)(_WeekPanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          case 'time':
            delete pickerProps.showTime;
            panelNode = (0, _vue.createVNode)(_TimePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), typeof showTime === 'object' ? showTime : null), {}, {
              "onSelect": (date, type) => {
                setViewDate(date);
                triggerSelect(date, type);
              }
            }), null);
            break;
          default:
            if (showTime) {
              panelNode = (0, _vue.createVNode)(_DatetimePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
                "onSelect": (date, type) => {
                  setViewDate(date);
                  triggerSelect(date, type);
                }
              }), null);
            } else {
              panelNode = (0, _vue.createVNode)(_DatePanel.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, pickerProps), {}, {
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
          extraFooter = (0, _getExtraFooter.default)(prefixCls, mergedMode.value, renderExtraFooter);
          rangesNode = (0, _getRanges.default)({
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
          todayNode = (0, _vue.createVNode)("a", {
            "class": (0, _classNames.default)(todayCls, disabled && `${todayCls}-disabled`),
            "aria-disabled": disabled,
            "onClick": () => {
              if (!disabled) {
                triggerSelect(now, 'mouse', true);
              }
            }
          }, [locale.today]);
        }
        return (0, _vue.createVNode)("div", {
          "tabindex": tabindex,
          "class": (0, _classNames.default)(classString.value, attrs.class),
          "style": attrs.style,
          "onKeydown": onInternalKeydown,
          "onBlur": onInternalBlur,
          "onMousedown": onMousedown
        }, [panelNode, extraFooter || rangesNode || todayNode ? (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-footer`
        }, [extraFooter, rangesNode, todayNode]) : null]);
      };
    }
  });
}
const InterPickerPanel = PickerPanel();
var _default = props => (0, _vue.createVNode)(InterPickerPanel, props);
exports.default = _default;