import { Fragment as _Fragment, createTextVNode as _createTextVNode, createVNode as _createVNode } from "vue";
import TransBtn from '../TransBtn';
import Input from './Input';
import { ref, watchEffect, computed, defineComponent, onMounted, shallowRef, watch } from 'vue';
import classNames from '../../_util/classNames';
import pickAttrs from '../../_util/pickAttrs';
import PropTypes from '../../_util/vue-types';
import Overflow from '../../vc-overflow';
import useInjectLegacySelectContext from '../../vc-tree-select/LegacyContext';
const props = {
  id: String,
  prefixCls: String,
  values: PropTypes.array,
  open: {
    type: Boolean,
    default: undefined
  },
  searchValue: String,
  inputRef: PropTypes.any,
  placeholder: PropTypes.any,
  disabled: {
    type: Boolean,
    default: undefined
  },
  mode: String,
  showSearch: {
    type: Boolean,
    default: undefined
  },
  autofocus: {
    type: Boolean,
    default: undefined
  },
  autocomplete: String,
  activeDescendantId: String,
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  compositionStatus: Boolean,
  removeIcon: PropTypes.any,
  choiceTransitionName: String,
  maxTagCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxTagTextLength: Number,
  maxTagPlaceholder: PropTypes.any.def(() => omittedValues => `+ ${omittedValues.length} ...`),
  tagRender: Function,
  onToggleOpen: {
    type: Function
  },
  onRemove: Function,
  onInputChange: Function,
  onInputPaste: Function,
  onInputKeyDown: Function,
  onInputMouseDown: Function,
  onInputCompositionStart: Function,
  onInputCompositionEnd: Function
};
const onPreventMouseDown = event => {
  event.preventDefault();
  event.stopPropagation();
};
const SelectSelector = defineComponent({
  name: 'MultipleSelectSelector',
  inheritAttrs: false,
  props: props,
  setup(props) {
    const measureRef = shallowRef();
    const inputWidth = shallowRef(0);
    const focused = shallowRef(false);
    const legacyTreeSelectContext = useInjectLegacySelectContext();
    const selectionPrefixCls = computed(() => `${props.prefixCls}-selection`);
    // ===================== Search ======================
    const inputValue = computed(() => props.open || props.mode === 'tags' ? props.searchValue : '');
    const inputEditable = computed(() => props.mode === 'tags' || props.showSearch && (props.open || focused.value));
    const targetValue = ref('');
    watchEffect(() => {
      targetValue.value = inputValue.value;
    });
    // We measure width and set to the input immediately
    onMounted(() => {
      watch(targetValue, () => {
        inputWidth.value = measureRef.value.scrollWidth;
      }, {
        flush: 'post',
        immediate: true
      });
    });
    // ===================== Render ======================
    // >>> Render Selector Node. Includes Item & Rest
    function defaultRenderSelector(title, content, itemDisabled, closable, onClose) {
      return _createVNode("span", {
        "class": classNames(`${selectionPrefixCls.value}-item`, {
          [`${selectionPrefixCls.value}-item-disabled`]: itemDisabled
        }),
        "title": typeof title === 'string' || typeof title === 'number' ? title.toString() : undefined
      }, [_createVNode("span", {
        "class": `${selectionPrefixCls.value}-item-content`
      }, [content]), closable && _createVNode(TransBtn, {
        "class": `${selectionPrefixCls.value}-item-remove`,
        "onMousedown": onPreventMouseDown,
        "onClick": onClose,
        "customizeIcon": props.removeIcon
      }, {
        default: () => [_createTextVNode("\xD7")]
      })]);
    }
    function customizeRenderSelector(value, content, itemDisabled, closable, onClose, option) {
      var _a;
      const onMouseDown = e => {
        onPreventMouseDown(e);
        props.onToggleOpen(!open);
      };
      let originData = option;
      // For TreeSelect
      if (legacyTreeSelectContext.keyEntities) {
        originData = ((_a = legacyTreeSelectContext.keyEntities[value]) === null || _a === void 0 ? void 0 : _a.node) || {};
      }
      return _createVNode("span", {
        "key": value,
        "onMousedown": onMouseDown
      }, [props.tagRender({
        label: content,
        value,
        disabled: itemDisabled,
        closable,
        onClose,
        option: originData
      })]);
    }
    function renderItem(valueItem) {
      const {
        disabled: itemDisabled,
        label,
        value,
        option
      } = valueItem;
      const closable = !props.disabled && !itemDisabled;
      let displayLabel = label;
      if (typeof props.maxTagTextLength === 'number') {
        if (typeof label === 'string' || typeof label === 'number') {
          const strLabel = String(displayLabel);
          if (strLabel.length > props.maxTagTextLength) {
            displayLabel = `${strLabel.slice(0, props.maxTagTextLength)}...`;
          }
        }
      }
      const onClose = event => {
        var _a;
        if (event) event.stopPropagation();
        (_a = props.onRemove) === null || _a === void 0 ? void 0 : _a.call(props, valueItem);
      };
      return typeof props.tagRender === 'function' ? customizeRenderSelector(value, displayLabel, itemDisabled, closable, onClose, option) : defaultRenderSelector(label, displayLabel, itemDisabled, closable, onClose);
    }
    function renderRest(omittedValues) {
      const {
        maxTagPlaceholder = omittedValues => `+ ${omittedValues.length} ...`
      } = props;
      const content = typeof maxTagPlaceholder === 'function' ? maxTagPlaceholder(omittedValues) : maxTagPlaceholder;
      return defaultRenderSelector(content, content, false);
    }
    const handleInput = e => {
      const composing = e.target.composing;
      targetValue.value = e.target.value;
      if (!composing) {
        props.onInputChange(e);
      }
    };
    return () => {
      const {
        id,
        prefixCls,
        values,
        open,
        inputRef,
        placeholder,
        disabled,
        autofocus,
        autocomplete,
        activeDescendantId,
        tabindex,
        compositionStatus,
        onInputPaste,
        onInputKeyDown,
        onInputMouseDown,
        onInputCompositionStart,
        onInputCompositionEnd
      } = props;
      // >>> Input Node
      const inputNode = _createVNode("div", {
        "class": `${selectionPrefixCls.value}-search`,
        "style": {
          width: inputWidth.value + 'px'
        },
        "key": "input"
      }, [_createVNode(Input, {
        "inputRef": inputRef,
        "open": open,
        "prefixCls": prefixCls,
        "id": id,
        "inputElement": null,
        "disabled": disabled,
        "autofocus": autofocus,
        "autocomplete": autocomplete,
        "editable": inputEditable.value,
        "activeDescendantId": activeDescendantId,
        "value": targetValue.value,
        "onKeydown": onInputKeyDown,
        "onMousedown": onInputMouseDown,
        "onChange": handleInput,
        "onPaste": onInputPaste,
        "onCompositionstart": onInputCompositionStart,
        "onCompositionend": onInputCompositionEnd,
        "tabindex": tabindex,
        "attrs": pickAttrs(props, true),
        "onFocus": () => focused.value = true,
        "onBlur": () => focused.value = false
      }, null), _createVNode("span", {
        "ref": measureRef,
        "class": `${selectionPrefixCls.value}-search-mirror`,
        "aria-hidden": true
      }, [targetValue.value, _createTextVNode("\xA0")])]);
      // >>> Selections
      const selectionNode = _createVNode(Overflow, {
        "prefixCls": `${selectionPrefixCls.value}-overflow`,
        "data": values,
        "renderItem": renderItem,
        "renderRest": renderRest,
        "suffix": inputNode,
        "itemKey": "key",
        "maxCount": props.maxTagCount,
        "key": "overflow"
      }, null);
      return _createVNode(_Fragment, null, [selectionNode, !values.length && !inputValue.value && !compositionStatus && _createVNode("span", {
        "class": `${selectionPrefixCls.value}-placeholder`
      }, [placeholder])]);
    };
  }
});
export default SelectSelector;