import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { watch, defineComponent, shallowRef, computed } from 'vue';
import classNames from '../_util/classNames';
import UpOutlined from "@ant-design/icons-vue/es/icons/UpOutlined";
import DownOutlined from "@ant-design/icons-vue/es/icons/DownOutlined";
import VcInputNumber, { inputNumberProps as baseInputNumberProps } from './src/InputNumber';
import { FormItemInputContext, NoFormStatus, useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { cloneElement } from '../_util/vnode';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import isValidValue from '../_util/isValidValue';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { booleanType, stringType } from '../_util/type';
// CSSINJS
import useStyle from './style';
import { NoCompactStyle, useCompactItemContext } from '../space/Compact';
import { useInjectDisabled } from '../config-provider/DisabledContext';
const baseProps = baseInputNumberProps();
export const inputNumberProps = () => _extends(_extends({}, baseProps), {
  size: stringType(),
  bordered: booleanType(true),
  placeholder: String,
  name: String,
  id: String,
  type: String,
  addonBefore: PropTypes.any,
  addonAfter: PropTypes.any,
  prefix: PropTypes.any,
  'onUpdate:value': baseProps.onChange,
  valueModifiers: Object,
  status: stringType()
});
const InputNumber = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputNumber',
  inheritAttrs: false,
  props: inputNumberProps(),
  // emits: ['focus', 'blur', 'change', 'input', 'update:value'],
  slots: Object,
  setup(props, _ref) {
    let {
      emit,
      expose,
      attrs,
      slots
    } = _ref;
    var _a;
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const {
      prefixCls,
      size,
      direction,
      disabled
    } = useConfigInject('input-number', props);
    const {
      compactSize,
      compactItemClassnames
    } = useCompactItemContext(prefixCls, direction);
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedSize = computed(() => compactSize.value || size.value);
    const mergedValue = shallowRef((_a = props.value) !== null && _a !== void 0 ? _a : props.defaultValue);
    const focused = shallowRef(false);
    watch(() => props.value, () => {
      mergedValue.value = props.value;
    });
    const inputNumberRef = shallowRef(null);
    const focus = () => {
      var _a;
      (_a = inputNumberRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputNumberRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    const handleChange = val => {
      if (props.value === undefined) {
        mergedValue.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const handleBlur = e => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const handleFocus = e => {
      focused.value = true;
      emit('focus', e);
    };
    return () => {
      var _a, _b, _c, _d;
      const {
        hasFeedback,
        isFormItemInput,
        feedbackIcon
      } = formItemInputContext;
      const id = (_a = props.id) !== null && _a !== void 0 ? _a : formItemContext.id.value;
      const _e = _extends(_extends(_extends({}, attrs), props), {
          id,
          disabled: mergedDisabled.value
        }),
        {
          class: className,
          bordered,
          readonly,
          style,
          addonBefore = (_b = slots.addonBefore) === null || _b === void 0 ? void 0 : _b.call(slots),
          addonAfter = (_c = slots.addonAfter) === null || _c === void 0 ? void 0 : _c.call(slots),
          prefix = (_d = slots.prefix) === null || _d === void 0 ? void 0 : _d.call(slots),
          valueModifiers = {}
        } = _e,
        others = __rest(_e, ["class", "bordered", "readonly", "style", "addonBefore", "addonAfter", "prefix", "valueModifiers"]);
      const preCls = prefixCls.value;
      const inputNumberClass = classNames({
        [`${preCls}-lg`]: mergedSize.value === 'large',
        [`${preCls}-sm`]: mergedSize.value === 'small',
        [`${preCls}-rtl`]: direction.value === 'rtl',
        [`${preCls}-readonly`]: readonly,
        [`${preCls}-borderless`]: !bordered,
        [`${preCls}-in-form-item`]: isFormItemInput
      }, getStatusClassNames(preCls, mergedStatus.value), className, compactItemClassnames.value, hashId.value);
      let element = _createVNode(VcInputNumber, _objectSpread(_objectSpread({}, omit(others, ['size', 'defaultValue'])), {}, {
        "ref": inputNumberRef,
        "lazy": !!valueModifiers.lazy,
        "value": mergedValue.value,
        "class": inputNumberClass,
        "prefixCls": preCls,
        "readonly": readonly,
        "onChange": handleChange,
        "onBlur": handleBlur,
        "onFocus": handleFocus
      }), {
        upHandler: slots.upIcon ? () => _createVNode("span", {
          "class": `${preCls}-handler-up-inner`
        }, [slots.upIcon()]) : () => _createVNode(UpOutlined, {
          "class": `${preCls}-handler-up-inner`
        }, null),
        downHandler: slots.downIcon ? () => _createVNode("span", {
          "class": `${preCls}-handler-down-inner`
        }, [slots.downIcon()]) : () => _createVNode(DownOutlined, {
          "class": `${preCls}-handler-down-inner`
        }, null)
      });
      const hasAddon = isValidValue(addonBefore) || isValidValue(addonAfter);
      const hasPrefix = isValidValue(prefix);
      if (hasPrefix || hasFeedback) {
        const affixWrapperCls = classNames(`${preCls}-affix-wrapper`, getStatusClassNames(`${preCls}-affix-wrapper`, mergedStatus.value, hasFeedback), {
          [`${preCls}-affix-wrapper-focused`]: focused.value,
          [`${preCls}-affix-wrapper-disabled`]: mergedDisabled.value,
          [`${preCls}-affix-wrapper-sm`]: mergedSize.value === 'small',
          [`${preCls}-affix-wrapper-lg`]: mergedSize.value === 'large',
          [`${preCls}-affix-wrapper-rtl`]: direction.value === 'rtl',
          [`${preCls}-affix-wrapper-readonly`]: readonly,
          [`${preCls}-affix-wrapper-borderless`]: !bordered,
          // className will go to addon wrapper
          [`${className}`]: !hasAddon && className
        }, hashId.value);
        element = _createVNode("div", {
          "class": affixWrapperCls,
          "style": style,
          "onClick": focus
        }, [hasPrefix && _createVNode("span", {
          "class": `${preCls}-prefix`
        }, [prefix]), element, hasFeedback && _createVNode("span", {
          "class": `${preCls}-suffix`
        }, [feedbackIcon])]);
      }
      if (hasAddon) {
        const wrapperClassName = `${preCls}-group`;
        const addonClassName = `${wrapperClassName}-addon`;
        const addonBeforeNode = addonBefore ? _createVNode("div", {
          "class": addonClassName
        }, [addonBefore]) : null;
        const addonAfterNode = addonAfter ? _createVNode("div", {
          "class": addonClassName
        }, [addonAfter]) : null;
        const mergedWrapperClassName = classNames(`${preCls}-wrapper`, wrapperClassName, {
          [`${wrapperClassName}-rtl`]: direction.value === 'rtl'
        }, hashId.value);
        const mergedGroupClassName = classNames(`${preCls}-group-wrapper`, {
          [`${preCls}-group-wrapper-sm`]: mergedSize.value === 'small',
          [`${preCls}-group-wrapper-lg`]: mergedSize.value === 'large',
          [`${preCls}-group-wrapper-rtl`]: direction.value === 'rtl'
        }, getStatusClassNames(`${prefixCls}-group-wrapper`, mergedStatus.value, hasFeedback), className, hashId.value);
        element = _createVNode("div", {
          "class": mergedGroupClassName,
          "style": style
        }, [_createVNode("div", {
          "class": mergedWrapperClassName
        }, [addonBeforeNode && _createVNode(NoCompactStyle, null, {
          default: () => [_createVNode(NoFormStatus, null, {
            default: () => [addonBeforeNode]
          })]
        }), element, addonAfterNode && _createVNode(NoCompactStyle, null, {
          default: () => [_createVNode(NoFormStatus, null, {
            default: () => [addonAfterNode]
          })]
        })])]);
      }
      return wrapSSR(cloneElement(element, {
        style
      }));
    };
  }
});
export default _extends(InputNumber, {
  install: app => {
    app.component(InputNumber.name, InputNumber);
    return app;
  }
});