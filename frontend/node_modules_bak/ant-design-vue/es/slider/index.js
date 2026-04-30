import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, ref, defineComponent } from 'vue';
import VcSlider from '../vc-slider/src/Slider';
import VcRange from '../vc-slider/src/Range';
import VcHandle from '../vc-slider/src/Handle';
import { stringType, booleanType, someType, objectType, withInstall, functionType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import SliderTooltip from './SliderTooltip';
import classNames from '../_util/classNames';
import { useInjectFormItemContext } from '../form/FormItemContext';
// CSSINJS
import useStyle from './style';
import devWarning from '../vc-util/devWarning';
const defaultTipFormatter = value => typeof value === 'number' ? value.toString() : '';
export const sliderProps = () => ({
  id: String,
  prefixCls: String,
  tooltipPrefixCls: String,
  range: someType([Boolean, Object]),
  reverse: booleanType(),
  min: Number,
  max: Number,
  step: someType([Object, Number]),
  marks: objectType(),
  dots: booleanType(),
  value: someType([Array, Number]),
  defaultValue: someType([Array, Number]),
  included: booleanType(),
  disabled: booleanType(),
  vertical: booleanType(),
  tipFormatter: someType([Function, Object], () => defaultTipFormatter),
  tooltipOpen: booleanType(),
  /** @deprecated `tooltipVisible` is deprecated. Please use `tooltipOpen` instead. */
  tooltipVisible: booleanType(),
  tooltipPlacement: stringType(),
  getTooltipPopupContainer: functionType(),
  autofocus: booleanType(),
  handleStyle: someType([Array, Object]),
  trackStyle: someType([Array, Object]),
  onChange: functionType(),
  onAfterChange: functionType(),
  onFocus: functionType(),
  onBlur: functionType(),
  'onUpdate:value': functionType()
});
const Slider = defineComponent({
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
        devWarning(props.tooltipVisible === undefined, 'Slider', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`);
      });
    }
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      getPopupContainer,
      configProvider
    } = useConfigInject('slider', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const formItemContext = useInjectFormItemContext();
    const sliderRef = ref();
    const visibles = ref({});
    const toggleTooltipOpen = (index, visible) => {
      visibles.value[index] = visible;
    };
    const tooltipPlacement = computed(() => {
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
      return _createVNode(SliderTooltip, {
        "prefixCls": tooltipPrefixCls,
        "title": tipFormatter ? tipFormatter(value) : '',
        "open": open,
        "placement": tooltipPlacement.value,
        "transitionName": `${rootPrefixCls.value}-zoom-down`,
        "key": index,
        "overlayClassName": `${prefixCls.value}-tooltip`,
        "getPopupContainer": getTooltipPopupContainer || (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value)
      }, {
        default: () => [_createVNode(VcHandle, _objectSpread(_objectSpread({}, restProps), {}, {
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
      const cls = classNames(attrs.class, {
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
        return wrapSSR(_createVNode(VcRange, _objectSpread(_objectSpread(_objectSpread({}, attrs), restProps), {}, {
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
      return wrapSSR(_createVNode(VcSlider, _objectSpread(_objectSpread(_objectSpread({}, attrs), restProps), {}, {
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
export default withInstall(Slider);