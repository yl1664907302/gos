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
import { defineComponent, ref, watch } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
export const checkboxProps = {
  prefixCls: String,
  name: String,
  id: String,
  type: String,
  defaultChecked: {
    type: [Boolean, Number],
    default: undefined
  },
  checked: {
    type: [Boolean, Number],
    default: undefined
  },
  disabled: Boolean,
  tabindex: {
    type: [Number, String]
  },
  readonly: Boolean,
  autofocus: Boolean,
  value: PropTypes.any,
  required: Boolean
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Checkbox',
  inheritAttrs: false,
  props: initDefaultProps(checkboxProps, {
    prefixCls: 'rc-checkbox',
    type: 'checkbox',
    defaultChecked: false
  }),
  emits: ['click', 'change'],
  setup(props, _ref) {
    let {
      attrs,
      emit,
      expose
    } = _ref;
    const checked = ref(props.checked === undefined ? props.defaultChecked : props.checked);
    const inputRef = ref();
    watch(() => props.checked, () => {
      checked.value = props.checked;
    });
    expose({
      focus() {
        var _a;
        (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur() {
        var _a;
        (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
      }
    });
    const eventShiftKey = ref();
    const handleChange = e => {
      if (props.disabled) {
        return;
      }
      if (props.checked === undefined) {
        checked.value = e.target.checked;
      }
      e.shiftKey = eventShiftKey.value;
      const eventObj = {
        target: _extends(_extends({}, props), {
          checked: e.target.checked
        }),
        stopPropagation() {
          e.stopPropagation();
        },
        preventDefault() {
          e.preventDefault();
        },
        nativeEvent: e
      };
      // fix https://github.com/vueComponent/ant-design-vue/issues/3047
      // 受控模式下维持现有状态
      if (props.checked !== undefined) {
        inputRef.value.checked = !!props.checked;
      }
      emit('change', eventObj);
      eventShiftKey.value = false;
    };
    const onClick = e => {
      emit('click', e);
      // onChange没能获取到shiftKey，使用onClick hack
      eventShiftKey.value = e.shiftKey;
    };
    return () => {
      const {
          prefixCls,
          name,
          id,
          type,
          disabled,
          readonly,
          tabindex,
          autofocus,
          value,
          required
        } = props,
        others = __rest(props, ["prefixCls", "name", "id", "type", "disabled", "readonly", "tabindex", "autofocus", "value", "required"]);
      const {
        class: className,
        onFocus,
        onBlur,
        onKeydown,
        onKeypress,
        onKeyup
      } = attrs;
      const othersAndAttrs = _extends(_extends({}, others), attrs);
      const globalProps = Object.keys(othersAndAttrs).reduce((prev, key) => {
        if (key.startsWith('data-') || key.startsWith('aria-') || key === 'role') {
          prev[key] = othersAndAttrs[key];
        }
        return prev;
      }, {});
      const classString = classNames(prefixCls, className, {
        [`${prefixCls}-checked`]: checked.value,
        [`${prefixCls}-disabled`]: disabled
      });
      const inputProps = _extends(_extends({
        name,
        id,
        type,
        readonly,
        disabled,
        tabindex,
        class: `${prefixCls}-input`,
        checked: !!checked.value,
        autofocus,
        value
      }, globalProps), {
        onChange: handleChange,
        onClick,
        onFocus,
        onBlur,
        onKeydown,
        onKeypress,
        onKeyup,
        required
      });
      return _createVNode("span", {
        "class": classString
      }, [_createVNode("input", _objectSpread({
        "ref": inputRef
      }, inputProps), null), _createVNode("span", {
        "class": `${prefixCls}-inner`
      }, null)]);
    };
  }
});