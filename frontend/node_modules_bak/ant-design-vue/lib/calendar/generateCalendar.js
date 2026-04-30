"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _vcPicker = require("../vc-picker");
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _en_US = _interopRequireDefault(require("./locale/en_US"));
var _Header = _interopRequireDefault(require("./Header"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

function generateCalendar(generateConfig) {
  function isSameYear(date1, date2) {
    return date1 && date2 && generateConfig.getYear(date1) === generateConfig.getYear(date2);
  }
  function isSameMonth(date1, date2) {
    return isSameYear(date1, date2) && generateConfig.getMonth(date1) === generateConfig.getMonth(date2);
  }
  function isSameDate(date1, date2) {
    return isSameMonth(date1, date2) && generateConfig.getDate(date1) === generateConfig.getDate(date2);
  }
  const Calendar = (0, _vue.defineComponent)({
    name: 'ACalendar',
    inheritAttrs: false,
    props: {
      prefixCls: String,
      locale: {
        type: Object,
        default: undefined
      },
      validRange: {
        type: Array,
        default: undefined
      },
      disabledDate: {
        type: Function,
        default: undefined
      },
      dateFullCellRender: {
        type: Function,
        default: undefined
      },
      dateCellRender: {
        type: Function,
        default: undefined
      },
      monthFullCellRender: {
        type: Function,
        default: undefined
      },
      monthCellRender: {
        type: Function,
        default: undefined
      },
      headerRender: {
        type: Function,
        default: undefined
      },
      value: {
        type: [Object, String],
        default: undefined
      },
      defaultValue: {
        type: [Object, String],
        default: undefined
      },
      mode: {
        type: String,
        default: undefined
      },
      fullscreen: {
        type: Boolean,
        default: undefined
      },
      onChange: {
        type: Function,
        default: undefined
      },
      'onUpdate:value': {
        type: Function,
        default: undefined
      },
      onPanelChange: {
        type: Function,
        default: undefined
      },
      onSelect: {
        type: Function,
        default: undefined
      },
      valueFormat: {
        type: String,
        default: undefined
      }
    },
    slots: Object,
    setup(p, _ref) {
      let {
        emit,
        slots,
        attrs
      } = _ref;
      const props = p;
      const {
        prefixCls,
        direction
      } = (0, _useConfigInject.default)('picker', props);
      // style
      const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
      const calendarPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-calendar`);
      const maybeToString = date => {
        return props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
      };
      const value = (0, _vue.computed)(() => {
        if (props.value) {
          return props.valueFormat ? generateConfig.toDate(props.value, props.valueFormat) : props.value;
        }
        return props.value === '' ? undefined : props.value;
      });
      const defaultValue = (0, _vue.computed)(() => {
        if (props.defaultValue) {
          return props.valueFormat ? generateConfig.toDate(props.defaultValue, props.valueFormat) : props.defaultValue;
        }
        return props.defaultValue === '' ? undefined : props.defaultValue;
      });
      // Value
      const [mergedValue, setMergedValue] = (0, _useMergedState.default)(() => value.value || generateConfig.getNow(), {
        defaultValue: defaultValue.value,
        value
      });
      // Mode
      const [mergedMode, setMergedMode] = (0, _useMergedState.default)('month', {
        value: (0, _vue.toRef)(props, 'mode')
      });
      const panelMode = (0, _vue.computed)(() => mergedMode.value === 'year' ? 'month' : 'date');
      const mergedDisabledDate = (0, _vue.computed)(() => {
        return date => {
          var _a;
          const notInRange = props.validRange ? generateConfig.isAfter(props.validRange[0], date) || generateConfig.isAfter(date, props.validRange[1]) : false;
          return notInRange || !!((_a = props.disabledDate) === null || _a === void 0 ? void 0 : _a.call(props, date));
        };
      });
      // ====================== Events ======================
      const triggerPanelChange = (date, newMode) => {
        emit('panelChange', maybeToString(date), newMode);
      };
      const triggerChange = date => {
        setMergedValue(date);
        if (!isSameDate(date, mergedValue.value)) {
          // Trigger when month panel switch month
          if (panelMode.value === 'date' && !isSameMonth(date, mergedValue.value) || panelMode.value === 'month' && !isSameYear(date, mergedValue.value)) {
            triggerPanelChange(date, mergedMode.value);
          }
          const val = maybeToString(date);
          emit('update:value', val);
          emit('change', val);
        }
      };
      const triggerModeChange = newMode => {
        setMergedMode(newMode);
        triggerPanelChange(mergedValue.value, newMode);
      };
      const onInternalSelect = (date, source) => {
        triggerChange(date);
        emit('select', maybeToString(date), {
          source
        });
      };
      // ====================== Locale ======================
      const defaultLocale = (0, _vue.computed)(() => {
        const {
          locale
        } = props;
        const result = (0, _extends2.default)((0, _extends2.default)({}, _en_US.default), locale);
        result.lang = (0, _extends2.default)((0, _extends2.default)({}, result.lang), (locale || {}).lang);
        return result;
      });
      const [mergedLocale] = (0, _LocaleReceiver.useLocaleReceiver)('Calendar', defaultLocale);
      return () => {
        const today = generateConfig.getNow();
        const {
          dateFullCellRender = slots === null || slots === void 0 ? void 0 : slots.dateFullCellRender,
          dateCellRender = slots === null || slots === void 0 ? void 0 : slots.dateCellRender,
          monthFullCellRender = slots === null || slots === void 0 ? void 0 : slots.monthFullCellRender,
          monthCellRender = slots === null || slots === void 0 ? void 0 : slots.monthCellRender,
          headerRender = slots === null || slots === void 0 ? void 0 : slots.headerRender,
          fullscreen = true,
          validRange
        } = props;
        // ====================== Render ======================
        const dateRender = _ref2 => {
          let {
            current: date
          } = _ref2;
          if (dateFullCellRender) {
            return dateFullCellRender({
              current: date
            });
          }
          return (0, _vue.createVNode)("div", {
            "class": (0, _classNames.default)(`${prefixCls.value}-cell-inner`, `${calendarPrefixCls.value}-date`, {
              [`${calendarPrefixCls.value}-date-today`]: isSameDate(today, date)
            })
          }, [(0, _vue.createVNode)("div", {
            "class": `${calendarPrefixCls.value}-date-value`
          }, [String(generateConfig.getDate(date)).padStart(2, '0')]), (0, _vue.createVNode)("div", {
            "class": `${calendarPrefixCls.value}-date-content`
          }, [dateCellRender && dateCellRender({
            current: date
          })])]);
        };
        const monthRender = (_ref3, locale) => {
          let {
            current: date
          } = _ref3;
          if (monthFullCellRender) {
            return monthFullCellRender({
              current: date
            });
          }
          const months = locale.shortMonths || generateConfig.locale.getShortMonths(locale.locale);
          return (0, _vue.createVNode)("div", {
            "class": (0, _classNames.default)(`${prefixCls.value}-cell-inner`, `${calendarPrefixCls.value}-date`, {
              [`${calendarPrefixCls.value}-date-today`]: isSameMonth(today, date)
            })
          }, [(0, _vue.createVNode)("div", {
            "class": `${calendarPrefixCls.value}-date-value`
          }, [months[generateConfig.getMonth(date)]]), (0, _vue.createVNode)("div", {
            "class": `${calendarPrefixCls.value}-date-content`
          }, [monthCellRender && monthCellRender({
            current: date
          })])]);
        };
        return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": (0, _classNames.default)(calendarPrefixCls.value, {
            [`${calendarPrefixCls.value}-full`]: fullscreen,
            [`${calendarPrefixCls.value}-mini`]: !fullscreen,
            [`${calendarPrefixCls.value}-rtl`]: direction.value === 'rtl'
          }, attrs.class, hashId.value)
        }), [headerRender ? headerRender({
          value: mergedValue.value,
          type: mergedMode.value,
          onChange: nextDate => {
            onInternalSelect(nextDate, 'customize');
          },
          onTypeChange: triggerModeChange
        }) : (0, _vue.createVNode)(_Header.default, {
          "prefixCls": calendarPrefixCls.value,
          "value": mergedValue.value,
          "generateConfig": generateConfig,
          "mode": mergedMode.value,
          "fullscreen": fullscreen,
          "locale": mergedLocale.value.lang,
          "validRange": validRange,
          "onChange": onInternalSelect,
          "onModeChange": triggerModeChange
        }, null), (0, _vue.createVNode)(_vcPicker.PickerPanel, {
          "value": mergedValue.value,
          "prefixCls": prefixCls.value,
          "locale": mergedLocale.value.lang,
          "generateConfig": generateConfig,
          "dateRender": dateRender,
          "monthCellRender": obj => monthRender(obj, mergedLocale.value.lang),
          "onSelect": nextDate => {
            onInternalSelect(nextDate, panelMode.value);
          },
          "mode": panelMode.value,
          "picker": panelMode.value,
          "disabledDate": mergedDisabledDate.value,
          "hideHeader": true
        }, null)]));
      };
    }
  });
  Calendar.install = function (app) {
    app.component(Calendar.name, Calendar);
    return app;
  };
  return Calendar;
}
var _default = exports.default = generateCalendar;