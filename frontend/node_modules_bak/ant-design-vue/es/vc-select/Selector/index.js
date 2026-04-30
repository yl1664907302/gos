import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
/**
 * Cursor rule:
 * 1. Only `showSearch` enabled
 * 2. Only `open` is `true`
 * 3. When typing, set `open` to `true` which hit rule of 2
 *
 * Accessibility:
 * - https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html
 */
import KeyCode from '../../_util/KeyCode';
import MultipleSelector from './MultipleSelector';
import SingleSelector from './SingleSelector';
import { isValidateOpenKey } from '../utils/keyUtil';
import useLock from '../hooks/useLock';
import { defineComponent, ref } from 'vue';
import createRef from '../../_util/createRef';
import PropTypes from '../../_util/vue-types';
const Selector = defineComponent({
  name: 'Selector',
  inheritAttrs: false,
  props: {
    id: String,
    prefixCls: String,
    showSearch: {
      type: Boolean,
      default: undefined
    },
    open: {
      type: Boolean,
      default: undefined
    },
    /** Display in the Selector value, it's not same as `value` prop */
    values: PropTypes.array,
    multiple: {
      type: Boolean,
      default: undefined
    },
    mode: String,
    searchValue: String,
    activeValue: String,
    inputElement: PropTypes.any,
    autofocus: {
      type: Boolean,
      default: undefined
    },
    activeDescendantId: String,
    tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: {
      type: Boolean,
      default: undefined
    },
    placeholder: PropTypes.any,
    removeIcon: PropTypes.any,
    // Tags
    maxTagCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    maxTagTextLength: Number,
    maxTagPlaceholder: PropTypes.any,
    tagRender: Function,
    optionLabelRender: Function,
    /** Check if `tokenSeparators` contains `\n` or `\r\n` */
    tokenWithEnter: {
      type: Boolean,
      default: undefined
    },
    // Motion
    choiceTransitionName: String,
    onToggleOpen: {
      type: Function
    },
    /** `onSearch` returns go next step boolean to check if need do toggle open */
    onSearch: Function,
    onSearchSubmit: Function,
    onRemove: Function,
    onInputKeyDown: {
      type: Function
    },
    /**
     * @private get real dom for trigger align.
     * This may be removed after React provides replacement of `findDOMNode`
     */
    domRef: Function
  },
  setup(props, _ref) {
    let {
      expose
    } = _ref;
    const inputRef = createRef();
    const compositionStatus = ref(false);
    // ====================== Input ======================
    const [getInputMouseDown, setInputMouseDown] = useLock(0);
    const onInternalInputKeyDown = event => {
      const {
        which
      } = event;
      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        event.preventDefault();
      }
      if (props.onInputKeyDown) {
        props.onInputKeyDown(event);
      }
      if (which === KeyCode.ENTER && props.mode === 'tags' && !compositionStatus.value && !props.open) {
        // When menu isn't open, OptionList won't trigger a value change
        // So when enter is pressed, the tag's input value should be emitted here to let selector know
        props.onSearchSubmit(event.target.value);
      }
      if (isValidateOpenKey(which)) {
        props.onToggleOpen(true);
      }
    };
    /**
     * We can not use `findDOMNode` sine it will get warning,
     * have to use timer to check if is input element.
     */
    const onInternalInputMouseDown = () => {
      setInputMouseDown(true);
    };
    // When paste come, ignore next onChange
    let pastedText = null;
    const triggerOnSearch = value => {
      if (props.onSearch(value, true, compositionStatus.value) !== false) {
        props.onToggleOpen(true);
      }
    };
    const onInputCompositionStart = () => {
      compositionStatus.value = true;
    };
    const onInputCompositionEnd = e => {
      compositionStatus.value = false;
      // Trigger search again to support `tokenSeparators` with typewriting
      if (props.mode !== 'combobox') {
        triggerOnSearch(e.target.value);
      }
    };
    const onInputChange = event => {
      let {
        target: {
          value
        }
      } = event;
      // Pasted text should replace back to origin content
      if (props.tokenWithEnter && pastedText && /[\r\n]/.test(pastedText)) {
        // CRLF will be treated as a single space for input element
        const replacedText = pastedText.replace(/[\r\n]+$/, '').replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
        value = value.replace(replacedText, pastedText);
      }
      pastedText = null;
      triggerOnSearch(value);
    };
    const onInputPaste = e => {
      const {
        clipboardData
      } = e;
      const value = clipboardData.getData('text');
      pastedText = value;
    };
    const onClick = _ref2 => {
      let {
        target
      } = _ref2;
      if (target !== inputRef.current) {
        // Should focus input if click the selector
        const isIE = document.body.style.msTouchAction !== undefined;
        if (isIE) {
          setTimeout(() => {
            inputRef.current.focus();
          });
        } else {
          inputRef.current.focus();
        }
      }
    };
    const onMousedown = event => {
      const inputMouseDown = getInputMouseDown();
      if (event.target !== inputRef.current && !inputMouseDown) {
        event.preventDefault();
      }
      if (props.mode !== 'combobox' && (!props.showSearch || !inputMouseDown) || !props.open) {
        if (props.open) {
          props.onSearch('', true, false);
        }
        props.onToggleOpen();
      }
    };
    expose({
      focus: () => {
        inputRef.current.focus();
      },
      blur: () => {
        inputRef.current.blur();
      }
    });
    return () => {
      const {
        prefixCls,
        domRef,
        mode
      } = props;
      const sharedProps = {
        inputRef,
        onInputKeyDown: onInternalInputKeyDown,
        onInputMouseDown: onInternalInputMouseDown,
        onInputChange,
        onInputPaste,
        compositionStatus: compositionStatus.value,
        onInputCompositionStart,
        onInputCompositionEnd
      };
      const selectNode = mode === 'multiple' || mode === 'tags' ? _createVNode(MultipleSelector, _objectSpread(_objectSpread({}, props), sharedProps), null) : _createVNode(SingleSelector, _objectSpread(_objectSpread({}, props), sharedProps), null);
      return _createVNode("div", {
        "ref": domRef,
        "class": `${prefixCls}-selector`,
        "onClick": onClick,
        "onMousedown": onMousedown
      }, [selectNode]);
    };
  }
});
export default Selector;