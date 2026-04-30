import { createVNode as _createVNode } from "vue";
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import InfoCircleFilled from "@ant-design/icons-vue/es/icons/InfoCircleFilled";
import classNames from '../_util/classNames';
import Dialog from './Modal';
import ActionButton from '../_util/ActionButton';
import { defineComponent } from 'vue';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';
function renderSomeContent(someContent) {
  if (typeof someContent === 'function') {
    return someContent();
  }
  return someContent;
}
export default defineComponent({
  name: 'ConfirmDialog',
  inheritAttrs: false,
  props: ['icon', 'onCancel', 'onOk', 'close', 'closable', 'zIndex', 'afterClose', 'visible', 'open', 'keyboard', 'centered', 'getContainer', 'maskStyle', 'okButtonProps', 'cancelButtonProps', 'okType', 'prefixCls', 'okCancel', 'width', 'mask', 'maskClosable', 'okText', 'cancelText', 'autoFocusButton', 'transitionName', 'maskTransitionName', 'type', 'title', 'content', 'direction', 'rootPrefixCls', 'bodyStyle', 'closeIcon', 'modalRender', 'focusTriggerAfterClose', 'wrapClassName', 'confirmPrefixCls', 'footer'],
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const [locale] = useLocaleReceiver('Modal');
    if (process.env.NODE_ENV !== 'production') {
      warning(props.visible === undefined, 'Modal', `\`visible\` is deprecated, please use \`open\` instead.`);
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
            mergedIcon = _createVNode(InfoCircleFilled, null, null);
            break;
          case 'success':
            mergedIcon = _createVNode(CheckCircleFilled, null, null);
            break;
          case 'error':
            mergedIcon = _createVNode(CloseCircleFilled, null, null);
            break;
          default:
            mergedIcon = _createVNode(ExclamationCircleFilled, null, null);
        }
      }
      const okType = props.okType || 'primary';
      const prefixCls = props.prefixCls || 'ant-modal';
      const contentPrefixCls = `${prefixCls}-confirm`;
      const style = attrs.style || {};
      const mergedOkCancel = okCancel !== null && okCancel !== void 0 ? okCancel : type === 'confirm';
      const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';
      const confirmPrefixCls = `${prefixCls}-confirm`;
      const classString = classNames(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`, {
        [`${confirmPrefixCls}-rtl`]: direction === 'rtl'
      }, attrs.class);
      const mergedLocal = locale.value;
      const cancelButton = mergedOkCancel && _createVNode(ActionButton, {
        "actionFn": onCancel,
        "close": close,
        "autofocus": autoFocusButton === 'cancel',
        "buttonProps": cancelButtonProps,
        "prefixCls": `${rootPrefixCls}-btn`
      }, {
        default: () => [renderSomeContent(props.cancelText) || mergedLocal.cancelText]
      });
      return _createVNode(Dialog, {
        "prefixCls": prefixCls,
        "class": classString,
        "wrapClassName": classNames({
          [`${confirmPrefixCls}-centered`]: !!centered
        }, wrapClassName),
        "onCancel": e => close === null || close === void 0 ? void 0 : close({
          triggerCancel: true
        }, e),
        "open": open,
        "title": "",
        "footer": "",
        "transitionName": getTransitionName(rootPrefixCls, 'zoom', props.transitionName),
        "maskTransitionName": getTransitionName(rootPrefixCls, 'fade', props.maskTransitionName),
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
        default: () => [_createVNode("div", {
          "class": `${contentPrefixCls}-body-wrapper`
        }, [_createVNode("div", {
          "class": `${contentPrefixCls}-body`
        }, [renderSomeContent(mergedIcon), title === undefined ? null : _createVNode("span", {
          "class": `${contentPrefixCls}-title`
        }, [renderSomeContent(title)]), _createVNode("div", {
          "class": `${contentPrefixCls}-content`
        }, [renderSomeContent(content)])]), footer !== undefined ? renderSomeContent(footer) : _createVNode("div", {
          "class": `${contentPrefixCls}-btns`
        }, [cancelButton, _createVNode(ActionButton, {
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