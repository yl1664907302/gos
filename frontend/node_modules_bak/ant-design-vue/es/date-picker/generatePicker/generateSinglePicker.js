import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import CalendarOutlined from "@ant-design/icons-vue/es/icons/CalendarOutlined";
import ClockCircleOutlined from "@ant-design/icons-vue/es/icons/ClockCircleOutlined";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import RCPicker from '../../vc-picker';
import enUS from '../locale/en_US';
import { getPlaceholder, transPlacement2DropdownAlign } from '../util';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import { getTimeProps, Components } from '.';
import { computed, defineComponent, ref } from 'vue';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import classNames from '../../_util/classNames';
import { commonProps, datePickerProps } from './props';
import devWarning from '../../vc-util/devWarning';
import { FormItemInputContext, useInjectFormItemContext } from '../../form/FormItemContext';
import { getMergedStatus, getStatusClassNames } from '../../_util/statusUtils';
import { useCompactItemContext } from '../../space/Compact';
//CSSINJS
import useStyle from '../style';
export default function generateSinglePicker(generateConfig, extraProps) {
  function getPicker(picker, displayName) {
    const comProps = _extends(_extends(_extends({}, commonProps()), datePickerProps()), extraProps);
    return defineComponent({
      compatConfig: {
        MODE: 3
      },
      name: displayName,
      inheritAttrs: false,
      props: comProps,
      slots: Object,
      setup(_props, _ref) {
        let {
          slots,
          expose,
          attrs,
          emit
        } = _ref;
        // 兼容 vue 3.2.7
        const props = _props;
        const formItemContext = useInjectFormItemContext();
        const formItemInputContext = FormItemInputContext.useInject();
        // =================== Warning =====================
        if (process.env.NODE_ENV !== 'production') {
          devWarning(picker !== 'quarter', displayName || 'DatePicker', `DatePicker.${displayName} is legacy usage. Please use DatePicker[picker='${picker}'] directly.`);
          devWarning(!props.dropdownClassName, displayName || 'DatePicker', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
          devWarning(!(props.monthCellContentRender || slots.monthCellContentRender), displayName || 'DatePicker', '`monthCellContentRender` is deprecated. Please use `monthCellRender"` instead.');
          devWarning(!attrs.getCalendarContainer, displayName || 'DatePicker', '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.');
        }
        const {
          prefixCls,
          direction,
          getPopupContainer,
          size,
          rootPrefixCls,
          disabled
        } = useConfigInject('picker', props);
        const {
          compactSize,
          compactItemClassnames
        } = useCompactItemContext(prefixCls, direction);
        const mergedSize = computed(() => compactSize.value || size.value);
        // style
        const [wrapSSR, hashId] = useStyle(prefixCls);
        const pickerRef = ref();
        expose({
          focus: () => {
            var _a;
            (_a = pickerRef.value) === null || _a === void 0 ? void 0 : _a.focus();
          },
          blur: () => {
            var _a;
            (_a = pickerRef.value) === null || _a === void 0 ? void 0 : _a.blur();
          }
        });
        const maybeToString = date => {
          return props.valueFormat ? generateConfig.toString(date, props.valueFormat) : date;
        };
        const onChange = (date, dateString) => {
          const value = maybeToString(date);
          emit('update:value', value);
          emit('change', value, dateString);
          formItemContext.onFieldChange();
        };
        const onOpenChange = open => {
          emit('update:open', open);
          emit('openChange', open);
        };
        const onFocus = e => {
          emit('focus', e);
        };
        const onBlur = e => {
          emit('blur', e);
          formItemContext.onFieldBlur();
        };
        const onPanelChange = (date, mode) => {
          const value = maybeToString(date);
          emit('panelChange', value, mode);
        };
        const onOk = date => {
          const value = maybeToString(date);
          emit('ok', value);
        };
        const [contextLocale] = useLocaleReceiver('DatePicker', enUS);
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
        const defaultPickerValue = computed(() => {
          if (props.defaultPickerValue) {
            return props.valueFormat ? generateConfig.toDate(props.defaultPickerValue, props.valueFormat) : props.defaultPickerValue;
          }
          return props.defaultPickerValue === '' ? undefined : props.defaultPickerValue;
        });
        return () => {
          var _a, _b, _c, _d, _e, _f;
          const locale = _extends(_extends({}, contextLocale.value), props.locale);
          const p = _extends(_extends({}, props), attrs);
          const {
              bordered = true,
              placeholder,
              suffixIcon = (_a = slots.suffixIcon) === null || _a === void 0 ? void 0 : _a.call(slots),
              showToday = true,
              transitionName,
              allowClear = true,
              dateRender = slots.dateRender,
              renderExtraFooter = slots.renderExtraFooter,
              monthCellRender = slots.monthCellRender || props.monthCellContentRender || slots.monthCellContentRender,
              clearIcon = (_b = slots.clearIcon) === null || _b === void 0 ? void 0 : _b.call(slots),
              id = formItemContext.id.value
            } = p,
            restProps = __rest(p, ["bordered", "placeholder", "suffixIcon", "showToday", "transitionName", "allowClear", "dateRender", "renderExtraFooter", "monthCellRender", "clearIcon", "id"]);
          const showTime = p.showTime === '' ? true : p.showTime;
          const {
            format
          } = p;
          let additionalOverrideProps = {};
          if (picker) {
            additionalOverrideProps.picker = picker;
          }
          const mergedPicker = picker || p.picker || 'date';
          additionalOverrideProps = _extends(_extends(_extends({}, additionalOverrideProps), showTime ? getTimeProps(_extends({
            format,
            picker: mergedPicker
          }, typeof showTime === 'object' ? showTime : {})) : {}), mergedPicker === 'time' ? getTimeProps(_extends(_extends({
            format
          }, restProps), {
            picker: mergedPicker
          })) : {});
          const pre = prefixCls.value;
          const suffixNode = _createVNode(_Fragment, null, [suffixIcon || (picker === 'time' ? _createVNode(ClockCircleOutlined, null, null) : _createVNode(CalendarOutlined, null, null)), formItemInputContext.hasFeedback && formItemInputContext.feedbackIcon]);
          return wrapSSR(_createVNode(RCPicker, _objectSpread(_objectSpread(_objectSpread({
            "monthCellRender": monthCellRender,
            "dateRender": dateRender,
            "renderExtraFooter": renderExtraFooter,
            "ref": pickerRef,
            "placeholder": getPlaceholder(locale, mergedPicker, placeholder),
            "suffixIcon": suffixNode,
            "dropdownAlign": transPlacement2DropdownAlign(direction.value, props.placement),
            "clearIcon": clearIcon || _createVNode(CloseCircleFilled, null, null),
            "allowClear": allowClear,
            "transitionName": transitionName || `${rootPrefixCls.value}-slide-up`
          }, restProps), additionalOverrideProps), {}, {
            "id": id,
            "picker": mergedPicker,
            "value": value.value,
            "defaultValue": defaultValue.value,
            "defaultPickerValue": defaultPickerValue.value,
            "showToday": showToday,
            "locale": locale.lang,
            "class": classNames({
              [`${pre}-${mergedSize.value}`]: mergedSize.value,
              [`${pre}-borderless`]: !bordered
            }, getStatusClassNames(pre, getMergedStatus(formItemInputContext.status, props.status), formItemInputContext.hasFeedback), attrs.class, hashId.value, compactItemClassnames.value),
            "disabled": disabled.value,
            "prefixCls": pre,
            "getPopupContainer": attrs.getCalendarContainer || getPopupContainer.value,
            "generateConfig": generateConfig,
            "prevIcon": ((_c = slots.prevIcon) === null || _c === void 0 ? void 0 : _c.call(slots)) || _createVNode("span", {
              "class": `${pre}-prev-icon`
            }, null),
            "nextIcon": ((_d = slots.nextIcon) === null || _d === void 0 ? void 0 : _d.call(slots)) || _createVNode("span", {
              "class": `${pre}-next-icon`
            }, null),
            "superPrevIcon": ((_e = slots.superPrevIcon) === null || _e === void 0 ? void 0 : _e.call(slots)) || _createVNode("span", {
              "class": `${pre}-super-prev-icon`
            }, null),
            "superNextIcon": ((_f = slots.superNextIcon) === null || _f === void 0 ? void 0 : _f.call(slots)) || _createVNode("span", {
              "class": `${pre}-super-next-icon`
            }, null),
            "components": Components,
            "direction": direction.value,
            "dropdownClassName": classNames(hashId.value, props.popupClassName, props.dropdownClassName),
            "onChange": onChange,
            "onOpenChange": onOpenChange,
            "onFocus": onFocus,
            "onBlur": onBlur,
            "onPanelChange": onPanelChange,
            "onOk": onOk
          }), null));
        };
      }
    });
  }
  const DatePicker = getPicker(undefined, 'ADatePicker');
  const WeekPicker = getPicker('week', 'AWeekPicker');
  const MonthPicker = getPicker('month', 'AMonthPicker');
  const YearPicker = getPicker('year', 'AYearPicker');
  const TimePicker = getPicker('time', 'TimePicker'); // 给独立组件 TimePicker 使用，此处名称不用更改
  const QuarterPicker = getPicker('quarter', 'AQuarterPicker');
  return {
    DatePicker,
    WeekPicker,
    MonthPicker,
    YearPicker,
    TimePicker,
    QuarterPicker
  };
}