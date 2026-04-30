import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import useMergedState from '../_util/hooks/useMergedState';
import { PickerPanel } from '../vc-picker';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import enUS from './locale/en_US';
import CalendarHeader from './Header';
import { computed, defineComponent, toRef } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
// CSSINJS
import useStyle from './style';
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
  const Calendar = defineComponent({
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
      } = useConfigInject('picker', props);
      // style
      const [wrapSSR, hashId] = useStyle(prefixCls);
      const calendarPrefixCls = computed(() => `${prefixCls.value}-calendar`);
      const maybeToString = date => {
        return props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
      };
      const value = computed(() => {
        if (props.value) {
          return props.valueFormat ? generateConfig.toDate(props.value, props.valueFormat) : props.value;
        }
        return props.value === '' ? undefined : props.value;
      });
      const defaultValue = computed(() => {
        if (props.defaultValue) {
          return props.valueFormat ? generateConfig.toDate(props.defaultValue, props.valueFormat) : props.defaultValue;
        }
        return props.defaultValue === '' ? undefined : props.defaultValue;
      });
      // Value
      const [mergedValue, setMergedValue] = useMergedState(() => value.value || generateConfig.getNow(), {
        defaultValue: defaultValue.value,
        value
      });
      // Mode
      const [mergedMode, setMergedMode] = useMergedState('month', {
        value: toRef(props, 'mode')
      });
      const panelMode = computed(() => mergedMode.value === 'year' ? 'month' : 'date');
      const mergedDisabledDate = computed(() => {
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
      const defaultLocale = computed(() => {
        const {
          locale
        } = props;
        const result = _extends(_extends({}, enUS), locale);
        result.lang = _extends(_extends({}, result.lang), (locale || {}).lang);
        return result;
      });
      const [mergedLocale] = useLocaleReceiver('Calendar', defaultLocale);
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
          return _createVNode("div", {
            "class": classNames(`${prefixCls.value}-cell-inner`, `${calendarPrefixCls.value}-date`, {
              [`${calendarPrefixCls.value}-date-today`]: isSameDate(today, date)
            })
          }, [_createVNode("div", {
            "class": `${calendarPrefixCls.value}-date-value`
          }, [String(generateConfig.getDate(date)).padStart(2, '0')]), _createVNode("div", {
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
          return _createVNode("div", {
            "class": classNames(`${prefixCls.value}-cell-inner`, `${calendarPrefixCls.value}-date`, {
              [`${calendarPrefixCls.value}-date-today`]: isSameMonth(today, date)
            })
          }, [_createVNode("div", {
            "class": `${calendarPrefixCls.value}-date-value`
          }, [months[generateConfig.getMonth(date)]]), _createVNode("div", {
            "class": `${calendarPrefixCls.value}-date-content`
          }, [monthCellRender && monthCellRender({
            current: date
          })])]);
        };
        return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
          "class": classNames(calendarPrefixCls.value, {
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
        }) : _createVNode(CalendarHeader, {
          "prefixCls": calendarPrefixCls.value,
          "value": mergedValue.value,
          "generateConfig": generateConfig,
          "mode": mergedMode.value,
          "fullscreen": fullscreen,
          "locale": mergedLocale.value.lang,
          "validRange": validRange,
          "onChange": onInternalSelect,
          "onModeChange": triggerModeChange
        }, null), _createVNode(PickerPanel, {
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
export default generateCalendar;