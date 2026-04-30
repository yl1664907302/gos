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
import { shallowRef, computed, defineComponent } from 'vue';
import { useNotification as useVcNotification } from '../vc-notification';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import useStyle from './style';
import { PureContent } from './PurePanel';
import { getMotion } from '../vc-trigger/utils/motionUtil';
import { wrapPromiseFn } from '../_util/util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
const DEFAULT_OFFSET = 8;
const DEFAULT_DURATION = 3;
const Holder = defineComponent({
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
    } = useConfigInject('message', props);
    const prefixCls = computed(() => getPrefixCls('message', props.prefixCls));
    const [, hashId] = useStyle(prefixCls);
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
    const getClassName = () => classNames(hashId.value, props.rtl ? `${prefixCls.value}-rtl` : '');
    // ============================== Motion ===============================
    const getNotificationMotion = () => {
      var _a;
      return getMotion({
        prefixCls: prefixCls.value,
        animation: (_a = props.animation) !== null && _a !== void 0 ? _a : `move-up`,
        transitionName: props.transitionName
      });
    };
    // ============================ Close Icon =============================
    const mergedCloseIcon = _createVNode("span", {
      "class": `${prefixCls.value}-close-x`
    }, [_createVNode(CloseOutlined, {
      "class": `${prefixCls.value}-close-icon`
    }, null)]);
    // ============================== Origin ===============================
    const [api, holder] = useVcNotification({
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
    expose(_extends(_extends({}, api), {
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
export function useInternalMessage(messageConfig) {
  const holderRef = shallowRef(null);
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
    return wrapPromiseFn(resolve => {
      originOpen(_extends(_extends({}, restConfig), {
        key: mergedKey,
        content: () => _createVNode(PureContent, {
          "prefixCls": prefixCls,
          "type": type,
          "icon": typeof icon === 'function' ? icon() : icon
        }, {
          default: () => [typeof content === 'function' ? content() : content]
        }),
        placement: 'top',
        // @ts-ignore
        class: classNames(type && `${noticePrefixCls}-${type}`, hashId, className),
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
      const mergedConfig = _extends(_extends({
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
  return [wrapAPI, () => _createVNode(Holder, _objectSpread(_objectSpread({
    "key": holderKey
  }, messageConfig), {}, {
    "ref": holderRef
  }), null)];
}
export default function useMessage(messageConfig) {
  return useInternalMessage(messageConfig);
}