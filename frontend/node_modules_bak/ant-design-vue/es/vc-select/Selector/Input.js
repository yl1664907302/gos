import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { cloneElement } from '../../_util/vnode';
import { defineComponent, inject } from 'vue';
import PropTypes from '../../_util/vue-types';
import classNames from '../../_util/classNames';
import BaseInput from '../../_util/BaseInput';
export const inputProps = {
  inputRef: PropTypes.any,
  prefixCls: String,
  id: String,
  inputElement: PropTypes.VueNode,
  disabled: {
    type: Boolean,
    default: undefined
  },
  autofocus: {
    type: Boolean,
    default: undefined
  },
  autocomplete: String,
  editable: {
    type: Boolean,
    default: undefined
  },
  activeDescendantId: String,
  value: String,
  open: {
    type: Boolean,
    default: undefined
  },
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Pass accessibility props to input */
  attrs: PropTypes.object,
  onKeydown: {
    type: Function
  },
  onMousedown: {
    type: Function
  },
  onChange: {
    type: Function
  },
  onPaste: {
    type: Function
  },
  onCompositionstart: {
    type: Function
  },
  onCompositionend: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  }
};
const Input = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'SelectInput',
  inheritAttrs: false,
  props: inputProps,
  setup(props) {
    let blurTimeout = null;
    const VCSelectContainerEvent = inject('VCSelectContainerEvent');
    return () => {
      var _a;
      const {
        prefixCls,
        id,
        inputElement,
        disabled,
        tabindex,
        autofocus,
        autocomplete,
        editable,
        activeDescendantId,
        value,
        onKeydown,
        onMousedown,
        onChange,
        onPaste,
        onCompositionstart,
        onCompositionend,
        onFocus,
        onBlur,
        open,
        inputRef,
        attrs
      } = props;
      let inputNode = inputElement || _createVNode(BaseInput, null, null);
      const inputProps = inputNode.props || {};
      const {
        onKeydown: onOriginKeyDown,
        onInput: onOriginInput,
        onFocus: onOriginFocus,
        onBlur: onOriginBlur,
        onMousedown: onOriginMouseDown,
        onCompositionstart: onOriginCompositionStart,
        onCompositionend: onOriginCompositionEnd,
        style
      } = inputProps;
      inputNode = cloneElement(inputNode, _extends(_extends(_extends(_extends(_extends({
        type: 'search'
      }, inputProps), {
        id,
        ref: inputRef,
        disabled,
        tabindex,
        lazy: false,
        autocomplete: autocomplete || 'off',
        autofocus,
        class: classNames(`${prefixCls}-selection-search-input`, (_a = inputNode === null || inputNode === void 0 ? void 0 : inputNode.props) === null || _a === void 0 ? void 0 : _a.class),
        role: 'combobox',
        'aria-expanded': open,
        'aria-haspopup': 'listbox',
        'aria-owns': `${id}_list`,
        'aria-autocomplete': 'list',
        'aria-controls': `${id}_list`,
        'aria-activedescendant': activeDescendantId
      }), attrs), {
        value: editable ? value : '',
        readonly: !editable,
        unselectable: !editable ? 'on' : null,
        style: _extends(_extends({}, style), {
          opacity: editable ? null : 0
        }),
        onKeydown: event => {
          onKeydown(event);
          if (onOriginKeyDown) {
            onOriginKeyDown(event);
          }
        },
        onMousedown: event => {
          onMousedown(event);
          if (onOriginMouseDown) {
            onOriginMouseDown(event);
          }
        },
        onInput: event => {
          onChange(event);
          if (onOriginInput) {
            onOriginInput(event);
          }
        },
        onCompositionstart(event) {
          onCompositionstart(event);
          if (onOriginCompositionStart) {
            onOriginCompositionStart(event);
          }
        },
        onCompositionend(event) {
          onCompositionend(event);
          if (onOriginCompositionEnd) {
            onOriginCompositionEnd(event);
          }
        },
        onPaste,
        onFocus: function () {
          clearTimeout(blurTimeout);
          onOriginFocus && onOriginFocus(arguments.length <= 0 ? undefined : arguments[0]);
          onFocus && onFocus(arguments.length <= 0 ? undefined : arguments[0]);
          VCSelectContainerEvent === null || VCSelectContainerEvent === void 0 ? void 0 : VCSelectContainerEvent.focus(arguments.length <= 0 ? undefined : arguments[0]);
        },
        onBlur: function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          blurTimeout = setTimeout(() => {
            onOriginBlur && onOriginBlur(args[0]);
            onBlur && onBlur(args[0]);
            VCSelectContainerEvent === null || VCSelectContainerEvent === void 0 ? void 0 : VCSelectContainerEvent.blur(args[0]);
          }, 100);
        }
      }), inputNode.type === 'textarea' ? {} : {
        type: 'search'
      }), true, true);
      return inputNode;
    };
  }
});
export default Input;