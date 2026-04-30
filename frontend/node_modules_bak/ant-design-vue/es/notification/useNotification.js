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
import useStyle from './style';
import { getCloseIcon, PureContent } from './PurePanel';
import { getMotion, getPlacementStyle } from './util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
const DEFAULT_OFFSET = 24;
const DEFAULT_DURATION = 4.5;
const Holder = defineComponent({
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
    } = useConfigInject('notification', props);
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
    // =============================== Style ===============================
    const getStyles = placement => {
      var _a, _b;
      return getPlacementStyle(placement, (_a = props.top) !== null && _a !== void 0 ? _a : DEFAULT_OFFSET, (_b = props.bottom) !== null && _b !== void 0 ? _b : DEFAULT_OFFSET);
    };
    // Style
    const [, hashId] = useStyle(prefixCls);
    const getClassName = () => classNames(hashId.value, {
      [`${prefixCls.value}-rtl`]: props.rtl
    });
    // ============================== Motion ===============================
    const getNotificationMotion = () => getMotion(prefixCls.value);
    // ============================== Origin ===============================
    const [api, holder] = useVcNotification({
      prefixCls: prefixCls.value,
      getStyles,
      getClassName,
      motion: getNotificationMotion,
      closable: true,
      closeIcon: getCloseIcon(prefixCls.value),
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
    expose(_extends(_extends({}, api), {
      prefixCls: prefixCls.value,
      hashId
    }));
    return holder;
  }
});
// ==============================================================================
// ==                                   Hook                                   ==
// ==============================================================================
export function useInternalNotification(notificationConfig) {
  const holderRef = shallowRef(null);
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
    return originOpen(_extends(_extends({
      placement: 'topRight'
    }, restConfig), {
      content: () => _createVNode(PureContent, {
        "prefixCls": noticePrefixCls,
        "icon": typeof icon === 'function' ? icon() : icon,
        "type": type,
        "message": typeof message === 'function' ? message() : message,
        "description": typeof description === 'function' ? description() : description,
        "btn": typeof btn === 'function' ? btn() : btn
      }, null),
      // @ts-ignore
      class: classNames(type && `${noticePrefixCls}-${type}`, hashId, className)
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
    wrapAPI[type] = config => open(_extends(_extends({}, config), {
      type
    }));
  });
  // ============================== Return ===============================
  return [wrapAPI, () => _createVNode(Holder, _objectSpread(_objectSpread({
    "key": holderKey
  }, notificationConfig), {}, {
    "ref": holderRef
  }), null)];
}
export default function useNotification(notificationConfig) {
  return useInternalNotification(notificationConfig);
}