import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { defineComponent, shallowRef, computed } from 'vue';
import classNames from '../../_util/classNames';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { initDefaultProps } from '../../_util/props-util';
import useStyle from '../style';
import { functionType, someType, arrayType, booleanType, stringType } from '../../_util/type';
import MotionThumb from './MotionThumb';
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
export const segmentedProps = () => {
  return {
    prefixCls: String,
    options: arrayType(),
    block: booleanType(),
    disabled: booleanType(),
    size: stringType(),
    value: _extends(_extends({}, someType([String, Number])), {
      required: true
    }),
    motionName: String,
    onChange: functionType(),
    'onUpdate:value': functionType()
  };
};
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
  return _createVNode("label", {
    "class": classNames({
      [`${prefixCls}-item-disabled`]: disabled
    }, className)
  }, [_createVNode("input", {
    "class": `${prefixCls}-item-input`,
    "type": "radio",
    "disabled": disabled,
    "checked": checked,
    "onChange": handleChange
  }, null), _createVNode("div", {
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
export default defineComponent({
  name: 'ASegmented',
  inheritAttrs: false,
  props: initDefaultProps(segmentedProps(), {
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
    } = useConfigInject('segmented', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootRef = shallowRef();
    const thumbShow = shallowRef(false);
    const segmentedOptions = computed(() => normalizeOptions(props.options));
    const handleChange = (_event, val) => {
      if (props.disabled) {
        return;
      }
      emit('update:value', val);
      emit('change', val);
    };
    return () => {
      const pre = prefixCls.value;
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": classNames(pre, {
          [hashId.value]: true,
          [`${pre}-block`]: props.block,
          [`${pre}-disabled`]: props.disabled,
          [`${pre}-lg`]: size.value == 'large',
          [`${pre}-sm`]: size.value == 'small',
          [`${pre}-rtl`]: direction.value === 'rtl'
        }, attrs.class),
        "ref": rootRef
      }), [_createVNode("div", {
        "class": `${pre}-group`
      }, [_createVNode(MotionThumb, {
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
      }, null), segmentedOptions.value.map(segmentedOption => _createVNode(SegmentedOption, _objectSpread(_objectSpread({
        "key": segmentedOption.value,
        "prefixCls": pre,
        "checked": segmentedOption.value === props.value,
        "onChange": handleChange
      }, segmentedOption), {}, {
        "className": classNames(segmentedOption.className, `${pre}-item`, {
          [`${pre}-item-selected`]: segmentedOption.value === props.value && !thumbShow.value
        }),
        "disabled": !!props.disabled || !!segmentedOption.disabled
      }), slots))])]));
    };
  }
});