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
import SwapRightOutlined from "@ant-design/icons-vue/es/icons/SwapRightOutlined";
import { RangePicker as VCRangePicker } from '../../vc-picker';
import enUS from '../locale/en_US';
import { useLocaleReceiver } from '../../locale-provider/LocaleReceiver';
import { getRangePlaceholder, transPlacement2DropdownAlign } from '../util';
import { getTimeProps, Components } from '.';
import { computed, defineComponent, ref } from 'vue';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import classNames from '../../_util/classNames';
import { commonProps, rangePickerProps } from './props';
import { FormItemInputContext, useInjectFormItemContext } from '../../form/FormItemContext';
import omit from '../../_util/omit';
import { getMergedStatus, getStatusClassNames } from '../../_util/statusUtils';
//CSSINJS
import useStyle from '../style';
import { useCompactItemContext } from '../../space/Compact';
import devWarning from '../../vc-util/devWarning';
export default function generateRangePicker(generateConfig, extraProps) {
  const RangePicker = defineComponent({
    compatConfig: {
      MODE: 3
    },
    name: 'ARangePicker',
    inheritAttrs: false,
    props: _extends(_extends(_extends({}, commonProps()), rangePickerProps()), extraProps),
    slots: Object,
    setup(_props, _ref) {
      let {
        expose,
        slots,
        attrs,
        emit
      } = _ref;
      const props = _props;
      const formItemContext = useInjectFormItemContext();
      const formItemInputContext = FormItemInputContext.useInject();
      // =================== Warning =====================
      if (process.env.NODE_ENV !== 'production') {
        devWarning(!props.dropdownClassName, 'RangePicker', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
        devWarning(!attrs.getCalendarContainer, 'DatePicker', '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.');
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
      const maybeToStrings = dates => {
        return props.valueFormat ? generateConfig.toString(dates, props.valueFormat) : dates;
      };
      const onChange = (dates, dateStrings) => {
        const values = maybeToStrings(dates);
        emit('update:value', values);
        emit('change', values, dateStrings);
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
      const onPanelChange = (dates, modes) => {
        const values = maybeToStrings(dates);
        emit('panelChange', values, modes);
      };
      const onOk = dates => {
        const value = maybeToStrings(dates);
        emit('ok', value);
      };
      const onCalendarChange = (dates, dateStrings, info) => {
        const values = maybeToStrings(dates);
        emit('calendarChange', values, dateStrings, info);
      };
      const [contextLocale] = useLocaleReceiver('DatePicker', enUS);
      const value = computed(() => {
        if (props.value) {
          return props.valueFormat ? generateConfig.toDate(props.value, props.valueFormat) : props.value;
        }
        return props.value;
      });
      const defaultValue = computed(() => {
        if (props.defaultValue) {
          return props.valueFormat ? generateConfig.toDate(props.defaultValue, props.valueFormat) : props.defaultValue;
        }
        return props.defaultValue;
      });
      const defaultPickerValue = computed(() => {
        if (props.defaultPickerValue) {
          return props.valueFormat ? generateConfig.toDate(props.defaultPickerValue, props.valueFormat) : props.defaultPickerValue;
        }
        return props.defaultPickerValue;
      });
      return () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const locale = _extends(_extends({}, contextLocale.value), props.locale);
        const p = _extends(_extends({}, props), attrs);
        const {
            prefixCls: customizePrefixCls,
            bordered = true,
            placeholder,
            suffixIcon = (_a = slots.suffixIcon) === null || _a === void 0 ? void 0 : _a.call(slots),
            picker = 'date',
            transitionName,
            allowClear = true,
            dateRender = slots.dateRender,
            renderExtraFooter = slots.renderExtraFooter,
            separator = (_b = slots.separator) === null || _b === void 0 ? void 0 : _b.call(slots),
            clearIcon = (_c = slots.clearIcon) === null || _c === void 0 ? void 0 : _c.call(slots),
            id = formItemContext.id.value
          } = p,
          restProps = __rest(p, ["prefixCls", "bordered", "placeholder", "suffixIcon", "picker", "transitionName", "allowClear", "dateRender", "renderExtraFooter", "separator", "clearIcon", "id"]);
        delete restProps['onUpdate:value'];
        delete restProps['onUpdate:open'];
        const {
          format,
          showTime
        } = p;
        let additionalOverrideProps = {};
        additionalOverrideProps = _extends(_extends(_extends({}, additionalOverrideProps), showTime ? getTimeProps(_extends({
          format,
          picker
        }, showTime)) : {}), picker === 'time' ? getTimeProps(_extends(_extends({
          format
        }, omit(restProps, ['disabledTime'])), {
          picker
        })) : {});
        const pre = prefixCls.value;
        const suffixNode = _createVNode(_Fragment, null, [suffixIcon || (picker === 'time' ? _createVNode(ClockCircleOutlined, null, null) : _createVNode(CalendarOutlined, null, null)), formItemInputContext.hasFeedback && formItemInputContext.feedbackIcon]);
        return wrapSSR(_createVNode(VCRangePicker, _objectSpread(_objectSpread(_objectSpread({
          "dateRender": dateRender,
          "renderExtraFooter": renderExtraFooter,
          "separator": separator || _createVNode("span", {
            "aria-label": "to",
            "class": `${pre}-separator`
          }, [_createVNode(SwapRightOutlined, null, null)]),
          "ref": pickerRef,
          "dropdownAlign": transPlacement2DropdownAlign(direction.value, props.placement),
          "placeholder": getRangePlaceholder(locale, picker, placeholder),
          "suffixIcon": suffixNode,
          "clearIcon": clearIcon || _createVNode(CloseCircleFilled, null, null),
          "allowClear": allowClear,
          "transitionName": transitionName || `${rootPrefixCls.value}-slide-up`
        }, restProps), additionalOverrideProps), {}, {
          "disabled": disabled.value,
          "id": id,
          "value": value.value,
          "defaultValue": defaultValue.value,
          "defaultPickerValue": defaultPickerValue.value,
          "picker": picker,
          "class": classNames({
            [`${pre}-${mergedSize.value}`]: mergedSize.value,
            [`${pre}-borderless`]: !bordered
          }, getStatusClassNames(pre, getMergedStatus(formItemInputContext.status, props.status), formItemInputContext.hasFeedback), attrs.class, hashId.value, compactItemClassnames.value),
          "locale": locale.lang,
          "prefixCls": pre,
          "getPopupContainer": attrs.getCalendarContainer || getPopupContainer.value,
          "generateConfig": generateConfig,
          "prevIcon": ((_d = slots.prevIcon) === null || _d === void 0 ? void 0 : _d.call(slots)) || _createVNode("span", {
            "class": `${pre}-prev-icon`
          }, null),
          "nextIcon": ((_e = slots.nextIcon) === null || _e === void 0 ? void 0 : _e.call(slots)) || _createVNode("span", {
            "class": `${pre}-next-icon`
          }, null),
          "superPrevIcon": ((_f = slots.superPrevIcon) === null || _f === void 0 ? void 0 : _f.call(slots)) || _createVNode("span", {
            "class": `${pre}-super-prev-icon`
          }, null),
          "superNextIcon": ((_g = slots.superNextIcon) === null || _g === void 0 ? void 0 : _g.call(slots)) || _createVNode("span", {
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
          "onOk": onOk,
          "onCalendarChange": onCalendarChange
        }), null));
      };
    }
  });
  return RangePicker;
}