"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateSinglePicker;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _CalendarOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CalendarOutlined"));
var _ClockCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ClockCircleOutlined"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _vcPicker = _interopRequireDefault(require("../../vc-picker"));
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _util = require("../util");
var _LocaleReceiver = require("../../locale-provider/LocaleReceiver");
var _ = require(".");
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _props2 = require("./props");
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _FormItemContext = require("../../form/FormItemContext");
var _statusUtils = require("../../_util/statusUtils");
var _Compact = require("../../space/Compact");
var _style = _interopRequireDefault(require("../style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

//CSSINJS

function generateSinglePicker(generateConfig, extraProps) {
  function getPicker(picker, displayName) {
    const comProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _props2.commonProps)()), (0, _props2.datePickerProps)()), extraProps);
    return (0, _vue.defineComponent)({
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
        const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
        const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
        // =================== Warning =====================
        if (process.env.NODE_ENV !== 'production') {
          (0, _devWarning.default)(picker !== 'quarter', displayName || 'DatePicker', `DatePicker.${displayName} is legacy usage. Please use DatePicker[picker='${picker}'] directly.`);
          (0, _devWarning.default)(!props.dropdownClassName, displayName || 'DatePicker', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
          (0, _devWarning.default)(!(props.monthCellContentRender || slots.monthCellContentRender), displayName || 'DatePicker', '`monthCellContentRender` is deprecated. Please use `monthCellRender"` instead.');
          (0, _devWarning.default)(!attrs.getCalendarContainer, displayName || 'DatePicker', '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.');
        }
        const {
          prefixCls,
          direction,
          getPopupContainer,
          size,
          rootPrefixCls,
          disabled
        } = (0, _useConfigInject.default)('picker', props);
        const {
          compactSize,
          compactItemClassnames
        } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
        const mergedSize = (0, _vue.computed)(() => compactSize.value || size.value);
        // style
        const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
        const pickerRef = (0, _vue.ref)();
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
        const [contextLocale] = (0, _LocaleReceiver.useLocaleReceiver)('DatePicker', _en_US.default);
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
        const defaultPickerValue = (0, _vue.computed)(() => {
          if (props.defaultPickerValue) {
            return props.valueFormat ? generateConfig.toDate(props.defaultPickerValue, props.valueFormat) : props.defaultPickerValue;
          }
          return props.defaultPickerValue === '' ? undefined : props.defaultPickerValue;
        });
        return () => {
          var _a, _b, _c, _d, _e, _f;
          const locale = (0, _extends2.default)((0, _extends2.default)({}, contextLocale.value), props.locale);
          const p = (0, _extends2.default)((0, _extends2.default)({}, props), attrs);
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
          additionalOverrideProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, additionalOverrideProps), showTime ? (0, _.getTimeProps)((0, _extends2.default)({
            format,
            picker: mergedPicker
          }, typeof showTime === 'object' ? showTime : {})) : {}), mergedPicker === 'time' ? (0, _.getTimeProps)((0, _extends2.default)((0, _extends2.default)({
            format
          }, restProps), {
            picker: mergedPicker
          })) : {});
          const pre = prefixCls.value;
          const suffixNode = (0, _vue.createVNode)(_vue.Fragment, null, [suffixIcon || (picker === 'time' ? (0, _vue.createVNode)(_ClockCircleOutlined.default, null, null) : (0, _vue.createVNode)(_CalendarOutlined.default, null, null)), formItemInputContext.hasFeedback && formItemInputContext.feedbackIcon]);
          return wrapSSR((0, _vue.createVNode)(_vcPicker.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
            "monthCellRender": monthCellRender,
            "dateRender": dateRender,
            "renderExtraFooter": renderExtraFooter,
            "ref": pickerRef,
            "placeholder": (0, _util.getPlaceholder)(locale, mergedPicker, placeholder),
            "suffixIcon": suffixNode,
            "dropdownAlign": (0, _util.transPlacement2DropdownAlign)(direction.value, props.placement),
            "clearIcon": clearIcon || (0, _vue.createVNode)(_CloseCircleFilled.default, null, null),
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
            "class": (0, _classNames.default)({
              [`${pre}-${mergedSize.value}`]: mergedSize.value,
              [`${pre}-borderless`]: !bordered
            }, (0, _statusUtils.getStatusClassNames)(pre, (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status), formItemInputContext.hasFeedback), attrs.class, hashId.value, compactItemClassnames.value),
            "disabled": disabled.value,
            "prefixCls": pre,
            "getPopupContainer": attrs.getCalendarContainer || getPopupContainer.value,
            "generateConfig": generateConfig,
            "prevIcon": ((_c = slots.prevIcon) === null || _c === void 0 ? void 0 : _c.call(slots)) || (0, _vue.createVNode)("span", {
              "class": `${pre}-prev-icon`
            }, null),
            "nextIcon": ((_d = slots.nextIcon) === null || _d === void 0 ? void 0 : _d.call(slots)) || (0, _vue.createVNode)("span", {
              "class": `${pre}-next-icon`
            }, null),
            "superPrevIcon": ((_e = slots.superPrevIcon) === null || _e === void 0 ? void 0 : _e.call(slots)) || (0, _vue.createVNode)("span", {
              "class": `${pre}-super-prev-icon`
            }, null),
            "superNextIcon": ((_f = slots.superNextIcon) === null || _f === void 0 ? void 0 : _f.call(slots)) || (0, _vue.createVNode)("span", {
              "class": `${pre}-super-next-icon`
            }, null),
            "components": _.Components,
            "direction": direction.value,
            "dropdownClassName": (0, _classNames.default)(hashId.value, props.popupClassName, props.dropdownClassName),
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