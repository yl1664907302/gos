"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vnode = require("../../_util/vnode");
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _BaseInput = _interopRequireDefault(require("../../_util/BaseInput"));
const inputProps = exports.inputProps = {
  inputRef: _vueTypes.default.any,
  prefixCls: String,
  id: String,
  inputElement: _vueTypes.default.VueNode,
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
  tabindex: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
  /** Pass accessibility props to input */
  attrs: _vueTypes.default.object,
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
const Input = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'SelectInput',
  inheritAttrs: false,
  props: inputProps,
  setup(props) {
    let blurTimeout = null;
    const VCSelectContainerEvent = (0, _vue.inject)('VCSelectContainerEvent');
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
      let inputNode = inputElement || (0, _vue.createVNode)(_BaseInput.default, null, null);
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
      inputNode = (0, _vnode.cloneElement)(inputNode, (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
        type: 'search'
      }, inputProps), {
        id,
        ref: inputRef,
        disabled,
        tabindex,
        lazy: false,
        autocomplete: autocomplete || 'off',
        autofocus,
        class: (0, _classNames.default)(`${prefixCls}-selection-search-input`, (_a = inputNode === null || inputNode === void 0 ? void 0 : inputNode.props) === null || _a === void 0 ? void 0 : _a.class),
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
        style: (0, _extends2.default)((0, _extends2.default)({}, style), {
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
var _default = exports.default = Input;