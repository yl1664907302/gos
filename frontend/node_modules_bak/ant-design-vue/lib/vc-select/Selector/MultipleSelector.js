"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _TransBtn = _interopRequireDefault(require("../TransBtn"));
var _Input = _interopRequireDefault(require("./Input"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _pickAttrs = _interopRequireDefault(require("../../_util/pickAttrs"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _vcOverflow = _interopRequireDefault(require("../../vc-overflow"));
var _LegacyContext = _interopRequireDefault(require("../../vc-tree-select/LegacyContext"));
const props = {
  id: String,
  prefixCls: String,
  values: _vueTypes.default.array,
  open: {
    type: Boolean,
    default: undefined
  },
  searchValue: String,
  inputRef: _vueTypes.default.any,
  placeholder: _vueTypes.default.any,
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
  tabindex: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
  compositionStatus: Boolean,
  removeIcon: _vueTypes.default.any,
  choiceTransitionName: String,
  maxTagCount: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
  maxTagTextLength: Number,
  maxTagPlaceholder: _vueTypes.default.any.def(() => omittedValues => `+ ${omittedValues.length} ...`),
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
const SelectSelector = (0, _vue.defineComponent)({
  name: 'MultipleSelectSelector',
  inheritAttrs: false,
  props: props,
  setup(props) {
    const measureRef = (0, _vue.shallowRef)();
    const inputWidth = (0, _vue.shallowRef)(0);
    const focused = (0, _vue.shallowRef)(false);
    const legacyTreeSelectContext = (0, _LegacyContext.default)();
    const selectionPrefixCls = (0, _vue.computed)(() => `${props.prefixCls}-selection`);
    // ===================== Search ======================
    const inputValue = (0, _vue.computed)(() => props.open || props.mode === 'tags' ? props.searchValue : '');
    const inputEditable = (0, _vue.computed)(() => props.mode === 'tags' || props.showSearch && (props.open || focused.value));
    const targetValue = (0, _vue.ref)('');
    (0, _vue.watchEffect)(() => {
      targetValue.value = inputValue.value;
    });
    // We measure width and set to the input immediately
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(targetValue, () => {
        inputWidth.value = measureRef.value.scrollWidth;
      }, {
        flush: 'post',
        immediate: true
      });
    });
    // ===================== Render ======================
    // >>> Render Selector Node. Includes Item & Rest
    function defaultRenderSelector(title, content, itemDisabled, closable, onClose) {
      return (0, _vue.createVNode)("span", {
        "class": (0, _classNames.default)(`${selectionPrefixCls.value}-item`, {
          [`${selectionPrefixCls.value}-item-disabled`]: itemDisabled
        }),
        "title": typeof title === 'string' || typeof title === 'number' ? title.toString() : undefined
      }, [(0, _vue.createVNode)("span", {
        "class": `${selectionPrefixCls.value}-item-content`
      }, [content]), closable && (0, _vue.createVNode)(_TransBtn.default, {
        "class": `${selectionPrefixCls.value}-item-remove`,
        "onMousedown": onPreventMouseDown,
        "onClick": onClose,
        "customizeIcon": props.removeIcon
      }, {
        default: () => [(0, _vue.createTextVNode)("\xD7")]
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
      return (0, _vue.createVNode)("span", {
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
      const inputNode = (0, _vue.createVNode)("div", {
        "class": `${selectionPrefixCls.value}-search`,
        "style": {
          width: inputWidth.value + 'px'
        },
        "key": "input"
      }, [(0, _vue.createVNode)(_Input.default, {
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
        "attrs": (0, _pickAttrs.default)(props, true),
        "onFocus": () => focused.value = true,
        "onBlur": () => focused.value = false
      }, null), (0, _vue.createVNode)("span", {
        "ref": measureRef,
        "class": `${selectionPrefixCls.value}-search-mirror`,
        "aria-hidden": true
      }, [targetValue.value, (0, _vue.createTextVNode)("\xA0")])]);
      // >>> Selections
      const selectionNode = (0, _vue.createVNode)(_vcOverflow.default, {
        "prefixCls": `${selectionPrefixCls.value}-overflow`,
        "data": values,
        "renderItem": renderItem,
        "renderRest": renderRest,
        "suffix": inputNode,
        "itemKey": "key",
        "maxCount": props.maxTagCount,
        "key": "overflow"
      }, null);
      return (0, _vue.createVNode)(_vue.Fragment, null, [selectionNode, !values.length && !inputValue.value && !compositionStatus && (0, _vue.createVNode)("span", {
        "class": `${selectionPrefixCls.value}-placeholder`
      }, [placeholder])]);
    };
  }
});
var _default = exports.default = SelectSelector;