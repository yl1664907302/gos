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
import classNames from '../_util/classNames';
import { isValidElement } from '../_util/props-util';
import { cloneElement } from '../_util/vnode';
import Input from './Input';
import EyeOutlined from "@ant-design/icons-vue/es/icons/EyeOutlined";
import EyeInvisibleOutlined from "@ant-design/icons-vue/es/icons/EyeInvisibleOutlined";
import inputProps from './inputProps';
import { computed, defineComponent, shallowRef, watchEffect } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
const ActionMap = {
  click: 'onClick',
  hover: 'onMouseover'
};
const defaultIconRender = visible => visible ? _createVNode(EyeOutlined, null, null) : _createVNode(EyeInvisibleOutlined, null, null);
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputPassword',
  inheritAttrs: false,
  props: _extends(_extends({}, inputProps()), {
    prefixCls: String,
    inputPrefixCls: String,
    action: {
      type: String,
      default: 'click'
    },
    visibilityToggle: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: undefined
    },
    'onUpdate:visible': Function,
    iconRender: Function
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const visible = shallowRef(false);
    const onVisibleChange = () => {
      const {
        disabled
      } = props;
      if (disabled) {
        return;
      }
      visible.value = !visible.value;
      emit('update:visible', visible.value);
    };
    watchEffect(() => {
      if (props.visible !== undefined) {
        visible.value = !!props.visible;
      }
    });
    const inputRef = shallowRef();
    const focus = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    const getIcon = prefixCls => {
      const {
        action,
        iconRender = slots.iconRender || defaultIconRender
      } = props;
      const iconTrigger = ActionMap[action] || '';
      const icon = iconRender(visible.value);
      const iconProps = {
        [iconTrigger]: onVisibleChange,
        class: `${prefixCls}-icon`,
        key: 'passwordIcon',
        onMousedown: e => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        },
        onMouseup: e => {
          // Prevent caret position change
          // https://github.com/ant-design/ant-design/issues/23524
          e.preventDefault();
        }
      };
      return cloneElement(isValidElement(icon) ? icon : _createVNode("span", null, [icon]), iconProps);
    };
    const {
      prefixCls,
      getPrefixCls
    } = useConfigInject('input-password', props);
    const inputPrefixCls = computed(() => getPrefixCls('input', props.inputPrefixCls));
    const renderPassword = () => {
      const {
          size,
          visibilityToggle
        } = props,
        restProps = __rest(props, ["size", "visibilityToggle"]);
      const suffixIcon = visibilityToggle && getIcon(prefixCls.value);
      const inputClassName = classNames(prefixCls.value, attrs.class, {
        [`${prefixCls.value}-${size}`]: !!size
      });
      const omittedProps = _extends(_extends(_extends({}, omit(restProps, ['suffix', 'iconRender', 'action'])), attrs), {
        type: visible.value ? 'text' : 'password',
        class: inputClassName,
        prefixCls: inputPrefixCls.value,
        suffix: suffixIcon
      });
      if (size) {
        omittedProps.size = size;
      }
      return _createVNode(Input, _objectSpread({
        "ref": inputRef
      }, omittedProps), slots);
    };
    return () => {
      return renderPassword();
    };
  }
});