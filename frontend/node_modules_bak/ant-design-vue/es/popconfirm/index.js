import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, ref, toRef, defineComponent } from 'vue';
import Popover from '../popover';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { initDefaultProps } from '../_util/props-util';
import { convertLegacyProps } from '../button/buttonTypes';
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import Button from '../button';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import { anyType, objectType, stringType, withInstall } from '../_util/type';
import useMergedState from '../_util/hooks/useMergedState';
import KeyCode from '../_util/KeyCode';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import { getTransitionName } from '../_util/transition';
import { cloneVNodes } from '../_util/vnode';
import omit from '../_util/omit';
import { tooltipDefaultProps } from '../tooltip/Tooltip';
import ActionButton from '../_util/ActionButton';
import usePopconfirmStyle from './style';
import warning from '../_util/warning';
export const popconfirmProps = () => _extends(_extends({}, abstractTooltipProps()), {
  prefixCls: String,
  content: anyType(),
  title: anyType(),
  description: anyType(),
  okType: stringType('primary'),
  disabled: {
    type: Boolean,
    default: false
  },
  okText: anyType(),
  cancelText: anyType(),
  icon: anyType(),
  okButtonProps: objectType(),
  cancelButtonProps: objectType(),
  showCancel: {
    type: Boolean,
    default: true
  },
  onConfirm: Function,
  onCancel: Function
});
const Popconfirm = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'APopconfirm',
  inheritAttrs: false,
  props: initDefaultProps(popconfirmProps(), _extends(_extends({}, tooltipDefaultProps()), {
    trigger: 'click',
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1,
    arrowPointAtCenter: false,
    autoAdjustOverflow: true,
    okType: 'primary',
    disabled: false
  })),
  slots: Object,
  // emits: ['update:open', 'visibleChange'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      expose,
      attrs
    } = _ref;
    const rootRef = ref();
    warning(props.visible === undefined, 'Popconfirm', `\`visible\` will be removed in next major version, please use \`open\` instead.`);
    expose({
      getPopupDomNode: () => {
        var _a, _b;
        return (_b = (_a = rootRef.value) === null || _a === void 0 ? void 0 : _a.getPopupDomNode) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    });
    const [open, setOpen] = useMergedState(false, {
      value: toRef(props, 'open')
    });
    const settingOpen = (value, e) => {
      if (props.open === undefined) {
        setOpen(value);
      }
      emit('update:open', value);
      emit('openChange', value, e);
    };
    const close = e => {
      settingOpen(false, e);
    };
    const onConfirm = e => {
      var _a;
      return (_a = props.onConfirm) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    const onCancel = e => {
      var _a;
      settingOpen(false, e);
      (_a = props.onCancel) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    const onKeyDown = e => {
      if (e.keyCode === KeyCode.ESC && open) {
        settingOpen(false, e);
      }
    };
    const onOpenChange = value => {
      const {
        disabled
      } = props;
      if (disabled) {
        return;
      }
      settingOpen(value);
    };
    const {
      prefixCls: prefixClsConfirm,
      getPrefixCls
    } = useConfigInject('popconfirm', props);
    const rootPrefixCls = computed(() => getPrefixCls());
    const btnPrefixCls = computed(() => getPrefixCls('btn'));
    const [wrapSSR] = usePopconfirmStyle(prefixClsConfirm);
    const [popconfirmLocale] = useLocaleReceiver('Popconfirm', defaultLocale.Popconfirm);
    const renderOverlay = () => {
      var _a, _b, _c, _d, _e;
      const {
        okButtonProps,
        cancelButtonProps,
        title = (_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots),
        description = (_b = slots.description) === null || _b === void 0 ? void 0 : _b.call(slots),
        cancelText = (_c = slots.cancel) === null || _c === void 0 ? void 0 : _c.call(slots),
        okText = (_d = slots.okText) === null || _d === void 0 ? void 0 : _d.call(slots),
        okType,
        icon = ((_e = slots.icon) === null || _e === void 0 ? void 0 : _e.call(slots)) || _createVNode(ExclamationCircleFilled, null, null),
        showCancel = true
      } = props;
      const {
        cancelButton,
        okButton
      } = slots;
      const cancelProps = _extends({
        onClick: onCancel,
        size: 'small'
      }, cancelButtonProps);
      const okProps = _extends(_extends(_extends({
        onClick: onConfirm
      }, convertLegacyProps(okType)), {
        size: 'small'
      }), okButtonProps);
      return _createVNode("div", {
        "class": `${prefixClsConfirm.value}-inner-content`
      }, [_createVNode("div", {
        "class": `${prefixClsConfirm.value}-message`
      }, [icon && _createVNode("span", {
        "class": `${prefixClsConfirm.value}-message-icon`
      }, [icon]), _createVNode("div", {
        "class": [`${prefixClsConfirm.value}-message-title`, {
          [`${prefixClsConfirm.value}-message-title-only`]: !!description
        }]
      }, [title])]), description && _createVNode("div", {
        "class": `${prefixClsConfirm.value}-description`
      }, [description]), _createVNode("div", {
        "class": `${prefixClsConfirm.value}-buttons`
      }, [showCancel ? cancelButton ? cancelButton(cancelProps) : _createVNode(Button, cancelProps, {
        default: () => [cancelText || popconfirmLocale.value.cancelText]
      }) : null, okButton ? okButton(okProps) : _createVNode(ActionButton, {
        "buttonProps": _extends(_extends({
          size: 'small'
        }, convertLegacyProps(okType)), okButtonProps),
        "actionFn": onConfirm,
        "close": close,
        "prefixCls": btnPrefixCls.value,
        "quitOnNullishReturnValue": true,
        "emitEvent": true
      }, {
        default: () => [okText || popconfirmLocale.value.okText]
      })])]);
    };
    return () => {
      var _a;
      const {
          placement,
          overlayClassName,
          trigger = 'click'
        } = props,
        restProps = __rest(props, ["placement", "overlayClassName", "trigger"]);
      const otherProps = omit(restProps, ['title', 'content', 'cancelText', 'okText', 'onUpdate:open', 'onConfirm', 'onCancel', 'prefixCls']);
      const overlayClassNames = classNames(prefixClsConfirm.value, overlayClassName);
      return wrapSSR(_createVNode(Popover, _objectSpread(_objectSpread(_objectSpread({}, otherProps), attrs), {}, {
        "trigger": trigger,
        "placement": placement,
        "onOpenChange": onOpenChange,
        "open": open.value,
        "overlayClassName": overlayClassNames,
        "transitionName": getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName),
        "ref": rootRef,
        "data-popover-inject": true
      }), {
        default: () => [cloneVNodes(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || [], {
          onKeydown: e => {
            onKeyDown(e);
          }
        }, false)],
        content: renderOverlay
      }));
    };
  }
});
export default withInstall(Popconfirm);