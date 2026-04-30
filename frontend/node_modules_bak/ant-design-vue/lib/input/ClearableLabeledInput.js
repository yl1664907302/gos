"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _vnode = require("../_util/vnode");
var _type = require("../_util/type");
var _util = require("./util");
var _FormItemContext = require("../form/FormItemContext");
var _statusUtils = require("../_util/statusUtils");
const ClearableInputType = ['text', 'input'];
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ClearableLabeledInput',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    inputType: _vueTypes.default.oneOf((0, _type.tuple)('text', 'input')),
    value: (0, _type.anyType)(),
    defaultValue: (0, _type.anyType)(),
    allowClear: {
      type: Boolean,
      default: undefined
    },
    element: (0, _type.anyType)(),
    handleReset: Function,
    disabled: {
      type: Boolean,
      default: undefined
    },
    direction: {
      type: String
    },
    size: {
      type: String
    },
    suffix: (0, _type.anyType)(),
    prefix: (0, _type.anyType)(),
    addonBefore: (0, _type.anyType)(),
    addonAfter: (0, _type.anyType)(),
    readonly: {
      type: Boolean,
      default: undefined
    },
    focused: {
      type: Boolean,
      default: undefined
    },
    bordered: {
      type: Boolean,
      default: true
    },
    triggerFocus: {
      type: Function
    },
    hidden: Boolean,
    status: String,
    hashId: String
  },
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const statusContext = _FormItemContext.FormItemInputContext.useInject();
    const renderClearIcon = prefixCls => {
      const {
        value,
        disabled,
        readonly,
        handleReset,
        suffix = slots.suffix
      } = props;
      const needClear = !disabled && !readonly && value;
      const className = `${prefixCls}-clear-icon`;
      return (0, _vue.createVNode)(_CloseCircleFilled.default, {
        "onClick": handleReset,
        "onMousedown": e => e.preventDefault(),
        "class": (0, _classNames.default)({
          [`${className}-hidden`]: !needClear,
          [`${className}-has-suffix`]: !!suffix
        }, className),
        "role": "button"
      }, null);
    };
    const renderTextAreaWithClearIcon = (prefixCls, element) => {
      const {
        value,
        allowClear,
        direction,
        bordered,
        hidden,
        status: customStatus,
        addonAfter = slots.addonAfter,
        addonBefore = slots.addonBefore,
        hashId
      } = props;
      const {
        status: contextStatus,
        hasFeedback
      } = statusContext;
      if (!allowClear) {
        return (0, _vnode.cloneElement)(element, {
          value,
          disabled: props.disabled
        });
      }
      const affixWrapperCls = (0, _classNames.default)(`${prefixCls}-affix-wrapper`, `${prefixCls}-affix-wrapper-textarea-with-clear-btn`, (0, _statusUtils.getStatusClassNames)(`${prefixCls}-affix-wrapper`, (0, _statusUtils.getMergedStatus)(contextStatus, customStatus), hasFeedback), {
        [`${prefixCls}-affix-wrapper-rtl`]: direction === 'rtl',
        [`${prefixCls}-affix-wrapper-borderless`]: !bordered,
        // className will go to addon wrapper
        [`${attrs.class}`]: !(0, _util.hasAddon)({
          addonAfter,
          addonBefore
        }) && attrs.class
      }, hashId);
      return (0, _vue.createVNode)("span", {
        "class": affixWrapperCls,
        "style": attrs.style,
        "hidden": hidden
      }, [(0, _vnode.cloneElement)(element, {
        style: null,
        value,
        disabled: props.disabled
      }), renderClearIcon(prefixCls)]);
    };
    return () => {
      var _a;
      const {
        prefixCls,
        inputType,
        element = (_a = slots.element) === null || _a === void 0 ? void 0 : _a.call(slots)
      } = props;
      if (inputType === ClearableInputType[0]) {
        return renderTextAreaWithClearIcon(prefixCls, element);
      }
      return null;
    };
  }
});