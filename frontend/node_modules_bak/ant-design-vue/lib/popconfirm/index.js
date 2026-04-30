"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.popconfirmProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _popover = _interopRequireDefault(require("../popover"));
var _abstractTooltipProps = _interopRequireDefault(require("../tooltip/abstractTooltipProps"));
var _propsUtil = require("../_util/props-util");
var _buttonTypes = require("../button/buttonTypes");
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _button = _interopRequireDefault(require("../button"));
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _type = require("../_util/type");
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _transition = require("../_util/transition");
var _vnode = require("../_util/vnode");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _Tooltip = require("../tooltip/Tooltip");
var _ActionButton = _interopRequireDefault(require("../_util/ActionButton"));
var _style = _interopRequireDefault(require("./style"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const popconfirmProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _abstractTooltipProps.default)()), {
  prefixCls: String,
  content: (0, _type.anyType)(),
  title: (0, _type.anyType)(),
  description: (0, _type.anyType)(),
  okType: (0, _type.stringType)('primary'),
  disabled: {
    type: Boolean,
    default: false
  },
  okText: (0, _type.anyType)(),
  cancelText: (0, _type.anyType)(),
  icon: (0, _type.anyType)(),
  okButtonProps: (0, _type.objectType)(),
  cancelButtonProps: (0, _type.objectType)(),
  showCancel: {
    type: Boolean,
    default: true
  },
  onConfirm: Function,
  onCancel: Function
});
exports.popconfirmProps = popconfirmProps;
const Popconfirm = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'APopconfirm',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(popconfirmProps(), (0, _extends2.default)((0, _extends2.default)({}, (0, _Tooltip.tooltipDefaultProps)()), {
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
    const rootRef = (0, _vue.ref)();
    (0, _warning.default)(props.visible === undefined, 'Popconfirm', `\`visible\` will be removed in next major version, please use \`open\` instead.`);
    expose({
      getPopupDomNode: () => {
        var _a, _b;
        return (_b = (_a = rootRef.value) === null || _a === void 0 ? void 0 : _a.getPopupDomNode) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    });
    const [open, setOpen] = (0, _useMergedState.default)(false, {
      value: (0, _vue.toRef)(props, 'open')
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
      if (e.keyCode === _KeyCode.default.ESC && open) {
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
    } = (0, _useConfigInject.default)('popconfirm', props);
    const rootPrefixCls = (0, _vue.computed)(() => getPrefixCls());
    const btnPrefixCls = (0, _vue.computed)(() => getPrefixCls('btn'));
    const [wrapSSR] = (0, _style.default)(prefixClsConfirm);
    const [popconfirmLocale] = (0, _LocaleReceiver.useLocaleReceiver)('Popconfirm', _en_US.default.Popconfirm);
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
        icon = ((_e = slots.icon) === null || _e === void 0 ? void 0 : _e.call(slots)) || (0, _vue.createVNode)(_ExclamationCircleFilled.default, null, null),
        showCancel = true
      } = props;
      const {
        cancelButton,
        okButton
      } = slots;
      const cancelProps = (0, _extends2.default)({
        onClick: onCancel,
        size: 'small'
      }, cancelButtonProps);
      const okProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
        onClick: onConfirm
      }, (0, _buttonTypes.convertLegacyProps)(okType)), {
        size: 'small'
      }), okButtonProps);
      return (0, _vue.createVNode)("div", {
        "class": `${prefixClsConfirm.value}-inner-content`
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixClsConfirm.value}-message`
      }, [icon && (0, _vue.createVNode)("span", {
        "class": `${prefixClsConfirm.value}-message-icon`
      }, [icon]), (0, _vue.createVNode)("div", {
        "class": [`${prefixClsConfirm.value}-message-title`, {
          [`${prefixClsConfirm.value}-message-title-only`]: !!description
        }]
      }, [title])]), description && (0, _vue.createVNode)("div", {
        "class": `${prefixClsConfirm.value}-description`
      }, [description]), (0, _vue.createVNode)("div", {
        "class": `${prefixClsConfirm.value}-buttons`
      }, [showCancel ? cancelButton ? cancelButton(cancelProps) : (0, _vue.createVNode)(_button.default, cancelProps, {
        default: () => [cancelText || popconfirmLocale.value.cancelText]
      }) : null, okButton ? okButton(okProps) : (0, _vue.createVNode)(_ActionButton.default, {
        "buttonProps": (0, _extends2.default)((0, _extends2.default)({
          size: 'small'
        }, (0, _buttonTypes.convertLegacyProps)(okType)), okButtonProps),
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
      const otherProps = (0, _omit.default)(restProps, ['title', 'content', 'cancelText', 'okText', 'onUpdate:open', 'onConfirm', 'onCancel', 'prefixCls']);
      const overlayClassNames = (0, _classNames.default)(prefixClsConfirm.value, overlayClassName);
      return wrapSSR((0, _vue.createVNode)(_popover.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, otherProps), attrs), {}, {
        "trigger": trigger,
        "placement": placement,
        "onOpenChange": onOpenChange,
        "open": open.value,
        "overlayClassName": overlayClassNames,
        "transitionName": (0, _transition.getTransitionName)(rootPrefixCls.value, 'zoom-big', props.transitionName),
        "ref": rootRef,
        "data-popover-inject": true
      }), {
        default: () => [(0, _vnode.cloneVNodes)(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || [], {
          onKeydown: e => {
            onKeyDown(e);
          }
        }, false)],
        content: renderOverlay
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Popconfirm);