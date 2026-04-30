"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _TextArea = _interopRequireDefault(require("../input/TextArea"));
var _EnterOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EnterOutlined"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const editableProps = () => ({
  prefixCls: String,
  value: String,
  maxlength: Number,
  autoSize: {
    type: [Boolean, Object]
  },
  onSave: Function,
  onCancel: Function,
  onEnd: Function,
  onChange: Function,
  originContent: String,
  direction: String,
  component: String
});
const Editable = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Editable',
  inheritAttrs: false,
  props: editableProps(),
  // emits: ['save', 'cancel', 'end', 'change'],
  setup(props, _ref) {
    let {
      emit,
      slots,
      attrs
    } = _ref;
    const {
      prefixCls
    } = (0, _vue.toRefs)(props);
    const state = (0, _vue.reactive)({
      current: props.value || '',
      lastKeyCode: undefined,
      inComposition: false,
      cancelFlag: false
    });
    (0, _vue.watch)(() => props.value, current => {
      state.current = current;
    });
    const textArea = (0, _vue.ref)();
    (0, _vue.onMounted)(() => {
      var _a;
      if (textArea.value) {
        const resizableTextArea = (_a = textArea.value) === null || _a === void 0 ? void 0 : _a.resizableTextArea;
        const innerTextArea = resizableTextArea === null || resizableTextArea === void 0 ? void 0 : resizableTextArea.textArea;
        innerTextArea.focus();
        const {
          length
        } = innerTextArea.value;
        innerTextArea.setSelectionRange(length, length);
      }
    });
    function saveTextAreaRef(node) {
      textArea.value = node;
    }
    function onChange(_ref2) {
      let {
        target: {
          value
        }
      } = _ref2;
      state.current = value.replace(/[\r\n]/g, '');
      emit('change', state.current);
    }
    function onCompositionStart() {
      state.inComposition = true;
    }
    function onCompositionEnd() {
      state.inComposition = false;
    }
    function onKeyDown(e) {
      const {
        keyCode
      } = e;
      if (keyCode === _KeyCode.default.ENTER) {
        e.preventDefault();
      }
      // We don't record keyCode when IME is using
      if (state.inComposition) return;
      state.lastKeyCode = keyCode;
    }
    function onKeyUp(e) {
      const {
        keyCode,
        ctrlKey,
        altKey,
        metaKey,
        shiftKey
      } = e;
      // Check if it's a real key
      if (state.lastKeyCode === keyCode && !state.inComposition && !ctrlKey && !altKey && !metaKey && !shiftKey) {
        if (keyCode === _KeyCode.default.ENTER) {
          confirmChange();
          emit('end');
        } else if (keyCode === _KeyCode.default.ESC) {
          state.current = props.originContent;
          emit('cancel');
        }
      }
    }
    function onBlur() {
      confirmChange();
    }
    function confirmChange() {
      emit('save', state.current.trim());
    }
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      const textAreaClassName = (0, _classNames.default)({
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-edit-content`]: true,
        [`${prefixCls.value}-rtl`]: props.direction === 'rtl',
        [props.component ? `${prefixCls.value}-${props.component}` : '']: true
      }, attrs.class, hashId.value);
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": textAreaClassName
      }), [(0, _vue.createVNode)(_TextArea.default, {
        "ref": saveTextAreaRef,
        "maxlength": props.maxlength,
        "value": state.current,
        "onChange": onChange,
        "onKeydown": onKeyDown,
        "onKeyup": onKeyUp,
        "onCompositionstart": onCompositionStart,
        "onCompositionend": onCompositionEnd,
        "onBlur": onBlur,
        "rows": 1,
        "autoSize": props.autoSize === undefined || props.autoSize
      }, null), slots.enterIcon ? slots.enterIcon({
        className: `${props.prefixCls}-edit-content-confirm`
      }) : (0, _vue.createVNode)(_EnterOutlined.default, {
        "class": `${props.prefixCls}-edit-content-confirm`
      }, null)]));
    };
  }
});
var _default = exports.default = Editable;