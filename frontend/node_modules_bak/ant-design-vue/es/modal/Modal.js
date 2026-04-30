import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import Dialog from '../vc-dialog';
import PropTypes from '../_util/vue-types';
import addEventListener from '../vc-util/Dom/addEventListener';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import Button from '../button';
import { convertLegacyProps } from '../button/buttonTypes';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { objectType } from '../_util/type';
import { canUseDocElement } from '../_util/styleChecker';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { getTransitionName } from '../_util/transition';
import warning from '../_util/warning';
import useStyle from './style';
let mousePosition;
// ref: https://github.com/ant-design/ant-design/issues/15795
const getClickPosition = e => {
  mousePosition = {
    x: e.pageX,
    y: e.pageY
  };
  // 100ms 内发生过点击事件，则从点击位置动画展示
  // 否则直接 zoom 展示
  // 这样可以兼容非点击方式展开
  setTimeout(() => mousePosition = null, 100);
};
// 只有点击事件支持从鼠标位置动画展开
if (canUseDocElement()) {
  addEventListener(document.documentElement, 'click', getClickPosition, true);
}
export const modalProps = () => ({
  prefixCls: String,
  /** @deprecated Please use `open` instead. */
  visible: {
    type: Boolean,
    default: undefined
  },
  open: {
    type: Boolean,
    default: undefined
  },
  confirmLoading: {
    type: Boolean,
    default: undefined
  },
  title: PropTypes.any,
  closable: {
    type: Boolean,
    default: undefined
  },
  closeIcon: PropTypes.any,
  onOk: Function,
  onCancel: Function,
  'onUpdate:visible': Function,
  'onUpdate:open': Function,
  onChange: Function,
  afterClose: Function,
  centered: {
    type: Boolean,
    default: undefined
  },
  width: [String, Number],
  footer: PropTypes.any,
  okText: PropTypes.any,
  okType: String,
  cancelText: PropTypes.any,
  icon: PropTypes.any,
  maskClosable: {
    type: Boolean,
    default: undefined
  },
  forceRender: {
    type: Boolean,
    default: undefined
  },
  okButtonProps: objectType(),
  cancelButtonProps: objectType(),
  destroyOnClose: {
    type: Boolean,
    default: undefined
  },
  wrapClassName: String,
  maskTransitionName: String,
  transitionName: String,
  getContainer: {
    type: [String, Function, Boolean, Object],
    default: undefined
  },
  zIndex: Number,
  bodyStyle: objectType(),
  maskStyle: objectType(),
  mask: {
    type: Boolean,
    default: undefined
  },
  keyboard: {
    type: Boolean,
    default: undefined
  },
  wrapProps: Object,
  focusTriggerAfterClose: {
    type: Boolean,
    default: undefined
  },
  modalRender: Function,
  mousePosition: objectType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AModal',
  inheritAttrs: false,
  props: initDefaultProps(modalProps(), {
    width: 520,
    confirmLoading: false,
    okType: 'primary'
  }),
  setup(props, _ref) {
    let {
      emit,
      slots,
      attrs
    } = _ref;
    const [locale] = useLocaleReceiver('Modal');
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      getPopupContainer
    } = useConfigInject('modal', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    warning(props.visible === undefined, 'Modal', `\`visible\` will be removed in next major version, please use \`open\` instead.`);
    const handleCancel = e => {
      emit('update:visible', false);
      emit('update:open', false);
      emit('cancel', e);
      emit('change', false);
    };
    const handleOk = e => {
      emit('ok', e);
    };
    const renderFooter = () => {
      var _a, _b;
      const {
        okText = (_a = slots.okText) === null || _a === void 0 ? void 0 : _a.call(slots),
        okType,
        cancelText = (_b = slots.cancelText) === null || _b === void 0 ? void 0 : _b.call(slots),
        confirmLoading
      } = props;
      return _createVNode(_Fragment, null, [_createVNode(Button, _objectSpread({
        "onClick": handleCancel
      }, props.cancelButtonProps), {
        default: () => [cancelText || locale.value.cancelText]
      }), _createVNode(Button, _objectSpread(_objectSpread({}, convertLegacyProps(okType)), {}, {
        "loading": confirmLoading,
        "onClick": handleOk
      }, props.okButtonProps), {
        default: () => [okText || locale.value.okText]
      })]);
    };
    return () => {
      var _a, _b;
      const {
          prefixCls: customizePrefixCls,
          visible,
          open,
          wrapClassName,
          centered,
          getContainer,
          closeIcon = (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots),
          focusTriggerAfterClose = true
        } = props,
        restProps = __rest(props, ["prefixCls", "visible", "open", "wrapClassName", "centered", "getContainer", "closeIcon", "focusTriggerAfterClose"]);
      const wrapClassNameExtended = classNames(wrapClassName, {
        [`${prefixCls.value}-centered`]: !!centered,
        [`${prefixCls.value}-wrap-rtl`]: direction.value === 'rtl'
      });
      return wrapSSR(_createVNode(Dialog, _objectSpread(_objectSpread(_objectSpread({}, restProps), attrs), {}, {
        "rootClassName": hashId.value,
        "class": classNames(hashId.value, attrs.class),
        "getContainer": getContainer || (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value),
        "prefixCls": prefixCls.value,
        "wrapClassName": wrapClassNameExtended,
        "visible": open !== null && open !== void 0 ? open : visible,
        "onClose": handleCancel,
        "focusTriggerAfterClose": focusTriggerAfterClose,
        "transitionName": getTransitionName(rootPrefixCls.value, 'zoom', props.transitionName),
        "maskTransitionName": getTransitionName(rootPrefixCls.value, 'fade', props.maskTransitionName),
        "mousePosition": (_b = restProps.mousePosition) !== null && _b !== void 0 ? _b : mousePosition
      }), _extends(_extends({}, slots), {
        footer: slots.footer || renderFooter,
        closeIcon: () => {
          return _createVNode("span", {
            "class": `${prefixCls.value}-close-x`
          }, [closeIcon || _createVNode(CloseOutlined, {
            "class": `${prefixCls.value}-close-icon`
          }, null)]);
        }
      })));
    };
  }
});