import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
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
import { getTransitionGroupProps } from '../_util/transition';
import { toRaw, shallowRef, createVNode, computed, defineComponent, ref, TransitionGroup, onMounted, render as vueRender } from 'vue';
import Notice from './Notice';
import ConfigProvider, { globalConfigForApi } from '../config-provider';
import classNames from '../_util/classNames';
let seed = 0;
const now = Date.now();
function getUuid() {
  const id = seed;
  seed += 1;
  return `rcNotification_${now}_${id}`;
}
const Notification = defineComponent({
  name: 'Notification',
  inheritAttrs: false,
  props: ['prefixCls', 'transitionName', 'animation', 'maxCount', 'closeIcon', 'hashId'],
  setup(props, _ref) {
    let {
      attrs,
      expose,
      slots
    } = _ref;
    const hookRefs = new Map();
    const notices = ref([]);
    const transitionProps = computed(() => {
      const {
        prefixCls,
        animation = 'fade'
      } = props;
      let name = props.transitionName;
      if (!name && animation) {
        name = `${prefixCls}-${animation}`;
      }
      return getTransitionGroupProps(name);
    });
    const add = (originNotice, holderCallback) => {
      const key = originNotice.key || getUuid();
      const notice = _extends(_extends({}, originNotice), {
        key
      });
      const {
        maxCount
      } = props;
      const noticeIndex = notices.value.map(v => v.notice.key).indexOf(key);
      const updatedNotices = notices.value.concat();
      if (noticeIndex !== -1) {
        updatedNotices.splice(noticeIndex, 1, {
          notice,
          holderCallback
        });
      } else {
        if (maxCount && notices.value.length >= maxCount) {
          // XXX, use key of first item to update new added (let React to move exsiting
          // instead of remove and mount). Same key was used before for both a) external
          // manual control and b) internal react 'key' prop , which is not that good.
          // eslint-disable-next-line no-param-reassign
          // zombieJ: Not know why use `updateKey`. This makes Notice infinite loop in jest.
          // Change to `updateMark` for compare instead.
          // https://github.com/react-component/notification/commit/32299e6be396f94040bfa82517eea940db947ece
          notice.key = updatedNotices[0].notice.key;
          notice.updateMark = getUuid();
          // zombieJ: That's why. User may close by key directly.
          // We need record this but not re-render to avoid upper issue
          // https://github.com/react-component/notification/issues/129
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
    const remove = removeKey => {
      notices.value = toRaw(notices.value).filter(_ref2 => {
        let {
          notice: {
            key,
            userPassKey
          }
        } = _ref2;
        const mergedKey = userPassKey || key;
        return mergedKey !== removeKey;
      });
    };
    expose({
      add,
      remove,
      notices
    });
    return () => {
      var _a;
      const {
        prefixCls,
        closeIcon = (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots, {
          prefixCls
        })
      } = props;
      const noticeNodes = notices.value.map((_ref3, index) => {
        let {
          notice,
          holderCallback
        } = _ref3;
        const updateMark = index === notices.value.length - 1 ? notice.updateMark : undefined;
        const {
          key,
          userPassKey
        } = notice;
        const {
          content
        } = notice;
        const noticeProps = _extends(_extends(_extends({
          prefixCls,
          closeIcon: typeof closeIcon === 'function' ? closeIcon({
            prefixCls
          }) : closeIcon
        }, notice), notice.props), {
          key,
          noticeKey: userPassKey || key,
          updateMark,
          onClose: noticeKey => {
            var _a;
            remove(noticeKey);
            (_a = notice.onClose) === null || _a === void 0 ? void 0 : _a.call(notice);
          },
          onClick: notice.onClick
        });
        if (holderCallback) {
          return _createVNode("div", {
            "key": key,
            "class": `${prefixCls}-hook-holder`,
            "ref": div => {
              if (typeof key === 'undefined') {
                return;
              }
              if (div) {
                hookRefs.set(key, div);
                holderCallback(div, noticeProps);
              } else {
                hookRefs.delete(key);
              }
            }
          }, null);
        }
        return _createVNode(Notice, _objectSpread(_objectSpread({}, noticeProps), {}, {
          "class": classNames(noticeProps.class, props.hashId)
        }), {
          default: () => [typeof content === 'function' ? content({
            prefixCls
          }) : content]
        });
      });
      const className = {
        [prefixCls]: 1,
        [attrs.class]: !!attrs.class,
        [props.hashId]: true
      };
      return _createVNode("div", {
        "class": className,
        "style": attrs.style || {
          top: '65px',
          left: '50%'
        }
      }, [_createVNode(TransitionGroup, _objectSpread({
        "tag": "div"
      }, transitionProps.value), {
        default: () => [noticeNodes]
      })]);
    };
  }
});
Notification.newInstance = function newNotificationInstance(properties, callback) {
  const _a = properties || {},
    {
      name = 'notification',
      getContainer,
      appContext,
      prefixCls: customizePrefixCls,
      rootPrefixCls: customRootPrefixCls,
      transitionName: customTransitionName,
      hasTransitionName,
      useStyle
    } = _a,
    props = __rest(_a, ["name", "getContainer", "appContext", "prefixCls", "rootPrefixCls", "transitionName", "hasTransitionName", "useStyle"]);
  const div = document.createElement('div');
  if (getContainer) {
    const root = getContainer();
    root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  const Wrapper = defineComponent({
    compatConfig: {
      MODE: 3
    },
    name: 'NotificationWrapper',
    setup(_props, _ref4) {
      let {
        attrs
      } = _ref4;
      const notiRef = shallowRef();
      const prefixCls = computed(() => globalConfigForApi.getPrefixCls(name, customizePrefixCls));
      const [, hashId] = useStyle(prefixCls);
      onMounted(() => {
        callback({
          notice(noticeProps) {
            var _a;
            (_a = notiRef.value) === null || _a === void 0 ? void 0 : _a.add(noticeProps);
          },
          removeNotice(key) {
            var _a;
            (_a = notiRef.value) === null || _a === void 0 ? void 0 : _a.remove(key);
          },
          destroy() {
            vueRender(null, div);
            if (div.parentNode) {
              div.parentNode.removeChild(div);
            }
          },
          component: notiRef
        });
      });
      return () => {
        const global = globalConfigForApi;
        const rootPrefixCls = global.getRootPrefixCls(customRootPrefixCls, prefixCls.value);
        const transitionName = hasTransitionName ? customTransitionName : `${prefixCls.value}-${customTransitionName}`;
        return _createVNode(ConfigProvider, _objectSpread(_objectSpread({}, global), {}, {
          "prefixCls": rootPrefixCls
        }), {
          default: () => [_createVNode(Notification, _objectSpread(_objectSpread({
            "ref": notiRef
          }, attrs), {}, {
            "prefixCls": prefixCls.value,
            "transitionName": transitionName,
            "hashId": hashId.value
          }), null)]
        });
      };
    }
  });
  const vm = createVNode(Wrapper, props);
  vm.appContext = appContext || vm.appContext;
  vueRender(vm, div);
};
export default Notification;