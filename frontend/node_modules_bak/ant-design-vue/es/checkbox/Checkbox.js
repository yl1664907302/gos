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
import { computed, watchEffect, onMounted, defineComponent, inject, onBeforeUnmount, ref } from 'vue';
import classNames from '../_util/classNames';
import VcCheckbox from '../vc-checkbox/Checkbox';
import { flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import { CheckboxGroupContextKey, checkboxProps } from './interface';
// CSSINJS
import useStyle from './style';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACheckbox',
  inheritAttrs: false,
  __ANT_CHECKBOX: true,
  props: checkboxProps(),
  // emits: ['change', 'update:checked'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      slots,
      expose
    } = _ref;
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const {
      prefixCls,
      direction,
      disabled
    } = useConfigInject('checkbox', props);
    const contextDisabled = useInjectDisabled();
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const checkboxGroup = inject(CheckboxGroupContextKey, undefined);
    const uniId = Symbol('checkboxUniId');
    const mergedDisabled = computed(() => {
      return (checkboxGroup === null || checkboxGroup === void 0 ? void 0 : checkboxGroup.disabled.value) || disabled.value;
    });
    watchEffect(() => {
      if (!props.skipGroup && checkboxGroup) {
        checkboxGroup.registerValue(uniId, props.value);
      }
    });
    onBeforeUnmount(() => {
      if (checkboxGroup) {
        checkboxGroup.cancelValue(uniId);
      }
    });
    onMounted(() => {
      warning(!!(props.checked !== undefined || checkboxGroup || props.value === undefined), 'Checkbox', '`value` is not validate prop, do you mean `checked`?');
    });
    const handleChange = event => {
      const targetChecked = event.target.checked;
      emit('update:checked', targetChecked);
      emit('change', event);
      formItemContext.onFieldChange();
    };
    const checkboxRef = ref();
    const focus = () => {
      var _a;
      (_a = checkboxRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = checkboxRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    return () => {
      var _a;
      const children = flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      const {
          indeterminate,
          skipGroup,
          id = formItemContext.id.value
        } = props,
        restProps = __rest(props, ["indeterminate", "skipGroup", "id"]);
      const {
          onMouseenter,
          onMouseleave,
          onInput,
          class: className,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["onMouseenter", "onMouseleave", "onInput", "class", "style"]);
      const checkboxProps = _extends(_extends(_extends(_extends({}, restProps), {
        id,
        prefixCls: prefixCls.value
      }), restAttrs), {
        disabled: mergedDisabled.value
      });
      if (checkboxGroup && !skipGroup) {
        checkboxProps.onChange = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          emit('change', ...args);
          checkboxGroup.toggleOption({
            label: children,
            value: props.value
          });
        };
        checkboxProps.name = checkboxGroup.name.value;
        checkboxProps.checked = checkboxGroup.mergedValue.value.includes(props.value);
        checkboxProps.disabled = mergedDisabled.value || contextDisabled.value;
        checkboxProps.indeterminate = indeterminate;
      } else {
        checkboxProps.onChange = handleChange;
      }
      const classString = classNames({
        [`${prefixCls.value}-wrapper`]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-wrapper-checked`]: checkboxProps.checked,
        [`${prefixCls.value}-wrapper-disabled`]: checkboxProps.disabled,
        [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.isFormItemInput
      }, className, hashId.value);
      const checkboxClass = classNames({
        [`${prefixCls.value}-indeterminate`]: indeterminate
      }, hashId.value);
      const ariaChecked = indeterminate ? 'mixed' : undefined;
      return wrapSSR(_createVNode("label", {
        "class": classString,
        "style": style,
        "onMouseenter": onMouseenter,
        "onMouseleave": onMouseleave
      }, [_createVNode(VcCheckbox, _objectSpread(_objectSpread({
        "aria-checked": ariaChecked
      }, checkboxProps), {}, {
        "class": checkboxClass,
        "ref": checkboxRef
      }), null), children.length ? _createVNode("span", null, [children]) : null]));
    };
  }
});