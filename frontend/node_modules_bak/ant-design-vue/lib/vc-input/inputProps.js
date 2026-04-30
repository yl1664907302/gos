"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputProps = exports.inputDefaultValue = exports.commonInputProps = exports.baseInputProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
const inputDefaultValue = exports.inputDefaultValue = Symbol();
const commonInputProps = () => {
  return {
    addonBefore: _vueTypes.default.any,
    addonAfter: _vueTypes.default.any,
    prefix: _vueTypes.default.any,
    suffix: _vueTypes.default.any,
    clearIcon: _vueTypes.default.any,
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
exports.commonInputProps = commonInputProps;
const baseInputProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, commonInputProps()), {
    value: {
      type: [String, Number, Symbol],
      default: undefined
    },
    defaultValue: {
      type: [String, Number, Symbol],
      default: undefined
    },
    inputElement: _vueTypes.default.any,
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
exports.baseInputProps = baseInputProps;
const inputProps = () => (0, _extends2.default)((0, _extends2.default)({}, baseInputProps()), {
  id: String,
  placeholder: {
    type: [String, Number]
  },
  autocomplete: String,
  type: (0, _type.stringType)('text'),
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
exports.inputProps = inputProps;