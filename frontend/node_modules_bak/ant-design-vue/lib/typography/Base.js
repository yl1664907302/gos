"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.baseProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _transButton = _interopRequireDefault(require("../_util/transButton"));
var _raf = _interopRequireDefault(require("../_util/raf"));
var _styleChecker = require("../_util/styleChecker");
var _Editable = _interopRequireDefault(require("./Editable"));
var _util = _interopRequireDefault(require("./util"));
var _Typography = _interopRequireDefault(require("./Typography"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _copyToClipboard = _interopRequireDefault(require("../_util/copy-to-clipboard"));
var _CheckOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckOutlined"));
var _CopyOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CopyOutlined"));
var _EditOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EditOutlined"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _propsUtil = require("../_util/props-util");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const isLineClampSupport = (0, _styleChecker.isStyleSupport)('webkitLineClamp');
const isTextOverflowSupport = (0, _styleChecker.isStyleSupport)('textOverflow');
const ELLIPSIS_STR = '...';
const baseProps = () => ({
  editable: {
    type: [Boolean, Object],
    default: undefined
  },
  copyable: {
    type: [Boolean, Object],
    default: undefined
  },
  prefixCls: String,
  component: String,
  type: String,
  disabled: {
    type: Boolean,
    default: undefined
  },
  ellipsis: {
    type: [Boolean, Object],
    default: undefined
  },
  code: {
    type: Boolean,
    default: undefined
  },
  mark: {
    type: Boolean,
    default: undefined
  },
  underline: {
    type: Boolean,
    default: undefined
  },
  delete: {
    type: Boolean,
    default: undefined
  },
  strong: {
    type: Boolean,
    default: undefined
  },
  keyboard: {
    type: Boolean,
    default: undefined
  },
  content: String,
  'onUpdate:content': Function
});
exports.baseProps = baseProps;
const Base = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TypographyBase',
  inheritAttrs: false,
  props: baseProps(),
  // emits: ['update:content'],
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('typography', props);
    const state = (0, _vue.reactive)({
      copied: false,
      ellipsisText: '',
      ellipsisContent: null,
      isEllipsis: false,
      expanded: false,
      clientRendered: false,
      //locale
      expandStr: '',
      copyStr: '',
      copiedStr: '',
      editStr: '',
      copyId: undefined,
      rafId: undefined,
      prevProps: undefined,
      originContent: ''
    });
    const contentRef = (0, _vue.ref)();
    const editIcon = (0, _vue.ref)();
    const ellipsis = (0, _vue.computed)(() => {
      const ellipsis = props.ellipsis;
      if (!ellipsis) return {};
      return (0, _extends2.default)({
        rows: 1,
        expandable: false
      }, typeof ellipsis === 'object' ? ellipsis : null);
    });
    (0, _vue.onMounted)(() => {
      state.clientRendered = true;
      syncEllipsis();
    });
    (0, _vue.onBeforeUnmount)(() => {
      clearTimeout(state.copyId);
      _raf.default.cancel(state.rafId);
    });
    (0, _vue.watch)([() => ellipsis.value.rows, () => props.content], () => {
      (0, _vue.nextTick)(() => {
        resizeOnNextFrame();
      });
    }, {
      flush: 'post',
      deep: true
    });
    (0, _vue.watchEffect)(() => {
      if (props.content === undefined) {
        (0, _warning.default)(!props.editable, 'Typography', 'When `editable` is enabled, please use `content` instead of children');
        (0, _warning.default)(!props.ellipsis, 'Typography', 'When `ellipsis` is enabled, please use `content` instead of children');
      }
    });
    function getChildrenText() {
      var _a;
      return props.ellipsis || props.editable ? props.content : (_a = (0, _propsUtil.findDOMNode)(contentRef.value)) === null || _a === void 0 ? void 0 : _a.innerText;
    }
    // =============== Expand ===============
    function onExpandClick(e) {
      const {
        onExpand
      } = ellipsis.value;
      state.expanded = true;
      onExpand === null || onExpand === void 0 ? void 0 : onExpand(e);
    }
    // ================ Edit ================
    function onEditClick(e) {
      e.preventDefault();
      state.originContent = props.content;
      triggerEdit(true);
    }
    function onEditChange(value) {
      onContentChange(value);
      triggerEdit(false);
    }
    function onContentChange(value) {
      const {
        onChange
      } = editable.value;
      if (value !== props.content) {
        emit('update:content', value);
        onChange === null || onChange === void 0 ? void 0 : onChange(value);
      }
    }
    function onEditCancel() {
      var _a, _b;
      (_b = (_a = editable.value).onCancel) === null || _b === void 0 ? void 0 : _b.call(_a);
      triggerEdit(false);
    }
    // ================ Copy ================
    function onCopyClick(e) {
      e.preventDefault();
      e.stopPropagation();
      const {
        copyable
      } = props;
      const copyConfig = (0, _extends2.default)({}, typeof copyable === 'object' ? copyable : null);
      if (copyConfig.text === undefined) {
        copyConfig.text = getChildrenText();
      }
      (0, _copyToClipboard.default)(copyConfig.text || '');
      state.copied = true;
      (0, _vue.nextTick)(() => {
        if (copyConfig.onCopy) {
          copyConfig.onCopy(e);
        }
        state.copyId = setTimeout(() => {
          state.copied = false;
        }, 3000);
      });
    }
    const editable = (0, _vue.computed)(() => {
      const editable = props.editable;
      if (!editable) return {
        editing: false
      };
      return (0, _extends2.default)({}, typeof editable === 'object' ? editable : null);
    });
    const [editing, setEditing] = (0, _useMergedState.default)(false, {
      value: (0, _vue.computed)(() => {
        return editable.value.editing;
      })
    });
    function triggerEdit(edit) {
      const {
        onStart
      } = editable.value;
      if (edit && onStart) {
        onStart();
      }
      setEditing(edit);
    }
    (0, _vue.watch)(editing, val => {
      var _a;
      if (!val) {
        (_a = editIcon.value) === null || _a === void 0 ? void 0 : _a.focus();
      }
    }, {
      flush: 'post'
    });
    // ============== Ellipsis ==============
    function resizeOnNextFrame(sizeInfo) {
      if (sizeInfo) {
        const {
          width,
          height
        } = sizeInfo;
        if (!width || !height) return;
      }
      _raf.default.cancel(state.rafId);
      state.rafId = (0, _raf.default)(() => {
        // Do not bind `syncEllipsis`. It need for test usage on prototype
        syncEllipsis();
      });
    }
    const canUseCSSEllipsis = (0, _vue.computed)(() => {
      const {
        rows,
        expandable,
        suffix,
        onEllipsis,
        tooltip
      } = ellipsis.value;
      if (suffix || tooltip) return false;
      // Can't use css ellipsis since we need to provide the place for button
      if (props.editable || props.copyable || expandable || onEllipsis) {
        return false;
      }
      if (rows === 1) {
        return isTextOverflowSupport;
      }
      return isLineClampSupport;
    });
    const syncEllipsis = () => {
      const {
        ellipsisText,
        isEllipsis
      } = state;
      const {
        rows,
        suffix,
        onEllipsis
      } = ellipsis.value;
      if (!rows || rows < 0 || !(0, _propsUtil.findDOMNode)(contentRef.value) || state.expanded || props.content === undefined) return;
      // Do not measure if css already support ellipsis
      if (canUseCSSEllipsis.value) return;
      const {
        content,
        text,
        ellipsis: ell
      } = (0, _util.default)((0, _propsUtil.findDOMNode)(contentRef.value), {
        rows,
        suffix
      }, props.content, renderOperations(true), ELLIPSIS_STR);
      if (ellipsisText !== text || state.isEllipsis !== ell) {
        state.ellipsisText = text;
        state.ellipsisContent = content;
        state.isEllipsis = ell;
        if (isEllipsis !== ell && onEllipsis) {
          onEllipsis(ell);
        }
      }
    };
    function wrapperDecorations(_ref2, content) {
      let {
        mark,
        code,
        underline,
        delete: del,
        strong,
        keyboard
      } = _ref2;
      let currentContent = content;
      function wrap(needed, Tag) {
        if (!needed) return;
        const _currentContent = function () {
          return currentContent;
        }();
        currentContent = (0, _vue.createVNode)(Tag, null, {
          default: () => [_currentContent]
        });
      }
      wrap(strong, 'strong');
      wrap(underline, 'u');
      wrap(del, 'del');
      wrap(code, 'code');
      wrap(mark, 'mark');
      wrap(keyboard, 'kbd');
      return currentContent;
    }
    function renderExpand(forceRender) {
      const {
        expandable,
        symbol
      } = ellipsis.value;
      if (!expandable) return null;
      // force render expand icon for measure usage or it will cause dead loop
      if (!forceRender && (state.expanded || !state.isEllipsis)) return null;
      const expandContent = (slots.ellipsisSymbol ? slots.ellipsisSymbol() : symbol) || state.expandStr;
      return (0, _vue.createVNode)("a", {
        "key": "expand",
        "class": `${prefixCls.value}-expand`,
        "onClick": onExpandClick,
        "aria-label": state.expandStr
      }, [expandContent]);
    }
    function renderEdit() {
      if (!props.editable) return;
      const {
        tooltip,
        triggerType = ['icon']
      } = props.editable;
      const icon = slots.editableIcon ? slots.editableIcon() : (0, _vue.createVNode)(_EditOutlined.default, {
        "role": "button"
      }, null);
      const title = slots.editableTooltip ? slots.editableTooltip() : state.editStr;
      const ariaLabel = typeof title === 'string' ? title : '';
      return triggerType.indexOf('icon') !== -1 ? (0, _vue.createVNode)(_tooltip.default, {
        "key": "edit",
        "title": tooltip === false ? '' : title
      }, {
        default: () => [(0, _vue.createVNode)(_transButton.default, {
          "ref": editIcon,
          "class": `${prefixCls.value}-edit`,
          "onClick": onEditClick,
          "aria-label": ariaLabel
        }, {
          default: () => [icon]
        })]
      }) : null;
    }
    function renderCopy() {
      if (!props.copyable) return;
      const {
        tooltip
      } = props.copyable;
      const defaultTitle = state.copied ? state.copiedStr : state.copyStr;
      const title = slots.copyableTooltip ? slots.copyableTooltip({
        copied: state.copied
      }) : defaultTitle;
      const ariaLabel = typeof title === 'string' ? title : '';
      const defaultIcon = state.copied ? (0, _vue.createVNode)(_CheckOutlined.default, null, null) : (0, _vue.createVNode)(_CopyOutlined.default, null, null);
      const icon = slots.copyableIcon ? slots.copyableIcon({
        copied: !!state.copied
      }) : defaultIcon;
      return (0, _vue.createVNode)(_tooltip.default, {
        "key": "copy",
        "title": tooltip === false ? '' : title
      }, {
        default: () => [(0, _vue.createVNode)(_transButton.default, {
          "class": [`${prefixCls.value}-copy`, {
            [`${prefixCls.value}-copy-success`]: state.copied
          }],
          "onClick": onCopyClick,
          "aria-label": ariaLabel
        }, {
          default: () => [icon]
        })]
      });
    }
    function renderEditInput() {
      const {
        class: className,
        style
      } = attrs;
      const {
        maxlength,
        autoSize,
        onEnd
      } = editable.value;
      return (0, _vue.createVNode)(_Editable.default, {
        "class": className,
        "style": style,
        "prefixCls": prefixCls.value,
        "value": props.content,
        "originContent": state.originContent,
        "maxlength": maxlength,
        "autoSize": autoSize,
        "onSave": onEditChange,
        "onChange": onContentChange,
        "onCancel": onEditCancel,
        "onEnd": onEnd,
        "direction": direction.value,
        "component": props.component
      }, {
        enterIcon: slots.editableEnterIcon
      });
    }
    function renderOperations(forceRenderExpanded) {
      return [renderExpand(forceRenderExpanded), renderEdit(), renderCopy()].filter(node => node);
    }
    return () => {
      var _a;
      const {
        triggerType = ['icon']
      } = editable.value;
      const children = props.ellipsis || props.editable ? props.content !== undefined ? props.content : (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots) : slots.default ? slots.default() : props.content;
      if (editing.value) {
        return renderEditInput();
      }
      return (0, _vue.createVNode)(_LocaleReceiver.default, {
        "componentName": "Text",
        "children": locale => {
          const _a = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
            {
              type,
              disabled,
              content,
              class: className,
              style
            } = _a,
            restProps = __rest(_a, ["type", "disabled", "content", "class", "style"]);
          const {
            rows,
            suffix,
            tooltip
          } = ellipsis.value;
          const {
            edit,
            copy: copyStr,
            copied,
            expand
          } = locale;
          state.editStr = edit;
          state.copyStr = copyStr;
          state.copiedStr = copied;
          state.expandStr = expand;
          const textProps = (0, _omit.default)(restProps, ['prefixCls', 'editable', 'copyable', 'ellipsis', 'mark', 'code', 'delete', 'underline', 'strong', 'keyboard', 'onUpdate:content']);
          const cssEllipsis = canUseCSSEllipsis.value;
          const cssTextOverflow = rows === 1 && cssEllipsis;
          const cssLineClamp = rows && rows > 1 && cssEllipsis;
          let textNode = children;
          let ariaLabel;
          // Only use js ellipsis when css ellipsis not support
          if (rows && state.isEllipsis && !state.expanded && !cssEllipsis) {
            const {
              title
            } = restProps;
            let restContent = title || '';
            if (!title && (typeof children === 'string' || typeof children === 'number')) {
              restContent = String(children);
            }
            // show rest content as title on symbol
            restContent = restContent === null || restContent === void 0 ? void 0 : restContent.slice(String(state.ellipsisContent || '').length);
            // We move full content to outer element to avoid repeat read the content by accessibility
            textNode = (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.toRaw)(state.ellipsisContent), (0, _vue.createVNode)("span", {
              "title": restContent,
              "aria-hidden": "true"
            }, [ELLIPSIS_STR]), suffix]);
          } else {
            textNode = (0, _vue.createVNode)(_vue.Fragment, null, [children, suffix]);
          }
          textNode = wrapperDecorations(props, textNode);
          const showTooltip = tooltip && rows && state.isEllipsis && !state.expanded && !cssEllipsis;
          const title = slots.ellipsisTooltip ? slots.ellipsisTooltip() : tooltip;
          return (0, _vue.createVNode)(_vcResizeObserver.default, {
            "onResize": resizeOnNextFrame,
            "disabled": !rows
          }, {
            default: () => [(0, _vue.createVNode)(_Typography.default, (0, _objectSpread2.default)({
              "ref": contentRef,
              "class": [{
                [`${prefixCls.value}-${type}`]: type,
                [`${prefixCls.value}-disabled`]: disabled,
                [`${prefixCls.value}-ellipsis`]: rows,
                [`${prefixCls.value}-single-line`]: rows === 1 && !state.isEllipsis,
                [`${prefixCls.value}-ellipsis-single-line`]: cssTextOverflow,
                [`${prefixCls.value}-ellipsis-multiple-line`]: cssLineClamp
              }, className],
              "style": (0, _extends2.default)((0, _extends2.default)({}, style), {
                WebkitLineClamp: cssLineClamp ? rows : undefined
              }),
              "aria-label": ariaLabel,
              "direction": direction.value,
              "onClick": triggerType.indexOf('text') !== -1 ? onEditClick : () => {}
            }, textProps), {
              default: () => [showTooltip ? (0, _vue.createVNode)(_tooltip.default, {
                "title": tooltip === true ? children : title
              }, {
                default: () => [(0, _vue.createVNode)("span", null, [textNode])]
              }) : textNode, renderOperations()]
            })]
          });
        }
      }, null);
    };
  }
});
var _default = exports.default = Base;