import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { defineComponent, ref } from 'vue';
import generatePicker from '../date-picker/generatePicker';
import { commonProps, datePickerProps, rangePickerProps } from '../date-picker/generatePicker/props';
import devWarning from '../vc-util/devWarning';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import { booleanType, stringType } from '../_util/type';
export const timePickerProps = () => ({
  format: String,
  showNow: booleanType(),
  showHour: booleanType(),
  showMinute: booleanType(),
  showSecond: booleanType(),
  use12Hours: booleanType(),
  hourStep: Number,
  minuteStep: Number,
  secondStep: Number,
  hideDisabledOptions: booleanType(),
  popupClassName: String,
  status: stringType()
});
function createTimePicker(generateConfig) {
  const DatePicker = generatePicker(generateConfig, _extends(_extends({}, timePickerProps()), {
    order: {
      type: Boolean,
      default: true
    }
  }));
  const {
    TimePicker: InternalTimePicker,
    RangePicker: InternalRangePicker
  } = DatePicker;
  const TimePicker = defineComponent({
    name: 'ATimePicker',
    inheritAttrs: false,
    props: _extends(_extends(_extends(_extends({}, commonProps()), datePickerProps()), timePickerProps()), {
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
      const formItemContext = useInjectFormItemContext();
      devWarning(!(slots.addon || props.addon), 'TimePicker', '`addon` is deprecated. Please use `v-slot:renderExtraFooter` instead.');
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
        return _createVNode(InternalTimePicker, _objectSpread(_objectSpread(_objectSpread({}, attrs), omit(props, ['onUpdate:value', 'onUpdate:open'])), {}, {
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
  const TimeRangePicker = defineComponent({
    name: 'ATimeRangePicker',
    inheritAttrs: false,
    props: _extends(_extends(_extends(_extends({}, commonProps()), rangePickerProps()), timePickerProps()), {
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
      const pickerRef = ref();
      const formItemContext = useInjectFormItemContext();
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
        return _createVNode(InternalRangePicker, _objectSpread(_objectSpread(_objectSpread({}, attrs), omit(props, ['onUpdate:open', 'onUpdate:value'])), {}, {
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
export default createTimePicker;