"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMessage;
exports.useInternalMessage = useInternalMessage;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcNotification = require("../vc-notification");
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _style = _interopRequireDefault(require("./style"));
var _PurePanel = require("./PurePanel");
var _motionUtil = require("../vc-trigger/utils/motionUtil");
var _util = require("../_util/util");
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
const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 3;
const Holder = (0, _vue.defineComponent)({
  name: 'Holder',
  inheritAttrs: false,
  props: ['top', 'prefixCls', 'getContainer', 'maxCount', 'duration', 'rtl', 'transitionName', 'onAllRemoved', 'animation', 'staticGetContainer'],
  setup(props, _ref) {
    let {
      expose
    } = _ref;
    var _a, _b;
    const {
      getPrefixCls,
      getPopupContainer
    } = (0, _useConfigInject.default)('message', props);
    const prefixCls = (0, _vue.computed)(() => getPrefixCls('message', props.prefixCls));
    const [, hashId] = (0, _style.default)(prefixCls);
    // =============================== Style ===============================
    const getStyles = () => {
      var _a;
      const top = (_a = props.top) !== null && _a !== void 0 ? _a : DEFAULT_OFFSET;
      return {
        left: '50%',
        transform: 'translateX(-50%)',
        top: typeof top === 'number' ? `${top}px` : top
      };
    };
    const getClassName = () => (0, _classNames.default)(hashId.value, props.rtl ? `${prefixCls.value}-rtl` : '');
    // ============================== Motion ===============================
    const getNotificationMotion = () => {
      var _a;
      return (0, _motionUtil.getMotion)({
        prefixCls: prefixCls.value,
        animation: (_a = props.animation) !== null && _a !== void 0 ? _a : `move-up`,
        transitionName: props.transitionName
      });
    };
    // ============================ Close Icon =============================
    const mergedCloseIcon = (0, _vue.createVNode)("span", {
      "class": `${prefixCls.value}-close-x`
    }, [(0, _vue.createVNode)(_CloseOutlined.default, {
      "class": `${prefixCls.value}-close-icon`
    }, null)]);
    // ============================== Origin ===============================
    const [api, holder] = (0, _vcNotification.useNotification)({
      //@ts-ignore
      getStyles,
      prefixCls: prefixCls.value,
      getClassName,
      motion: getNotificationMotion,
      closable: false,
      closeIcon: mergedCloseIcon,
      duration: (_a = props.duration) !== null && _a !== void 0 ? _a : DEFAULT_DURATION,
      getContainer: (_b = props.staticGetContainer) !== null && _b !== void 0 ? _b : getPopupContainer.value,
      maxCount: props.maxCount,
      onAllRemoved: props.onAllRemoved
    });
    // ================================ Ref ================================
    expose((0, _extends2.default)((0, _extends2.default)({}, api), {
      prefixCls,
      hashId
    }));
    return holder;
  }
});
// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
let keyIndex = 0;
function useInternalMessage(messageConfig) {
  const holderRef = (0, _vue.shallowRef)(null);
  const holderKey = Symbol('messageHolderKey');
  // ================================ API ================================
  // Wrap with notification content
  // >>> close
  const close = key => {
    var _a;
    (_a = holderRef.value) === null || _a === void 0 ? void 0 : _a.close(key);
  };
  // >>> Open
  const open = config => {
    if (!holderRef.value) {
      const fakeResult = () => {};
      fakeResult.then = () => {};
      return fakeResult;
    }
    const {
      open: originOpen,
      prefixCls,
      hashId
    } = holderRef.value;
    const noticePrefixCls = `${prefixCls}-notice`;
    const {
        content,
        icon,
        type,
        key,
        class: className,
        onClose
      } = config,
      restConfig = __rest(config, ["content", "icon", "type", "key", "class", "onClose"]);
    let mergedKey = key;
    if (mergedKey === undefined || mergedKey === null) {
      keyIndex += 1;
      mergedKey = `antd-message-${keyIndex}`;
    }
    return (0, _util.wrapPromiseFn)(resolve => {
      originOpen((0, _extends2.default)((0, _extends2.default)({}, restConfig), {
        key: mergedKey,
        content: () => (0, _vue.createVNode)(_PurePanel.PureContent, {
          "prefixCls": prefixCls,
          "type": type,
          "icon": typeof icon === 'function' ? icon() : icon
        }, {
          default: () => [typeof content === 'function' ? content() : content]
        }),
        placement: 'top',
        // @ts-ignore
        class: (0, _classNames.default)(type && `${noticePrefixCls}-${type}`, hashId, className),
        onClose: () => {
          onClose === null || onClose === void 0 ? void 0 : onClose();
          resolve();
        }
      }));
      // Return close function
      return () => {
        close(mergedKey);
      };
    });
  };
  // >>> destroy
  const destroy = key => {
    var _a;
    if (key !== undefined) {
      close(key);
    } else {
      (_a = holderRef.value) === null || _a === void 0 ? void 0 : _a.destroy();
    }
  };
  const wrapAPI = {
    open,
    destroy
  };
  const keys = ['info', 'success', 'warning', 'error', 'loading'];
  keys.forEach(type => {
    const typeOpen = (jointContent, duration, onClose) => {
      let config;
      if (jointContent && typeof jointContent === 'object' && 'content' in jointContent) {
        config = jointContent;
      } else {
        config = {
          content: jointContent
        };
      }
      // Params
      let mergedDuration;
      let mergedOnClose;
      if (typeof duration === 'function') {
        mergedOnClose = duration;
      } else {
        mergedDuration = duration;
        mergedOnClose = onClose;
      }
      const mergedConfig = (0, _extends2.default)((0, _extends2.default)({
        onClose: mergedOnClose,
        duration: mergedDuration
      }, config), {
        type
      });
      return open(mergedConfig);
    };
    wrapAPI[type] = typeOpen;
  });
  // ============================== Return ===============================
  return [wrapAPI, () => (0, _vue.createVNode)(Holder, (0, _objectSpread2.default)((0, _objectSpread2.default)({
    "key": holderKey
  }, messageConfig), {}, {
    "ref": holderRef
  }), null)];
}
function useMessage(messageConfig) {
  return useInternalMessage(messageConfig);
}