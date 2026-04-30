"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modalProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcDialog = _interopRequireDefault(require("../vc-dialog"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _addEventListener = _interopRequireDefault(require("../vc-util/Dom/addEventListener"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _button = _interopRequireDefault(require("../button"));
var _buttonTypes = require("../button/buttonTypes");
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _type = require("../_util/type");
var _styleChecker = require("../_util/styleChecker");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _transition = require("../_util/transition");
var _warning = _interopRequireDefault(require("../_util/warning"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
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
if ((0, _styleChecker.canUseDocElement)()) {
  (0, _addEventListener.default)(document.documentElement, 'click', getClickPosition, true);
}
const modalProps = () => ({
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
  title: _vueTypes.default.any,
  closable: {
    type: Boolean,
    default: undefined
  },
  closeIcon: _vueTypes.default.any,
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
  footer: _vueTypes.default.any,
  okText: _vueTypes.default.any,
  okType: String,
  cancelText: _vueTypes.default.any,
  icon: _vueTypes.default.any,
  maskClosable: {
    type: Boolean,
    default: undefined
  },
  forceRender: {
    type: Boolean,
    default: undefined
  },
  okButtonProps: (0, _type.objectType)(),
  cancelButtonProps: (0, _type.objectType)(),
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
  bodyStyle: (0, _type.objectType)(),
  maskStyle: (0, _type.objectType)(),
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
  mousePosition: (0, _type.objectType)()
});
exports.modalProps = modalProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AModal',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(modalProps(), {
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
    const [locale] = (0, _LocaleReceiver.useLocaleReceiver)('Modal');
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      getPopupContainer
    } = (0, _useConfigInject.default)('modal', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    (0, _warning.default)(props.visible === undefined, 'Modal', `\`visible\` will be removed in next major version, please use \`open\` instead.`);
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
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_button.default, (0, _objectSpread2.default)({
        "onClick": handleCancel
      }, props.cancelButtonProps), {
        default: () => [cancelText || locale.value.cancelText]
      }), (0, _vue.createVNode)(_button.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _buttonTypes.convertLegacyProps)(okType)), {}, {
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
      const wrapClassNameExtended = (0, _classNames.default)(wrapClassName, {
        [`${prefixCls.value}-centered`]: !!centered,
        [`${prefixCls.value}-wrap-rtl`]: direction.value === 'rtl'
      });
      return wrapSSR((0, _vue.createVNode)(_vcDialog.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), attrs), {}, {
        "rootClassName": hashId.value,
        "class": (0, _classNames.default)(hashId.value, attrs.class),
        "getContainer": getContainer || (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value),
        "prefixCls": prefixCls.value,
        "wrapClassName": wrapClassNameExtended,
        "visible": open !== null && open !== void 0 ? open : visible,
        "onClose": handleCancel,
        "focusTriggerAfterClose": focusTriggerAfterClose,
        "transitionName": (0, _transition.getTransitionName)(rootPrefixCls.value, 'zoom', props.transitionName),
        "maskTransitionName": (0, _transition.getTransitionName)(rootPrefixCls.value, 'fade', props.maskTransitionName),
        "mousePosition": (_b = restProps.mousePosition) !== null && _b !== void 0 ? _b : mousePosition
      }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
        footer: slots.footer || renderFooter,
        closeIcon: () => {
          return (0, _vue.createVNode)("span", {
            "class": `${prefixCls.value}-close-x`
          }, [closeIcon || (0, _vue.createVNode)(_CloseOutlined.default, {
            "class": `${prefixCls.value}-close-icon`
          }, null)]);
        }
      })));
    };
  }
});