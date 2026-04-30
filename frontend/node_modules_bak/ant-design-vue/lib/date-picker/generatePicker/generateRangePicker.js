"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = generateRangePicker;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _CalendarOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CalendarOutlined"));
var _ClockCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ClockCircleOutlined"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _SwapRightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/SwapRightOutlined"));
var _vcPicker = require("../../vc-picker");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _LocaleReceiver = require("../../locale-provider/LocaleReceiver");
var _util = require("../util");
var _ = require(".");
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _props2 = require("./props");
var _FormItemContext = require("../../form/FormItemContext");
var _omit = _interopRequireDefault(require("../../_util/omit"));
var _statusUtils = require("../../_util/statusUtils");
var _style = _interopRequireDefault(require("../style"));
var _Compact = require("../../space/Compact");
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

//CSSINJS

function generateRangePicker(generateConfig, extraProps) {
  const RangePicker = (0, _vue.defineComponent)({
    compatConfig: {
      MODE: 3
    },
    name: 'ARangePicker',
    inheritAttrs: false,
    props: (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _props2.commonProps)()), (0, _props2.rangePickerProps)()), extraProps),
    slots: Object,
    setup(_props, _ref) {
      let {
        expose,
        slots,
        attrs,
        emit
      } = _ref;
      const props = _props;
      const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
      const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
      // =================== Warning =====================
      if (process.env.NODE_ENV !== 'production') {
        (0, _devWarning.default)(!props.dropdownClassName, 'RangePicker', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
        (0, _devWarning.default)(!attrs.getCalendarContainer, 'DatePicker', '`getCalendarContainer` is deprecated. Please use `getPopupContainer"` instead.');
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
      const [contextLocale] = (0, _LocaleReceiver.useLocaleReceiver)('DatePicker', _en_US.default);
      const value = (0, _vue.computed)(() => {
        if (props.value) {
          return props.valueFormat ? generateConfig.toDate(props.value, props.valueFormat) : props.value;
        }
        return props.value;
      });
      const defaultValue = (0, _vue.computed)(() => {
        if (props.defaultValue) {
          return props.valueFormat ? generateConfig.toDate(props.defaultValue, props.valueFormat) : props.defaultValue;
        }
        return props.defaultValue;
      });
      const defaultPickerValue = (0, _vue.computed)(() => {
        if (props.defaultPickerValue) {
          return props.valueFormat ? generateConfig.toDate(props.defaultPickerValue, props.valueFormat) : props.defaultPickerValue;
        }
        return props.defaultPickerValue;
      });
      return () => {
        var _a, _b, _c, _d, _e, _f, _g;
        const locale = (0, _extends2.default)((0, _extends2.default)({}, contextLocale.value), props.locale);
        const p = (0, _extends2.default)((0, _extends2.default)({}, props), attrs);
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
        additionalOverrideProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, additionalOverrideProps), showTime ? (0, _.getTimeProps)((0, _extends2.default)({
          format,
          picker
        }, showTime)) : {}), picker === 'time' ? (0, _.getTimeProps)((0, _extends2.default)((0, _extends2.default)({
          format
        }, (0, _omit.default)(restProps, ['disabledTime'])), {
          picker
        })) : {});
        const pre = prefixCls.value;
        const suffixNode = (0, _vue.createVNode)(_vue.Fragment, null, [suffixIcon || (picker === 'time' ? (0, _vue.createVNode)(_ClockCircleOutlined.default, null, null) : (0, _vue.createVNode)(_CalendarOutlined.default, null, null)), formItemInputContext.hasFeedback && formItemInputContext.feedbackIcon]);
        return wrapSSR((0, _vue.createVNode)(_vcPicker.RangePicker, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
          "dateRender": dateRender,
          "renderExtraFooter": renderExtraFooter,
          "separator": separator || (0, _vue.createVNode)("span", {
            "aria-label": "to",
            "class": `${pre}-separator`
          }, [(0, _vue.createVNode)(_SwapRightOutlined.default, null, null)]),
          "ref": pickerRef,
          "dropdownAlign": (0, _util.transPlacement2DropdownAlign)(direction.value, props.placement),
          "placeholder": (0, _util.getRangePlaceholder)(locale, picker, placeholder),
          "suffixIcon": suffixNode,
          "clearIcon": clearIcon || (0, _vue.createVNode)(_CloseCircleFilled.default, null, null),
          "allowClear": allowClear,
          "transitionName": transitionName || `${rootPrefixCls.value}-slide-up`
        }, restProps), additionalOverrideProps), {}, {
          "disabled": disabled.value,
          "id": id,
          "value": value.value,
          "defaultValue": defaultValue.value,
          "defaultPickerValue": defaultPickerValue.value,
          "picker": picker,
          "class": (0, _classNames.default)({
            [`${pre}-${mergedSize.value}`]: mergedSize.value,
            [`${pre}-borderless`]: !bordered
          }, (0, _statusUtils.getStatusClassNames)(pre, (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status), formItemInputContext.hasFeedback), attrs.class, hashId.value, compactItemClassnames.value),
          "locale": locale.lang,
          "prefixCls": pre,
          "getPopupContainer": attrs.getCalendarContainer || getPopupContainer.value,
          "generateConfig": generateConfig,
          "prevIcon": ((_d = slots.prevIcon) === null || _d === void 0 ? void 0 : _d.call(slots)) || (0, _vue.createVNode)("span", {
            "class": `${pre}-prev-icon`
          }, null),
          "nextIcon": ((_e = slots.nextIcon) === null || _e === void 0 ? void 0 : _e.call(slots)) || (0, _vue.createVNode)("span", {
            "class": `${pre}-next-icon`
          }, null),
          "superPrevIcon": ((_f = slots.superPrevIcon) === null || _f === void 0 ? void 0 : _f.call(slots)) || (0, _vue.createVNode)("span", {
            "class": `${pre}-super-prev-icon`
          }, null),
          "superNextIcon": ((_g = slots.superNextIcon) === null || _g === void 0 ? void 0 : _g.call(slots)) || (0, _vue.createVNode)("span", {
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
          "onOk": onOk,
          "onCalendarChange": onCalendarChange
        }), null));
      };
    }
  });
  return RangePicker;
}