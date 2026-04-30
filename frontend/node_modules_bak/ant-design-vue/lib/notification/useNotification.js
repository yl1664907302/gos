"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useNotification;
exports.useInternalNotification = useInternalNotification;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcNotification = require("../vc-notification");
var _style = _interopRequireDefault(require("./style"));
var _PurePanel = require("./PurePanel");
var _util = require("./util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;
const Holder = (0, _vue.defineComponent)({
  name: 'Holder',
  inheritAttrs: false,
  props: ['prefixCls', 'class', 'type', 'icon', 'content', 'onAllRemoved'],
  setup(props, _ref) {
    let {
      expose
    } = _ref;
    const {
      getPrefixCls,
      getPopupContainer
    } = (0, _useConfigInject.default)('notification', props);
    const prefixCls = (0, _vue.computed)(() => props.prefixCls || getPrefixCls('notification'));
    // =============================== Style ===============================
    const getStyles = placement => {
      var _a, _b;
      return (0, _util.getPlacementStyle)(placement, (_a = props.top) !== null && _a !== void 0 ? _a : DEFAULT_OFFSET, (_b = props.bottom) !== null && _b !== void 0 ? _b : DEFAULT_OFFSET);
    };
    // Style
    const [, hashId] = (0, _style.default)(prefixCls);
    const getClassName = () => (0, _classNames.default)(hashId.value, {
      [`${prefixCls.value}-rtl`]: props.rtl
    });
    // ============================== Motion ===============================
    const getNotificationMotion = () => (0, _util.getMotion)(prefixCls.value);
    // ============================== Origin ===============================
    const [api, holder] = (0, _vcNotification.useNotification)({
      prefixCls: prefixCls.value,
      getStyles,
      getClassName,
      motion: getNotificationMotion,
      closable: true,
      closeIcon: (0, _PurePanel.getCloseIcon)(prefixCls.value),
      duration: DEFAULT_DURATION,
      getContainer: () => {
        var _a, _b;
        return ((_a = props.getPopupContainer) === null || _a === void 0 ? void 0 : _a.call(props)) || ((_b = getPopupContainer.value) === null || _b === void 0 ? void 0 : _b.call(getPopupContainer)) || document.body;
      },
      maxCount: props.maxCount,
      hashId: hashId.value,
      onAllRemoved: props.onAllRemoved
    });
    // ================================ Ref ================================
    expose((0, _extends2.default)((0, _extends2.default)({}, api), {
      prefixCls: prefixCls.value,
      hashId
    }));
    return holder;
  }
});
// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
function useInternalNotification(notificationConfig) {
  const holderRef = (0, _vue.shallowRef)(null);
  const holderKey = Symbol('notificationHolderKey');
  // ================================ API ================================
  // Wrap with notification content
  // >>> Open
  const open = config => {
    if (!holderRef.value) {
      return;
    }
    const {
      open: originOpen,
      prefixCls,
      hashId
    } = holderRef.value;
    const noticePrefixCls = `${prefixCls}-notice`;
    const {
        message,
        description,
        icon,
        type,
        btn,
        class: className
      } = config,
      restConfig = __rest(config, ["message", "description", "icon", "type", "btn", "class"]);
    return originOpen((0, _extends2.default)((0, _extends2.default)({
      placement: 'topRight'
    }, restConfig), {
      content: () => (0, _vue.createVNode)(_PurePanel.PureContent, {
        "prefixCls": noticePrefixCls,
        "icon": typeof icon === 'function' ? icon() : icon,
        "type": type,
        "message": typeof message === 'function' ? message() : message,
        "description": typeof description === 'function' ? description() : description,
        "btn": typeof btn === 'function' ? btn() : btn
      }, null),
      // @ts-ignore
      class: (0, _classNames.default)(type && `${noticePrefixCls}-${type}`, hashId, className)
    }));
  };
  // >>> destroy
  const destroy = key => {
    var _a, _b;
    if (key !== undefined) {
      (_a = holderRef.value) === null || _a === void 0 ? void 0 : _a.close(key);
    } else {
      (_b = holderRef.value) === null || _b === void 0 ? void 0 : _b.destroy();
    }
  };
  const wrapAPI = {
    open,
    destroy
  };
  const keys = ['success', 'info', 'warning', 'error'];
  keys.forEach(type => {
    wrapAPI[type] = config => open((0, _extends2.default)((0, _extends2.default)({}, config), {
      type
    }));
  });
  // ============================== Return ===============================
  return [wrapAPI, () => (0, _vue.createVNode)(Holder, (0, _objectSpread2.default)((0, _objectSpread2.default)({
    "key": holderKey
  }, notificationConfig), {}, {
    "ref": holderRef
  }), null)];
}
function useNotification(notificationConfig) {
  return useInternalNotification(notificationConfig);
}