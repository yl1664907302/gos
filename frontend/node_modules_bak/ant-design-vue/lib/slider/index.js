"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sliderProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Slider = _interopRequireDefault(require("../vc-slider/src/Slider"));
var _Range = _interopRequireDefault(require("../vc-slider/src/Range"));
var _Handle = _interopRequireDefault(require("../vc-slider/src/Handle"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _SliderTooltip = _interopRequireDefault(require("./SliderTooltip"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _FormItemContext = require("../form/FormItemContext");
var _style = _interopRequireDefault(require("./style"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

const defaultTipFormatter = value => typeof value === 'number' ? value.toString() : '';
const sliderProps = () => ({
  id: String,
  prefixCls: String,
  tooltipPrefixCls: String,
  range: (0, _type.someType)([Boolean, Object]),
  reverse: (0, _type.booleanType)(),
  min: Number,
  max: Number,
  step: (0, _type.someType)([Object, Number]),
  marks: (0, _type.objectType)(),
  dots: (0, _type.booleanType)(),
  value: (0, _type.someType)([Array, Number]),
  defaultValue: (0, _type.someType)([Array, Number]),
  included: (0, _type.booleanType)(),
  disabled: (0, _type.booleanType)(),
  vertical: (0, _type.booleanType)(),
  tipFormatter: (0, _type.someType)([Function, Object], () => defaultTipFormatter),
  tooltipOpen: (0, _type.booleanType)(),
  /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
  tooltipVisible: (0, _type.booleanType)(),
  tooltipPlacement: (0, _type.stringType)(),
  getTooltipPopupContainer: (0, _type.functionType)(),
  autofocus: (0, _type.booleanType)(),
  handleStyle: (0, _type.someType)([Array, Object]),
  trackStyle: (0, _type.someType)([Array, Object]),
  onChange: (0, _type.functionType)(),
  onAfterChange: (0, _type.functionType)(),
  onFocus: (0, _type.functionType)(),
  onBlur: (0, _type.functionType)(),
  'onUpdate:value': (0, _type.functionType)()
});
exports.sliderProps = sliderProps;
const Slider = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASlider',
  inheritAttrs: false,
  props: sliderProps(),
  // emits: ['update:value', 'change', 'afterChange', 'blur'],
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit,
      expose
    } = _ref;
    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      [['tooltipVisible', 'tooltipOpen']].forEach(_ref2 => {
        let [deprecatedName, newName] = _ref2;
        (0, _devWarning.default)(props.tooltipVisible === undefined, 'Slider', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`);
      });
    }
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      getPopupContainer,
      configProvider
    } = (0, _useConfigInject.default)('slider', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const sliderRef = (0, _vue.ref)();
    const visibles = (0, _vue.ref)({});
    const toggleTooltipOpen = (index, visible) => {
      visibles.value[index] = visible;
    };
    const tooltipPlacement = (0, _vue.computed)(() => {
      if (props.tooltipPlacement) {
        return props.tooltipPlacement;
      }
      if (!props.vertical) {
        return 'top';
      }
      return direction.value === 'rtl' ? 'left' : 'right';
    });
    const focus = () => {
      var _a;
      (_a = sliderRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = sliderRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    const handleChange = val => {
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = e => {
      emit('blur', e);
    };
    expose({
      focus,
      blur
    });
    const handleWithTooltip = _a => {
      var {
          tooltipPrefixCls
        } = _a,
        _b = _a.info,
        {
          value,
          dragging,
          index
        } = _b,
        restProps = __rest(_b, ["value", "dragging", "index"]);
      const {
        tipFormatter,
        tooltipOpen = props.tooltipVisible,
        getTooltipPopupContainer
      } = props;
      const isTipFormatter = tipFormatter ? visibles.value[index] || dragging : false;
      const open = tooltipOpen || tooltipOpen === undefined && isTipFormatter;
      return (0, _vue.createVNode)(_SliderTooltip.default, {
        "prefixCls": tooltipPrefixCls,
        "title": tipFormatter ? tipFormatter(value) : '',
        "open": open,
        "placement": tooltipPlacement.value,
        "transitionName": `${rootPrefixCls.value}-zoom-down`,
        "key": index,
        "overlayClassName": `${prefixCls.value}-tooltip`,
        "getPopupContainer": getTooltipPopupContainer || (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value)
      }, {
        default: () => [(0, _vue.createVNode)(_Handle.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), {}, {
          "value": value,
          "onMouseenter": () => toggleTooltipOpen(index, true),
          "onMouseleave": () => toggleTooltipOpen(index, false)
        }), null)]
      });
    };
    return () => {
      const {
          tooltipPrefixCls: customizeTooltipPrefixCls,
          range,
          id = formItemContext.id.value
        } = props,
        restProps = __rest(props, ["tooltipPrefixCls", "range", "id"]);
      const tooltipPrefixCls = configProvider.getPrefixCls('tooltip', customizeTooltipPrefixCls);
      const cls = (0, _classNames.default)(attrs.class, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, hashId.value);
      // make reverse default on rtl direction
      if (direction.value === 'rtl' && !restProps.vertical) {
        restProps.reverse = !restProps.reverse;
      }
      // extrack draggableTrack from range={{ ... }}
      let draggableTrack;
      if (typeof range === 'object') {
        draggableTrack = range.draggableTrack;
      }
      if (range) {
        return wrapSSR((0, _vue.createVNode)(_Range.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), restProps), {}, {
          "step": restProps.step,
          "draggableTrack": draggableTrack,
          "class": cls,
          "ref": sliderRef,
          "handle": info => handleWithTooltip({
            tooltipPrefixCls,
            prefixCls: prefixCls.value,
            info
          }),
          "prefixCls": prefixCls.value,
          "onChange": handleChange,
          "onBlur": handleBlur
        }), {
          mark: slots.mark
        }));
      }
      return wrapSSR((0, _vue.createVNode)(_Slider.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), restProps), {}, {
        "id": id,
        "step": restProps.step,
        "class": cls,
        "ref": sliderRef,
        "handle": info => handleWithTooltip({
          tooltipPrefixCls,
          prefixCls: prefixCls.value,
          info
        }),
        "prefixCls": prefixCls.value,
        "onChange": handleChange,
        "onBlur": handleBlur
      }), {
        mark: slots.mark
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Slider);