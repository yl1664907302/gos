import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from '../_util/vue-types';
import { stringType } from '../_util/type';
export const inputDefaultValue = Symbol();
export const commonInputProps = () => {
  return {
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
    clearIcon: PropTypes.any,
    affixWrapperClassName: String,
    groupClassName: String,
    wrapperClassName: String,
    inputClassName: String,
    allowClear: {
      type: Boolean,
      default: undefined
    }
  };
};
export const baseInputProps = () => {
  return _extends(_extends({}, commonInputProps()), {
    value: {
      type: [String, Number, Symbol],
      default: undefined
    },
    defaultValue: {
      type: [String, Number, Symbol],
      default: undefined
    },
    inputElement: PropTypes.any,
    prefixCls: String,
    disabled: {
      type: Boolean,
      default: undefined
    },
    focused: {
      type: Boolean,
      default: undefined
    },
    triggerFocus: Function,
    readonly: {
      type: Boolean,
      default: undefined
    },
    handleReset: Function,
    hidden: {
      type: Boolean,
      default: undefined
    }
  });
};
export const inputProps = () => _extends(_extends({}, baseInputProps()), {
  id: String,
  placeholder: {
    type: [String, Number]
  },
  autocomplete: String,
  type: stringType('text'),
  name: String,
  size: {
    type: String
  },
  autofocus: {
    type: Boolean,
    default: undefined
  },
  lazy: {
    type: Boolean,
    default: true
  },
  maxlength: Number,
  loading: {
    type: Boolean,
    default: undefined
  },
  bordered: {
    type: Boolean,
    default: undefined
  },
  showCount: {
    type: [Boolean, Object]
  },
  htmlSize: Number,
  onPressEnter: Function,
  onKeydown: Function,
  onKeyup: Function,
  onFocus: Function,
  onBlur: Function,
  onChange: Function,
  onInput: Function,
  'onUpdate:value': Function,
  onCompositionstart: Function,
  onCompositionend: Function,
  valueModifiers: Object,
  hidden: {
    type: Boolean,
    default: undefined
  },
  status: String
});