"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _InfoCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleFilled"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _Modal = _interopRequireDefault(require("./Modal"));
var _ActionButton = _interopRequireDefault(require("../_util/ActionButton"));
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _transition = require("../_util/transition");
var _warning = _interopRequireDefault(require("../_util/warning"));
function renderSomeContent(someContent) {
  if (typeof someContent === 'function') {
    return someContent();
  }
  return someContent;
}
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'ConfirmDialog',
  inheritAttrs: false,
  props: ['icon', 'onCancel', 'onOk', 'close', 'closable', 'zIndex', 'afterClose', 'visible', 'open', 'keyboard', 'centered', 'getContainer', 'maskStyle', 'okButtonProps', 'cancelButtonProps', 'okType', 'prefixCls', 'okCancel', 'width', 'mask', 'maskClosable', 'okText', 'cancelText', 'autoFocusButton', 'transitionName', 'maskTransitionName', 'type', 'title', 'content', 'direction', 'rootPrefixCls', 'bodyStyle', 'closeIcon', 'modalRender', 'focusTriggerAfterClose', 'wrapClassName', 'confirmPrefixCls', 'footer'],
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const [locale] = (0, _LocaleReceiver.useLocaleReceiver)('Modal');
    if (process.env.NODE_ENV !== 'production') {
      (0, _warning.default)(props.visible === undefined, 'Modal', `\`visible\` is deprecated, please use \`open\` instead.`);
    }
    return () => {
      const {
        icon,
        onCancel,
        onOk,
        close,
        okText,
        closable = false,
        zIndex,
        afterClose,
        keyboard,
        centered,
        getContainer,
        maskStyle,
        okButtonProps,
        cancelButtonProps,
        okCancel,
        width = 416,
        mask = true,
        maskClosable = false,
        type,
        open,
        title,
        content,
        direction,
        closeIcon,
        modalRender,
        focusTriggerAfterClose,
        rootPrefixCls,
        bodyStyle,
        wrapClassName,
        footer
      } = props;
      // Icon
      let mergedIcon = icon;
      // 支持传入{ icon: null }来隐藏`Modal.confirm`默认的Icon
      if (!icon && icon !== null) {
        switch (type) {
          case 'info':
            mergedIcon = (0, _vue.createVNode)(_InfoCircleFilled.default, null, null);
            break;
          case 'success':
            mergedIcon = (0, _vue.createVNode)(_CheckCircleFilled.default, null, null);
            break;
          case 'error':
            mergedIcon = (0, _vue.createVNode)(_CloseCircleFilled.default, null, null);
            break;
          default:
            mergedIcon = (0, _vue.createVNode)(_ExclamationCircleFilled.default, null, null);
        }
      }
      const okType = props.okType || 'primary';
      const prefixCls = props.prefixCls || 'ant-modal';
      const contentPrefixCls = `${prefixCls}-confirm`;
      const style = attrs.style || {};
      const mergedOkCancel = okCancel !== null && okCancel !== void 0 ? okCancel : type === 'confirm';
      const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';
      const confirmPrefixCls = `${prefixCls}-confirm`;
      const classString = (0, _classNames.default)(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`, {
        [`${confirmPrefixCls}-rtl`]: direction === 'rtl'
      }, attrs.class);
      const mergedLocal = locale.value;
      const cancelButton = mergedOkCancel && (0, _vue.createVNode)(_ActionButton.default, {
        "actionFn": onCancel,
        "close": close,
        "autofocus": autoFocusButton === 'cancel',
        "buttonProps": cancelButtonProps,
        "prefixCls": `${rootPrefixCls}-btn`
      }, {
        default: () => [renderSomeContent(props.cancelText) || mergedLocal.cancelText]
      });
      return (0, _vue.createVNode)(_Modal.default, {
        "prefixCls": prefixCls,
        "class": classString,
        "wrapClassName": (0, _classNames.default)({
          [`${confirmPrefixCls}-centered`]: !!centered
        }, wrapClassName),
        "onCancel": e => close === null || close === void 0 ? void 0 : close({
          triggerCancel: true
        }, e),
        "open": open,
        "title": "",
        "footer": "",
        "transitionName": (0, _transition.getTransitionName)(rootPrefixCls, 'zoom', props.transitionName),
        "maskTransitionName": (0, _transition.getTransitionName)(rootPrefixCls, 'fade', props.maskTransitionName),
        "mask": mask,
        "maskClosable": maskClosable,
        "maskStyle": maskStyle,
        "style": style,
        "bodyStyle": bodyStyle,
        "width": width,
        "zIndex": zIndex,
        "afterClose": afterClose,
        "keyboard": keyboard,
        "centered": centered,
        "getContainer": getContainer,
        "closable": closable,
        "closeIcon": closeIcon,
        "modalRender": modalRender,
        "focusTriggerAfterClose": focusTriggerAfterClose
      }, {
        default: () => [(0, _vue.createVNode)("div", {
          "class": `${contentPrefixCls}-body-wrapper`
        }, [(0, _vue.createVNode)("div", {
          "class": `${contentPrefixCls}-body`
        }, [renderSomeContent(mergedIcon), title === undefined ? null : (0, _vue.createVNode)("span", {
          "class": `${contentPrefixCls}-title`
        }, [renderSomeContent(title)]), (0, _vue.createVNode)("div", {
          "class": `${contentPrefixCls}-content`
        }, [renderSomeContent(content)])]), footer !== undefined ? renderSomeContent(footer) : (0, _vue.createVNode)("div", {
          "class": `${contentPrefixCls}-btns`
        }, [cancelButton, (0, _vue.createVNode)(_ActionButton.default, {
          "type": okType,
          "actionFn": onOk,
          "close": close,
          "autofocus": autoFocusButton === 'ok',
          "buttonProps": okButtonProps,
          "prefixCls": `${rootPrefixCls}-btn`
        }, {
          default: () => [renderSomeContent(okText) || (mergedOkCancel ? mergedLocal.okText : mergedLocal.justOkText)]
        })])])]
      });
    };
  }
});