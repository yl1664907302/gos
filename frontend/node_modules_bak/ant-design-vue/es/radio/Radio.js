import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent, ref } from 'vue';
import PropTypes from '../_util/vue-types';
import VcCheckbox from '../vc-checkbox/Checkbox';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import { useInjectRadioGroupContext, useInjectRadioOptionTypeContext } from './context';
import { booleanType, functionType } from '../_util/type';
// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
export const radioProps = () => ({
  prefixCls: String,
  checked: booleanType(),
  disabled: booleanType(),
  isGroup: booleanType(),
  value: PropTypes.any,
  name: String,
  id: String,
  autofocus: booleanType(),
  onChange: functionType(),
  onFocus: functionType(),
  onBlur: functionType(),
  onClick: functionType(),
  'onUpdate:checked': functionType(),
  'onUpdate:value': functionType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ARadio',
  inheritAttrs: false,
  props: radioProps(),
  setup(props, _ref) {
    let {
      emit,
      expose,
      slots,
      attrs
    } = _ref;
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const radioOptionTypeContext = useInjectRadioOptionTypeContext();
    const radioGroupContext = useInjectRadioGroupContext();
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    const vcCheckbox = ref();
    const {
      prefixCls: radioPrefixCls,
      direction,
      disabled
    } = useConfigInject('radio', props);
    const prefixCls = computed(() => (radioGroupContext === null || radioGroupContext === void 0 ? void 0 : radioGroupContext.optionType.value) === 'button' || radioOptionTypeContext === 'button' ? `${radioPrefixCls.value}-button` : radioPrefixCls.value);
    const contextDisabled = useInjectDisabled();
    // Style
    const [wrapSSR, hashId] = useStyle(radioPrefixCls);
    const focus = () => {
      vcCheckbox.value.focus();
    };
    const blur = () => {
      vcCheckbox.value.blur();
    };
    expose({
      focus,
      blur
    });
    const handleChange = event => {
      const targetChecked = event.target.checked;
      emit('update:checked', targetChecked);
      emit('update:value', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };
    const onChange = e => {
      emit('change', e);
      if (radioGroupContext && radioGroupContext.onChange) {
        radioGroupContext.onChange(e);
      }
    };
    return () => {
      var _a;
      const radioGroup = radioGroupContext;
      const {
          prefixCls: customizePrefixCls,
          id = formItemContext.id.value
        } = props,
        restProps = __rest(props, ["prefixCls", "id"]);
      const rProps = _extends(_extends({
        prefixCls: prefixCls.value,
        id
      }, omit(restProps, ['onUpdate:checked', 'onUpdate:value'])), {
        disabled: (_a = disabled.value) !== null && _a !== void 0 ? _a : contextDisabled.value
      });
      if (radioGroup) {
        rProps.name = radioGroup.name.value;
        rProps.onChange = onChange;
        rProps.checked = props.value === radioGroup.value.value;
        rProps.disabled = mergedDisabled.value || radioGroup.disabled.value;
      } else {
        rProps.onChange = handleChange;
      }
      const wrapperClassString = classNames({
        [`${prefixCls.value}-wrapper`]: true,
        [`${prefixCls.value}-wrapper-checked`]: rProps.checked,
        [`${prefixCls.value}-wrapper-disabled`]: rProps.disabled,
        [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.isFormItemInput
      }, attrs.class, hashId.value);
      return wrapSSR(_createVNode("label", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": wrapperClassString
      }), [_createVNode(VcCheckbox, _objectSpread(_objectSpread({}, rProps), {}, {
        "type": "radio",
        "ref": vcCheckbox
      }), null), slots.default && _createVNode("span", null, [slots.default()])]));
    };
  }
});