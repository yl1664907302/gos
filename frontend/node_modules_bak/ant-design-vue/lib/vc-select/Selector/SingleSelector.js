"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _pickAttrs = _interopRequireDefault(require("../../_util/pickAttrs"));
var _Input = _interopRequireDefault(require("./Input"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _LegacyContext = _interopRequireDefault(require("../../vc-tree-select/LegacyContext"));
const props = {
  inputElement: _vueTypes.default.any,
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
  compositionStatus: {
    type: Boolean,
    default: undefined
  },
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
  activeValue: String,
  backfill: {
    type: Boolean,
    default: undefined
  },
  optionLabelRender: Function,
  onInputChange: Function,
  onInputPaste: Function,
  onInputKeyDown: Function,
  onInputMouseDown: Function,
  onInputCompositionStart: Function,
  onInputCompositionEnd: Function
};
const SingleSelector = (0, _vue.defineComponent)({
  name: 'SingleSelector',
  setup(props) {
    const inputChanged = (0, _vue.shallowRef)(false);
    const combobox = (0, _vue.computed)(() => props.mode === 'combobox');
    const inputEditable = (0, _vue.computed)(() => combobox.value || props.showSearch);
    const inputValue = (0, _vue.computed)(() => {
      let inputValue = props.searchValue || '';
      if (combobox.value && props.activeValue && !inputChanged.value) {
        inputValue = props.activeValue;
      }
      return inputValue;
    });
    const legacyTreeSelectContext = (0, _LegacyContext.default)();
    (0, _vue.watch)([combobox, () => props.activeValue], () => {
      if (combobox.value) {
        inputChanged.value = false;
      }
    }, {
      immediate: true
    });
    // Not show text when closed expect combobox mode
    const hasTextInput = (0, _vue.computed)(() => props.mode !== 'combobox' && !props.open && !props.showSearch ? false : !!inputValue.value || props.compositionStatus);
    const title = (0, _vue.computed)(() => {
      const item = props.values[0];
      return item && (typeof item.label === 'string' || typeof item.label === 'number') ? item.label.toString() : undefined;
    });
    const renderPlaceholder = () => {
      if (props.values[0]) {
        return null;
      }
      const hiddenStyle = hasTextInput.value ? {
        visibility: 'hidden'
      } : undefined;
      return (0, _vue.createVNode)("span", {
        "class": `${props.prefixCls}-selection-placeholder`,
        "style": hiddenStyle
      }, [props.placeholder]);
    };
    const handleInput = e => {
      const composing = e.target.composing;
      if (!composing) {
        inputChanged.value = true;
        props.onInputChange(e);
      }
    };
    return () => {
      var _a, _b, _c, _d;
      const {
        inputElement,
        prefixCls,
        id,
        values,
        inputRef,
        disabled,
        autofocus,
        autocomplete,
        activeDescendantId,
        open,
        tabindex,
        optionLabelRender,
        onInputKeyDown,
        onInputMouseDown,
        onInputPaste,
        onInputCompositionStart,
        onInputCompositionEnd
      } = props;
      const item = values[0];
      let titleNode = null;
      // custom tree-select title by slot
      // For TreeSelect
      if (item && legacyTreeSelectContext.customSlots) {
        const key = (_a = item.key) !== null && _a !== void 0 ? _a : item.value;
        const originData = ((_b = legacyTreeSelectContext.keyEntities[key]) === null || _b === void 0 ? void 0 : _b.node) || {};
        titleNode = legacyTreeSelectContext.customSlots[(_c = originData.slots) === null || _c === void 0 ? void 0 : _c.title] || legacyTreeSelectContext.customSlots.title || item.label;
        if (typeof titleNode === 'function') {
          titleNode = titleNode(originData);
        }
        //  else if (treeSelectContext.value.slots.titleRender) {
        //   // 因历史 title 是覆盖逻辑，新增 titleRender，所有的 title 都走一遍 titleRender
        //   titleNode = treeSelectContext.value.slots.titleRender(item.option?.data || {});
        // }
      } else {
        titleNode = optionLabelRender && item ? optionLabelRender(item.option) : item === null || item === void 0 ? void 0 : item.label;
      }
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("span", {
        "class": `${prefixCls}-selection-search`
      }, [(0, _vue.createVNode)(_Input.default, {
        "inputRef": inputRef,
        "prefixCls": prefixCls,
        "id": id,
        "open": open,
        "inputElement": inputElement,
        "disabled": disabled,
        "autofocus": autofocus,
        "autocomplete": autocomplete,
        "editable": inputEditable.value,
        "activeDescendantId": activeDescendantId,
        "value": inputValue.value,
        "onKeydown": onInputKeyDown,
        "onMousedown": onInputMouseDown,
        "onChange": handleInput,
        "onPaste": onInputPaste,
        "onCompositionstart": onInputCompositionStart,
        "onCompositionend": onInputCompositionEnd,
        "tabindex": tabindex,
        "attrs": (0, _pickAttrs.default)(props, true)
      }, null)]), !combobox.value && item && !hasTextInput.value && (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-selection-item`,
        "title": title.value
      }, [(0, _vue.createVNode)(_vue.Fragment, {
        "key": (_d = item.key) !== null && _d !== void 0 ? _d : item.value
      }, [titleNode])]), renderPlaceholder()]);
    };
  }
});
SingleSelector.props = props;
SingleSelector.inheritAttrs = false;
var _default = exports.default = SingleSelector;