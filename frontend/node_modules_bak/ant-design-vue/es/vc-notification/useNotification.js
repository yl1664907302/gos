import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { shallowRef, watch } from 'vue';
import HookNotification, { getUuid } from './HookNotification';
const defaultGetContainer = () => document.body;
let uniqueKey = 0;
function mergeConfig() {
  const clone = {};
  for (var _len = arguments.length, objList = new Array(_len), _key = 0; _key < _len; _key++) {
    objList[_key] = arguments[_key];
  }
  objList.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (val !== undefined) {
          clone[key] = val;
        }
      });
    }
  });
  return clone;
}
export default function useNotification() {
  let rootConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
      getContainer = defaultGetContainer,
      motion,
      prefixCls,
      maxCount,
      getClassName,
      getStyles,
      onAllRemoved
    } = rootConfig,
    shareConfig = __rest(rootConfig, ["getContainer", "motion", "prefixCls", "maxCount", "getClassName", "getStyles", "onAllRemoved"]);
  const notices = shallowRef([]);
  const notificationsRef = shallowRef();
  const add = (originNotice, holderCallback) => {
    const key = originNotice.key || getUuid();
    const notice = _extends(_extends({}, originNotice), {
      key
    });
    const noticeIndex = notices.value.map(v => v.notice.key).indexOf(key);
    const updatedNotices = notices.value.concat();
    if (noticeIndex !== -1) {
      updatedNotices.splice(noticeIndex, 1, {
        notice,
        holderCallback
      });
    } else {
      if (maxCount && notices.value.length >= maxCount) {
        notice.key = updatedNotices[0].notice.key;
        notice.updateMark = getUuid();
        notice.userPassKey = key;
        updatedNotices.shift();
      }
      updatedNotices.push({
        notice,
        holderCallback
      });
    }
    notices.value = updatedNotices;
  };
  const removeNotice = removeKey => {
    notices.value = notices.value.filter(_ref => {
      let {
        notice: {
          key,
          userPassKey
        }
      } = _ref;
      const mergedKey = userPassKey || key;
      return mergedKey !== removeKey;
    });
  };
  const destroy = () => {
    notices.value = [];
  };
  const contextHolder = () => _createVNode(HookNotification, {
    "ref": notificationsRef,
    "prefixCls": prefixCls,
    "maxCount": maxCount,
    "notices": notices.value,
    "remove": removeNotice,
    "getClassName": getClassName,
    "getStyles": getStyles,
    "animation": motion,
    "hashId": rootConfig.hashId,
    "onAllRemoved": onAllRemoved,
    "getContainer": getContainer
  }, null);
  const taskQueue = shallowRef([]);
  // ========================= Refs =========================
  const api = {
    open: config => {
      const mergedConfig = mergeConfig(shareConfig, config);
      //@ts-ignore
      if (mergedConfig.key === null || mergedConfig.key === undefined) {
        //@ts-ignore
        mergedConfig.key = `vc-notification-${uniqueKey}`;
        uniqueKey += 1;
      }
      taskQueue.value = [...taskQueue.value, {
        type: 'open',
        config: mergedConfig
      }];
    },
    close: key => {
      taskQueue.value = [...taskQueue.value, {
        type: 'close',
        key
      }];
    },
    destroy: () => {
      taskQueue.value = [...taskQueue.value, {
        type: 'destroy'
      }];
    }
  };
  // ======================== Effect ========================
  watch(taskQueue, () => {
    // Flush task when node ready
    if (taskQueue.value.length) {
      taskQueue.value.forEach(task => {
        switch (task.type) {
          case 'open':
            // @ts-ignore
            add(task.config);
            break;
          case 'close':
            removeNotice(task.key);
            break;
          case 'destroy':
            destroy();
            break;
        }
      });
      taskQueue.value = [];
    }
  });
  // ======================== Return ========================
  return [api, contextHolder];
}