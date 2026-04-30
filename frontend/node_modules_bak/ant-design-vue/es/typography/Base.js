import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import warning from '../_util/warning';
import TransButton from '../_util/transButton';
import raf from '../_util/raf';
import { isStyleSupport } from '../_util/styleChecker';
import Editable from './Editable';
import measure from './util';
import Typography from './Typography';
import ResizeObserver from '../vc-resize-observer';
import Tooltip from '../tooltip';
import copy from '../_util/copy-to-clipboard';
import CheckOutlined from "@ant-design/icons-vue/es/icons/CheckOutlined";
import CopyOutlined from "@ant-design/icons-vue/es/icons/CopyOutlined";
import EditOutlined from "@ant-design/icons-vue/es/icons/EditOutlined";
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount, watch, watchEffect, nextTick, computed, toRaw } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import useMergedState from '../_util/hooks/useMergedState';
import { findDOMNode } from '../_util/props-util';
const isLineClampSupport = isStyleSupport('webkitLineClamp');
const isTextOverflowSupport = isStyleSupport('textOverflow');
const ELLIPSIS_STR = '...';
export const baseProps = () => ({
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
const Base = defineComponent({
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
    } = useConfigInject('typography', props);
    const state = reactive({
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
    const contentRef = ref();
    const editIcon = ref();
    const ellipsis = computed(() => {
      const ellipsis = props.ellipsis;
      if (!ellipsis) return {};
      return _extends({
        rows: 1,
        expandable: false
      }, typeof ellipsis === 'object' ? ellipsis : null);
    });
    onMounted(() => {
      state.clientRendered = true;
      syncEllipsis();
    });
    onBeforeUnmount(() => {
      clearTimeout(state.copyId);
      raf.cancel(state.rafId);
    });
    watch([() => ellipsis.value.rows, () => props.content], () => {
      nextTick(() => {
        resizeOnNextFrame();
      });
    }, {
      flush: 'post',
      deep: true
    });
    watchEffect(() => {
      if (props.content === undefined) {
        warning(!props.editable, 'Typography', 'When `editable` is enabled, please use `content` instead of children');
        warning(!props.ellipsis, 'Typography', 'When `ellipsis` is enabled, please use `content` instead of children');
      }
    });
    function getChildrenText() {
      var _a;
      return props.ellipsis || props.editable ? props.content : (_a = findDOMNode(contentRef.value)) === null || _a === void 0 ? void 0 : _a.innerText;
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
      const copyConfig = _extends({}, typeof copyable === 'object' ? copyable : null);
      if (copyConfig.text === undefined) {
        copyConfig.text = getChildrenText();
      }
      copy(copyConfig.text || '');
      state.copied = true;
      nextTick(() => {
        if (copyConfig.onCopy) {
          copyConfig.onCopy(e);
        }
        state.copyId = setTimeout(() => {
          state.copied = false;
        }, 3000);
      });
    }
    const editable = computed(() => {
      const editable = props.editable;
      if (!editable) return {
        editing: false
      };
      return _extends({}, typeof editable === 'object' ? editable : null);
    });
    const [editing, setEditing] = useMergedState(false, {
      value: computed(() => {
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
    watch(editing, val => {
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
      raf.cancel(state.rafId);
      state.rafId = raf(() => {
        // Do not bind `syncEllipsis`. It need for test usage on prototype
        syncEllipsis();
      });
    }
    const canUseCSSEllipsis = computed(() => {
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
      if (!rows || rows < 0 || !findDOMNode(contentRef.value) || state.expanded || props.content === undefined) return;
      // Do not measure if css already support ellipsis
      if (canUseCSSEllipsis.value) return;
      const {
        content,
        text,
        ellipsis: ell
      } = measure(findDOMNode(contentRef.value), {
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
        currentContent = _createVNode(Tag, null, {
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
      return _createVNode("a", {
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
      const icon = slots.editableIcon ? slots.editableIcon() : _createVNode(EditOutlined, {
        "role": "button"
      }, null);
      const title = slots.editableTooltip ? slots.editableTooltip() : state.editStr;
      const ariaLabel = typeof title === 'string' ? title : '';
      return triggerType.indexOf('icon') !== -1 ? _createVNode(Tooltip, {
        "key": "edit",
        "title": tooltip === false ? '' : title
      }, {
        default: () => [_createVNode(TransButton, {
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
      const defaultIcon = state.copied ? _createVNode(CheckOutlined, null, null) : _createVNode(CopyOutlined, null, null);
      const icon = slots.copyableIcon ? slots.copyableIcon({
        copied: !!state.copied
      }) : defaultIcon;
      return _createVNode(Tooltip, {
        "key": "copy",
        "title": tooltip === false ? '' : title
      }, {
        default: () => [_createVNode(TransButton, {
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
      return _createVNode(Editable, {
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
      return _createVNode(LocaleReceiver, {
        "componentName": "Text",
        "children": locale => {
          const _a = _extends(_extends({}, props), attrs),
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
          const textProps = omit(restProps, ['prefixCls', 'editable', 'copyable', 'ellipsis', 'mark', 'code', 'delete', 'underline', 'strong', 'keyboard', 'onUpdate:content']);
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
            textNode = _createVNode(_Fragment, null, [toRaw(state.ellipsisContent), _createVNode("span", {
              "title": restContent,
              "aria-hidden": "true"
            }, [ELLIPSIS_STR]), suffix]);
          } else {
            textNode = _createVNode(_Fragment, null, [children, suffix]);
          }
          textNode = wrapperDecorations(props, textNode);
          const showTooltip = tooltip && rows && state.isEllipsis && !state.expanded && !cssEllipsis;
          const title = slots.ellipsisTooltip ? slots.ellipsisTooltip() : tooltip;
          return _createVNode(ResizeObserver, {
            "onResize": resizeOnNextFrame,
            "disabled": !rows
          }, {
            default: () => [_createVNode(Typography, _objectSpread({
              "ref": contentRef,
              "class": [{
                [`${prefixCls.value}-${type}`]: type,
                [`${prefixCls.value}-disabled`]: disabled,
                [`${prefixCls.value}-ellipsis`]: rows,
                [`${prefixCls.value}-single-line`]: rows === 1 && !state.isEllipsis,
                [`${prefixCls.value}-ellipsis-single-line`]: cssTextOverflow,
                [`${prefixCls.value}-ellipsis-multiple-line`]: cssLineClamp
              }, className],
              "style": _extends(_extends({}, style), {
                WebkitLineClamp: cssLineClamp ? rows : undefined
              }),
              "aria-label": ariaLabel,
              "direction": direction.value,
              "onClick": triggerType.indexOf('text') !== -1 ? onEditClick : () => {}
            }, textProps), {
              default: () => [showTooltip ? _createVNode(Tooltip, {
                "title": tooltip === true ? children : title
              }, {
                default: () => [_createVNode("span", null, [textNode])]
              }) : textNode, renderOperations()]
            })]
          });
        }
      }, null);
    };
  }
});
export default Base;