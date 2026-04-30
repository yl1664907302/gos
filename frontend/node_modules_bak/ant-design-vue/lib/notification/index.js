"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInstance = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcNotification = _interopRequireDefault(require("../vc-notification"));
var _CheckCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleOutlined"));
var _InfoCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleOutlined"));
var _CloseCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleOutlined"));
var _ExclamationCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleOutlined"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _util = require("../_util/util");
var _configProvider = require("../config-provider");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _style = _interopRequireDefault(require("./style"));
var _useNotification = _interopRequireDefault(require("./useNotification"));
var _util2 = require("./util");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const notificationInstance = {};
let defaultDuration = 4.5;
let defaultTop = '24px';
let defaultBottom = '24px';
let defaultPrefixCls = '';
let defaultPlacement = 'topRight';
let defaultGetContainer = () => document.body;
let defaultCloseIcon = null;
let rtl = false;
let maxCount;
function setNotificationConfig(options) {
  const {
    duration,
    placement,
    bottom,
    top,
    getContainer,
    closeIcon,
    prefixCls
  } = options;
  if (prefixCls !== undefined) {
    defaultPrefixCls = prefixCls;
  }
  if (duration !== undefined) {
    defaultDuration = duration;
  }
  if (placement !== undefined) {
    defaultPlacement = placement;
  }
  if (bottom !== undefined) {
    defaultBottom = typeof bottom === 'number' ? `${bottom}px` : bottom;
  }
  if (top !== undefined) {
    defaultTop = typeof top === 'number' ? `${top}px` : top;
  }
  if (getContainer !== undefined) {
    defaultGetContainer = getContainer;
  }
  if (closeIcon !== undefined) {
    defaultCloseIcon = closeIcon;
  }
  if (options.rtl !== undefined) {
    rtl = options.rtl;
  }
  if (options.maxCount !== undefined) {
    maxCount = options.maxCount;
  }
}
function getNotificationInstance(_ref, callback) {
  let {
    prefixCls: customizePrefixCls,
    placement = defaultPlacement,
    getContainer = defaultGetContainer,
    top,
    bottom,
    closeIcon = defaultCloseIcon,
    appContext
  } = _ref;
  const {
    getPrefixCls
  } = (0, _configProvider.globalConfig)();
  const prefixCls = getPrefixCls('notification', customizePrefixCls || defaultPrefixCls);
  const cacheKey = `${prefixCls}-${placement}-${rtl}`;
  const cacheInstance = notificationInstance[cacheKey];
  if (cacheInstance) {
    Promise.resolve(cacheInstance).then(instance => {
      callback(instance);
    });
    return;
  }
  const notificationClass = (0, _classNames.default)(`${prefixCls}-${placement}`, {
    [`${prefixCls}-rtl`]: rtl === true
  });
  _vcNotification.default.newInstance({
    name: 'notification',
    prefixCls: customizePrefixCls || defaultPrefixCls,
    useStyle: _style.default,
    class: notificationClass,
    style: (0, _util2.getPlacementStyle)(placement, top !== null && top !== void 0 ? top : defaultTop, bottom !== null && bottom !== void 0 ? bottom : defaultBottom),
    appContext,
    getContainer,
    closeIcon: _ref2 => {
      let {
        prefixCls
      } = _ref2;
      const closeIconToRender = (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-close-x`
      }, [(0, _util.renderHelper)(closeIcon, {}, (0, _vue.createVNode)(_CloseOutlined.default, {
        "class": `${prefixCls}-close-icon`
      }, null))]);
      return closeIconToRender;
    },
    maxCount,
    hasTransitionName: true
  }, notification => {
    notificationInstance[cacheKey] = notification;
    callback(notification);
  });
}
const typeToIcon = {
  success: _CheckCircleOutlined.default,
  info: _InfoCircleOutlined.default,
  error: _CloseCircleOutlined.default,
  warning: _ExclamationCircleOutlined.default
};
function notice(args) {
  const {
    icon,
    type,
    description,
    message,
    btn
  } = args;
  const duration = args.duration === undefined ? defaultDuration : args.duration;
  getNotificationInstance(args, notification => {
    notification.notice({
      content: _ref3 => {
        let {
          prefixCls: outerPrefixCls
        } = _ref3;
        const prefixCls = `${outerPrefixCls}-notice`;
        let iconNode = null;
        if (icon) {
          iconNode = () => (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-icon`
          }, [(0, _util.renderHelper)(icon)]);
        } else if (type) {
          const Icon = typeToIcon[type];
          iconNode = () => (0, _vue.createVNode)(Icon, {
            "class": `${prefixCls}-icon ${prefixCls}-icon-${type}`
          }, null);
        }
        return (0, _vue.createVNode)("div", {
          "class": iconNode ? `${prefixCls}-with-icon` : ''
        }, [iconNode && iconNode(), (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-message`
        }, [!description && iconNode ? (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-message-single-line-auto-margin`
        }, null) : null, (0, _util.renderHelper)(message)]), (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-description`
        }, [(0, _util.renderHelper)(description)]), btn ? (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-btn`
        }, [(0, _util.renderHelper)(btn)]) : null]);
      },
      duration,
      closable: true,
      onClose: args.onClose,
      onClick: args.onClick,
      key: args.key,
      style: args.style || {},
      class: args.class
    });
  });
}
const api = {
  open: notice,
  close(key) {
    Object.keys(notificationInstance).forEach(cacheKey => Promise.resolve(notificationInstance[cacheKey]).then(instance => {
      instance.removeNotice(key);
    }));
  },
  config: setNotificationConfig,
  destroy() {
    Object.keys(notificationInstance).forEach(cacheKey => {
      Promise.resolve(notificationInstance[cacheKey]).then(instance => {
        instance.destroy();
      });
      delete notificationInstance[cacheKey]; // lgtm[js/missing-await]
    });
  }
};
const iconTypes = ['success', 'info', 'warning', 'error'];
iconTypes.forEach(type => {
  api[type] = args => api.open((0, _extends2.default)((0, _extends2.default)({}, args), {
    type
  }));
});
api.warn = api.warning;
api.useNotification = _useNotification.default;
/** @private test Only function. Not work on production */
const getInstance = cacheKey => __awaiter(void 0, void 0, void 0, function* () {
  return process.env.NODE_ENV === 'test' ? notificationInstance[cacheKey] : null;
});
exports.getInstance = getInstance;
var _default = exports.default = api;