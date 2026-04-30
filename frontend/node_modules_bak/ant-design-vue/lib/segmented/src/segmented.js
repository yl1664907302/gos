"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.segmentedProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _propsUtil = require("../../_util/props-util");
var _style = _interopRequireDefault(require("../style"));
var _type = require("../../_util/type");
var _MotionThumb = _interopRequireDefault(require("./MotionThumb"));
function normalizeOptions(options) {
  return options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return option;
    }
    return {
      label: option === null || option === void 0 ? void 0 : option.toString(),
      title: option === null || option === void 0 ? void 0 : option.toString(),
      value: option
    };
  });
}
const segmentedProps = () => {
  return {
    prefixCls: String,
    options: (0, _type.arrayType)(),
    block: (0, _type.booleanType)(),
    disabled: (0, _type.booleanType)(),
    size: (0, _type.stringType)(),
    value: (0, _extends2.default)((0, _extends2.default)({}, (0, _type.someType)([String, Number])), {
      required: true
    }),
    motionName: String,
    onChange: (0, _type.functionType)(),
    'onUpdate:value': (0, _type.functionType)()
  };
};
exports.segmentedProps = segmentedProps;
const SegmentedOption = (props, _ref) => {
  let {
    slots,
    emit
  } = _ref;
  const {
    value,
    disabled,
    payload,
    title,
    prefixCls,
    label = slots.label,
    checked,
    className
  } = props;
  const handleChange = event => {
    if (disabled) {
      return;
    }
    emit('change', event, value);
  };
  return (0, _vue.createVNode)("label", {
    "class": (0, _classNames.default)({
      [`${prefixCls}-item-disabled`]: disabled
    }, className)
  }, [(0, _vue.createVNode)("input", {
    "class": `${prefixCls}-item-input`,
    "type": "radio",
    "disabled": disabled,
    "checked": checked,
    "onChange": handleChange
  }, null), (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-item-label`,
    "title": typeof title === 'string' ? title : ''
  }, [typeof label === 'function' ? label({
    value,
    disabled,
    payload,
    title
  }) : label !== null && label !== void 0 ? label : value])]);
};
SegmentedOption.inheritAttrs = false;
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'ASegmented',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(segmentedProps(), {
    options: [],
    motionName: 'thumb-motion'
  }),
  slots: Object,
  setup(props, _ref2) {
    let {
      emit,
      slots,
      attrs
    } = _ref2;
    const {
      prefixCls,
      direction,
      size
    } = (0, _useConfigInject.default)('segmented', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const rootRef = (0, _vue.shallowRef)();
    const thumbShow = (0, _vue.shallowRef)(false);
    const segmentedOptions = (0, _vue.computed)(() => normalizeOptions(props.options));
    const handleChange = (_event, val) => {
      if (props.disabled) {
        return;
      }
      emit('update:value', val);
      emit('change', val);
    };
    return () => {
      const pre = prefixCls.value;
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": (0, _classNames.default)(pre, {
          [hashId.value]: true,
          [`${pre}-block`]: props.block,
          [`${pre}-disabled`]: props.disabled,
          [`${pre}-lg`]: size.value == 'large',
          [`${pre}-sm`]: size.value == 'small',
          [`${pre}-rtl`]: direction.value === 'rtl'
        }, attrs.class),
        "ref": rootRef
      }), [(0, _vue.createVNode)("div", {
        "class": `${pre}-group`
      }, [(0, _vue.createVNode)(_MotionThumb.default, {
        "containerRef": rootRef,
        "prefixCls": pre,
        "value": props.value,
        "motionName": `${pre}-${props.motionName}`,
        "direction": direction.value,
        "getValueIndex": val => segmentedOptions.value.findIndex(n => n.value === val),
        "onMotionStart": () => {
          thumbShow.value = true;
        },
        "onMotionEnd": () => {
          thumbShow.value = false;
        }
      }, null), segmentedOptions.value.map(segmentedOption => (0, _vue.createVNode)(SegmentedOption, (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "key": segmentedOption.value,
        "prefixCls": pre,
        "checked": segmentedOption.value === props.value,
        "onChange": handleChange
      }, segmentedOption), {}, {
        "className": (0, _classNames.default)(segmentedOption.className, `${pre}-item`, {
          [`${pre}-item-selected`]: segmentedOption.value === props.value && !thumbShow.value
        }),
        "disabled": !!props.disabled || !!segmentedOption.disabled
      }), slots))])]));
    };
  }
});