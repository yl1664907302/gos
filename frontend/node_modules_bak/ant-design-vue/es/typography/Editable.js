import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import KeyCode from '../_util/KeyCode';
import TextArea from '../input/TextArea';
import EnterOutlined from "@ant-design/icons-vue/es/icons/EnterOutlined";
import { defineComponent, ref, reactive, watch, onMounted, toRefs } from 'vue';
import classNames from '../_util/classNames';
// CSSINJS
import useStyle from './style';
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
const Editable = defineComponent({
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
    } = toRefs(props);
    const state = reactive({
      current: props.value || '',
      lastKeyCode: undefined,
      inComposition: false,
      cancelFlag: false
    });
    watch(() => props.value, current => {
      state.current = current;
    });
    const textArea = ref();
    onMounted(() => {
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
      if (keyCode === KeyCode.ENTER) {
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
        if (keyCode === KeyCode.ENTER) {
          confirmChange();
          emit('end');
        } else if (keyCode === KeyCode.ESC) {
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
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      const textAreaClassName = classNames({
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-edit-content`]: true,
        [`${prefixCls.value}-rtl`]: props.direction === 'rtl',
        [props.component ? `${prefixCls.value}-${props.component}` : '']: true
      }, attrs.class, hashId.value);
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": textAreaClassName
      }), [_createVNode(TextArea, {
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
      }) : _createVNode(EnterOutlined, {
        "class": `${props.prefixCls}-edit-content-confirm`
      }, null)]));
    };
  }
});
export default Editable;