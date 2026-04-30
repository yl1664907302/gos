"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachTypeApi = attachTypeApi;
exports.getInstance = exports.default = void 0;
exports.getKeyThenIncreaseKey = getKeyThenIncreaseKey;
exports.typeList = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcNotification = _interopRequireDefault(require("../vc-notification"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _InfoCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleFilled"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
var _useMessage = _interopRequireDefault(require("./useMessage"));
let defaultDuration = 3;
let defaultTop;
let messageInstance;
let key = 1;
let localPrefixCls = '';
let transitionName = 'move-up';
let hasTransitionName = false;
let getContainer = () => document.body;
let maxCount;
let rtl = false;
function getKeyThenIncreaseKey() {
  return key++;
}
function setMessageConfig(options) {
  if (options.top !== undefined) {
    defaultTop = options.top;
    messageInstance = null; // delete messageInstance for new defaultTop
  }
  if (options.duration !== undefined) {
    defaultDuration = options.duration;
  }
  if (options.prefixCls !== undefined) {
    localPrefixCls = options.prefixCls;
  }
  if (options.getContainer !== undefined) {
    getContainer = options.getContainer;
    messageInstance = null; // delete messageInstance for new getContainer
  }
  if (options.transitionName !== undefined) {
    transitionName = options.transitionName;
    messageInstance = null; // delete messageInstance for new transitionName
    hasTransitionName = true;
  }
  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
    messageInstance = null;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
}
function getMessageInstance(args, callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  _vcNotification.default.newInstance({
    appContext: args.appContext,
    prefixCls: args.prefixCls || localPrefixCls,
    rootPrefixCls: args.rootPrefixCls,
    transitionName,
    hasTransitionName,
    style: {
      top: defaultTop
    },
    getContainer: getContainer || args.getPopupContainer,
    maxCount,
    name: 'message',
    useStyle: _style.default
  }, instance => {
    if (messageInstance) {
      callback(messageInstance);
      return;
    }
    messageInstance = instance;
    callback(instance);
  });
}
const typeToIcon = {
  info: _InfoCircleFilled.default,
  success: _CheckCircleFilled.default,
  error: _CloseCircleFilled.default,
  warning: _ExclamationCircleFilled.default,
  loading: _LoadingOutlined.default
};
const typeList = exports.typeList = Object.keys(typeToIcon);
function notice(args) {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  const target = args.key || getKeyThenIncreaseKey();
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    getMessageInstance(args, instance => {
      instance.notice({
        key: target,
        duration,
        style: args.style || {},
        class: args.class,
        content: _ref => {
          let {
            prefixCls
          } = _ref;
          const Icon = typeToIcon[args.type];
          const iconNode = Icon ? (0, _vue.createVNode)(Icon, null, null) : '';
          const messageClass = (0, _classNames.default)(`${prefixCls}-custom-content`, {
            [`${prefixCls}-${args.type}`]: args.type,
            [`${prefixCls}-rtl`]: rtl === true
          });
          return (0, _vue.createVNode)("div", {
            "class": messageClass
          }, [typeof args.icon === 'function' ? args.icon() : args.icon || iconNode, (0, _vue.createVNode)("span", null, [typeof args.content === 'function' ? args.content() : args.content])]);
        },
        onClose: callback,
        onClick: args.onClick
      });
    });
  });
  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(target);
    }
  };
  result.then = (filled, rejected) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}
function isArgsProps(content) {
  return Object.prototype.toString.call(content) === '[object Object]' && !!content.content;
}
const api = {
  open: notice,
  config: setMessageConfig,
  destroy(messageKey) {
    if (messageInstance) {
      if (messageKey) {
        const {
          removeNotice
        } = messageInstance;
        removeNotice(messageKey);
      } else {
        const {
          destroy
        } = messageInstance;
        destroy();
        messageInstance = null;
      }
    }
  }
};
function attachTypeApi(originalApi, type) {
  originalApi[type] = (content, duration, onClose) => {
    if (isArgsProps(content)) {
      return originalApi.open((0, _extends2.default)((0, _extends2.default)({}, content), {
        type
      }));
    }
    if (typeof duration === 'function') {
      onClose = duration;
      duration = undefined;
    }
    return originalApi.open({
      content,
      duration,
      type,
      onClose
    });
  };
}
typeList.forEach(type => attachTypeApi(api, type));
api.warn = api.warning;
api.useMessage = _useMessage.default;
/** @private test Only function. Not work on production */
const getInstance = () => process.env.NODE_ENV === 'test' ? messageInstance : null;
exports.getInstance = getInstance;
var _default = exports.default = api;