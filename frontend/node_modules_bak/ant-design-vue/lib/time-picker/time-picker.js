"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timePickerProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _generatePicker = _interopRequireDefault(require("../date-picker/generatePicker"));
var _props = require("../date-picker/generatePicker/props");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _FormItemContext = require("../form/FormItemContext");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _type = require("../_util/type");
const timePickerProps = () => ({
  format: String,
  showNow: (0, _type.booleanType)(),
  showHour: (0, _type.booleanType)(),
  showMinute: (0, _type.booleanType)(),
  showSecond: (0, _type.booleanType)(),
  use12Hours: (0, _type.booleanType)(),
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  hideDisabledOptions: (0, _type.booleanType)(),
  popupClassName: String,
  status: (0, _type.stringType)()
});
exports.timePickerProps = timePickerProps;
function createTimePicker(generateConfig) {
  const DatePicker = (0, _generatePicker.default)(generateConfig, (0, _extends2.default)((0, _extends2.default)({}, timePickerProps()), {
    order: {
      type: Boolean,
      default: true
    }
  }));
  const {
    TimePicker: InternalTimePicker,
    RangePicker: InternalRangePicker
  } = DatePicker;
  const TimePicker = (0, _vue.defineComponent)({
    name: 'ATimePicker',
    inheritAttrs: false,
    props: (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _props.commonProps)()), (0, _props.datePickerProps)()), timePickerProps()), {
      addon: {
        type: Function
      }
    }),
    slots: Object,
    setup(p, _ref) {
      let {
        slots,
        expose,
        emit,
        attrs
      } = _ref;
      const props = p;
      const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
      (0, _devWarning.default)(!(slots.addon || props.addon), 'TimePicker', '`addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.');
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
      const onChange = (value, dateString) => {
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
      const onOk = value => {
        emit('ok', value);
      };
      return () => {
        const {
          id = formItemContext.id.value
        } = props;
        //restProps.addon
        return (0, _vue.createVNode)(InternalTimePicker, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), (0, _omit.default)(props, ['onUpdate:value', 'onUpdate:open'])), {}, {
          "id": id,
          "dropdownClassName": props.popupClassName,
          "mode": undefined,
          "ref": pickerRef,
          "renderExtraFooter": props.addon || slots.addon || props.renderExtraFooter || slots.renderExtraFooter,
          "onChange": onChange,
          "onOpenChange": onOpenChange,
          "onFocus": onFocus,
          "onBlur": onBlur,
          "onOk": onOk
        }), slots);
      };
    }
  });
  const TimeRangePicker = (0, _vue.defineComponent)({
    name: 'ATimeRangePicker',
    inheritAttrs: false,
    props: (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _props.commonProps)()), (0, _props.rangePickerProps)()), timePickerProps()), {
      order: {
        type: Boolean,
        default: true
      }
    }),
    slots: Object,
    setup(p, _ref2) {
      let {
        slots,
        expose,
        emit,
        attrs
      } = _ref2;
      const props = p;
      const pickerRef = (0, _vue.ref)();
      const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
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
      const onChange = (values, dateStrings) => {
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
      const onPanelChange = (values, modes) => {
        emit('panelChange', values, modes);
      };
      const onOk = values => {
        emit('ok', values);
      };
      const onCalendarChange = (values, dateStrings, info) => {
        emit('calendarChange', values, dateStrings, info);
      };
      return () => {
        const {
          id = formItemContext.id.value
        } = props;
        return (0, _vue.createVNode)(InternalRangePicker, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), (0, _omit.default)(props, ['onUpdate:open', 'onUpdate:value'])), {}, {
          "id": id,
          "dropdownClassName": props.popupClassName,
          "picker": "time",
          "mode": undefined,
          "ref": pickerRef,
          "onChange": onChange,
          "onOpenChange": onOpenChange,
          "onFocus": onFocus,
          "onBlur": onBlur,
          "onPanelChange": onPanelChange,
          "onOk": onOk,
          "onCalendarChange": onCalendarChange
        }), slots);
      };
    }
  });
  return {
    TimePicker,
    TimeRangePicker
  };
}
var _default = exports.default = createTimePicker;