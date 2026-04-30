import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
import Notification from '../vc-notification';
import CheckCircleOutlined from "@ant-design/icons-vue/es/icons/CheckCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons-vue/es/icons/InfoCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons-vue/es/icons/CloseCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons-vue/es/icons/ExclamationCircleOutlined";
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import { renderHelper } from '../_util/util';
import { globalConfig } from '../config-provider';
import classNames from '../_util/classNames';
import useStyle from './style';
import useNotification from './useNotification';
import { getPlacementStyle } from './util';
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
  } = globalConfig();
  const prefixCls = getPrefixCls('notification', customizePrefixCls || defaultPrefixCls);
  const cacheKey = `${prefixCls}-${placement}-${rtl}`;
  const cacheInstance = notificationInstance[cacheKey];
  if (cacheInstance) {
    Promise.resolve(cacheInstance).then(instance => {
      callback(instance);
    });
    return;
  }
  const notificationClass = classNames(`${prefixCls}-${placement}`, {
    [`${prefixCls}-rtl`]: rtl === true
  });
  Notification.newInstance({
    name: 'notification',
    prefixCls: customizePrefixCls || defaultPrefixCls,
    useStyle,
    class: notificationClass,
    style: getPlacementStyle(placement, top !== null && top !== void 0 ? top : defaultTop, bottom !== null && bottom !== void 0 ? bottom : defaultBottom),
    appContext,
    getContainer,
    closeIcon: _ref2 => {
      let {
        prefixCls
      } = _ref2;
      const closeIconToRender = _createVNode("span", {
        "class": `${prefixCls}-close-x`
      }, [renderHelper(closeIcon, {}, _createVNode(CloseOutlined, {
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
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined
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
          iconNode = () => _createVNode("span", {
            "class": `${prefixCls}-icon`
          }, [renderHelper(icon)]);
        } else if (type) {
          const Icon = typeToIcon[type];
          iconNode = () => _createVNode(Icon, {
            "class": `${prefixCls}-icon ${prefixCls}-icon-${type}`
          }, null);
        }
        return _createVNode("div", {
          "class": iconNode ? `${prefixCls}-with-icon` : ''
        }, [iconNode && iconNode(), _createVNode("div", {
          "class": `${prefixCls}-message`
        }, [!description && iconNode ? _createVNode("span", {
          "class": `${prefixCls}-message-single-line-auto-margin`
        }, null) : null, renderHelper(message)]), _createVNode("div", {
          "class": `${prefixCls}-description`
        }, [renderHelper(description)]), btn ? _createVNode("span", {
          "class": `${prefixCls}-btn`
        }, [renderHelper(btn)]) : null]);
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
  api[type] = args => api.open(_extends(_extends({}, args), {
    type
  }));
});
api.warn = api.warning;
api.useNotification = useNotification;
/** @private test Only function. Not work on production */
export const getInstance = cacheKey => __awaiter(void 0, void 0, void 0, function* () {
  return process.env.NODE_ENV === 'test' ? notificationInstance[cacheKey] : null;
});
export default api;