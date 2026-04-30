import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { inject, nextTick, defineComponent, shallowRef, onMounted, provide, onUnmounted, watch, computed } from 'vue';
import { getPropsSlot, initDefaultProps } from '../_util/props-util';
import classnames from '../_util/classNames';
import VcDrawer from '../vc-drawer';
import PropTypes from '../_util/vue-types';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { objectType, withInstall } from '../_util/type';
import omit from '../_util/omit';
import devWarning from '../vc-util/devWarning';
import useStyle from './style';
import { NoCompactStyle } from '../space/Compact';
import isNumeric from '../_util/isNumeric';
import { getTransitionName, getTransitionProps } from '../_util/transition';
const PlacementTypes = ['top', 'right', 'bottom', 'left'];
const SizeTypes = ['default', 'large'];
const defaultPushState = {
  distance: 180
};
export const drawerProps = () => ({
  autofocus: {
    type: Boolean,
    default: undefined
  },
  closable: {
    type: Boolean,
    default: undefined
  },
  closeIcon: PropTypes.any,
  destroyOnClose: {
    type: Boolean,
    default: undefined
  },
  forceRender: {
    type: Boolean,
    default: undefined
  },
  getContainer: {
    type: [String, Function, Boolean, Object],
    default: undefined
  },
  maskClosable: {
    type: Boolean,
    default: undefined
  },
  mask: {
    type: Boolean,
    default: undefined
  },
  maskStyle: objectType(),
  rootClassName: String,
  rootStyle: objectType(),
  size: {
    type: String
  },
  drawerStyle: objectType(),
  headerStyle: objectType(),
  bodyStyle: objectType(),
  contentWrapperStyle: {
    type: Object,
    default: undefined
  },
  title: PropTypes.any,
  /** @deprecated Please use `open` instead */
  visible: {
    type: Boolean,
    default: undefined
  },
  open: {
    type: Boolean,
    default: undefined
  },
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: Number,
  prefixCls: String,
  push: PropTypes.oneOfType([PropTypes.looseBool, {
    type: Object
  }]),
  placement: PropTypes.oneOf(PlacementTypes),
  keyboard: {
    type: Boolean,
    default: undefined
  },
  extra: PropTypes.any,
  footer: PropTypes.any,
  footerStyle: objectType(),
  level: PropTypes.any,
  levelMove: {
    type: [Number, Array, Function]
  },
  handle: PropTypes.any,
  /** @deprecated Use `@afterVisibleChange` instead */
  afterVisibleChange: Function,
  /** @deprecated Please use `@afterOpenChange` instead */
  onAfterVisibleChange: Function,
  onAfterOpenChange: Function,
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': Function,
  'onUpdate:open': Function,
  onClose: Function
});
const Drawer = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ADrawer',
  inheritAttrs: false,
  props: initDefaultProps(drawerProps(), {
    closable: true,
    placement: 'right',
    maskClosable: true,
    mask: true,
    level: null,
    keyboard: true,
    push: defaultPushState
  }),
  slots: Object,
  // emits: ['update:visible', 'close', 'afterVisibleChange'],
  setup(props, _ref) {
    let {
      emit,
      slots,
      attrs
    } = _ref;
    const sPush = shallowRef(false);
    const destroyClose = shallowRef(false);
    const vcDrawer = shallowRef(null);
    const load = shallowRef(false);
    const visible = shallowRef(false);
    const mergedOpen = computed(() => {
      var _a;
      return (_a = props.open) !== null && _a !== void 0 ? _a : props.visible;
    });
    watch(mergedOpen, () => {
      if (mergedOpen.value) {
        load.value = true;
      } else {
        visible.value = false;
      }
    }, {
      immediate: true
    });
    watch([mergedOpen, load], () => {
      if (mergedOpen.value && load.value) {
        visible.value = true;
      }
    }, {
      immediate: true
    });
    const parentDrawerOpts = inject('parentDrawerOpts', null);
    const {
      prefixCls,
      getPopupContainer,
      direction
    } = useConfigInject('drawer', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getContainer = computed(() =>
    // 有可能为 false，所以不能直接判断
    props.getContainer === undefined && (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value) ? () => getPopupContainer.value(document.body) : props.getContainer);
    devWarning(!props.afterVisibleChange, 'Drawer', '`afterVisibleChange` prop is deprecated, please use `@afterVisibleChange` event instead');
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      [['visible', 'open'], ['onUpdate:visible', 'onUpdate:open'], ['onAfterVisibleChange', 'onAfterOpenChange']].forEach(_ref2 => {
        let [deprecatedName, newName] = _ref2;
        devWarning(!props[deprecatedName], 'Drawer', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`);
      });
    }
    const setPush = () => {
      sPush.value = true;
    };
    const setPull = () => {
      sPush.value = false;
      nextTick(() => {
        domFocus();
      });
    };
    provide('parentDrawerOpts', {
      setPush,
      setPull
    });
    onMounted(() => {
      if (mergedOpen.value && parentDrawerOpts) {
        parentDrawerOpts.setPush();
      }
    });
    onUnmounted(() => {
      if (parentDrawerOpts) {
        parentDrawerOpts.setPull();
      }
    });
    watch(visible, () => {
      if (parentDrawerOpts) {
        if (visible.value) {
          parentDrawerOpts.setPush();
        } else {
          parentDrawerOpts.setPull();
        }
      }
    }, {
      flush: 'post'
    });
    const domFocus = () => {
      var _a, _b;
      (_b = (_a = vcDrawer.value) === null || _a === void 0 ? void 0 : _a.domFocus) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    const close = e => {
      emit('update:visible', false);
      emit('update:open', false);
      emit('close', e);
    };
    const afterVisibleChange = open => {
      var _a;
      if (!open) {
        if (destroyClose.value === false) {
          // set true only once
          destroyClose.value = true;
        }
        if (props.destroyOnClose) {
          load.value = false;
        }
      }
      (_a = props.afterVisibleChange) === null || _a === void 0 ? void 0 : _a.call(props, open);
      emit('afterVisibleChange', open);
      emit('afterOpenChange', open);
    };
    const pushTransform = computed(() => {
      const {
        push,
        placement
      } = props;
      let distance;
      if (typeof push === 'boolean') {
        distance = push ? defaultPushState.distance : 0;
      } else {
        distance = push.distance;
      }
      distance = parseFloat(String(distance || 0));
      if (placement === 'left' || placement === 'right') {
        return `translateX(${placement === 'left' ? distance : -distance}px)`;
      }
      if (placement === 'top' || placement === 'bottom') {
        return `translateY(${placement === 'top' ? distance : -distance}px)`;
      }
      return null;
    });
    // ============================ Size ============================
    const mergedWidth = computed(() => {
      var _a;
      return (_a = props.width) !== null && _a !== void 0 ? _a : props.size === 'large' ? 736 : 378;
    });
    const mergedHeight = computed(() => {
      var _a;
      return (_a = props.height) !== null && _a !== void 0 ? _a : props.size === 'large' ? 736 : 378;
    });
    const offsetStyle = computed(() => {
      // https://github.com/ant-design/ant-design/issues/24287
      const {
        mask,
        placement
      } = props;
      if (!visible.value && !mask) {
        return {};
      }
      const val = {};
      if (placement === 'left' || placement === 'right') {
        val.width = isNumeric(mergedWidth.value) ? `${mergedWidth.value}px` : mergedWidth.value;
      } else {
        val.height = isNumeric(mergedHeight.value) ? `${mergedHeight.value}px` : mergedHeight.value;
      }
      return val;
    });
    const wrapperStyle = computed(() => {
      const {
        zIndex,
        contentWrapperStyle
      } = props;
      const val = offsetStyle.value;
      return [{
        zIndex,
        transform: sPush.value ? pushTransform.value : undefined
      }, _extends({}, contentWrapperStyle), val];
    });
    const renderHeader = prefixCls => {
      const {
        closable,
        headerStyle
      } = props;
      const extra = getPropsSlot(slots, props, 'extra');
      const title = getPropsSlot(slots, props, 'title');
      if (!title && !closable) {
        return null;
      }
      return _createVNode("div", {
        "class": classnames(`${prefixCls}-header`, {
          [`${prefixCls}-header-close-only`]: closable && !title && !extra
        }),
        "style": headerStyle
      }, [_createVNode("div", {
        "class": `${prefixCls}-header-title`
      }, [renderCloseIcon(prefixCls), title && _createVNode("div", {
        "class": `${prefixCls}-title`
      }, [title])]), extra && _createVNode("div", {
        "class": `${prefixCls}-extra`
      }, [extra])]);
    };
    const renderCloseIcon = prefixCls => {
      var _a;
      const {
        closable
      } = props;
      const $closeIcon = slots.closeIcon ? (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots) : props.closeIcon;
      return closable && _createVNode("button", {
        "key": "closer",
        "onClick": close,
        "aria-label": "Close",
        "class": `${prefixCls}-close`
      }, [$closeIcon === undefined ? _createVNode(CloseOutlined, null, null) : $closeIcon]);
    };
    const renderBody = prefixCls => {
      var _a;
      if (destroyClose.value && !props.forceRender && !load.value) {
        return null;
      }
      const {
        bodyStyle,
        drawerStyle
      } = props;
      return _createVNode("div", {
        "class": `${prefixCls}-wrapper-body`,
        "style": drawerStyle
      }, [renderHeader(prefixCls), _createVNode("div", {
        "key": "body",
        "class": `${prefixCls}-body`,
        "style": bodyStyle
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), renderFooter(prefixCls)]);
    };
    const renderFooter = prefixCls => {
      const footer = getPropsSlot(slots, props, 'footer');
      if (!footer) {
        return null;
      }
      const footerClassName = `${prefixCls}-footer`;
      return _createVNode("div", {
        "class": footerClassName,
        "style": props.footerStyle
      }, [footer]);
    };
    const drawerClassName = computed(() => classnames({
      'no-mask': !props.mask,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }, props.rootClassName, hashId.value));
    // =========================== Motion ===========================
    const maskMotion = computed(() => {
      return getTransitionProps(getTransitionName(prefixCls.value, 'mask-motion'));
    });
    const panelMotion = motionPlacement => {
      return getTransitionProps(getTransitionName(prefixCls.value, `panel-motion-${motionPlacement}`));
    };
    return () => {
      const {
          width,
          height,
          placement,
          mask,
          forceRender
        } = props,
        rest = __rest(props, ["width", "height", "placement", "mask", "forceRender"]);
      const vcDrawerProps = _extends(_extends(_extends({}, attrs), omit(rest, ['size', 'closeIcon', 'closable', 'destroyOnClose', 'drawerStyle', 'headerStyle', 'bodyStyle', 'title', 'push', 'onAfterVisibleChange', 'onClose', 'onUpdate:visible', 'onUpdate:open', 'visible'])), {
        forceRender,
        onClose: close,
        afterVisibleChange,
        handler: false,
        prefixCls: prefixCls.value,
        open: visible.value,
        showMask: mask,
        placement,
        ref: vcDrawer
      });
      return wrapSSR(_createVNode(NoCompactStyle, null, {
        default: () => [_createVNode(VcDrawer, _objectSpread(_objectSpread({}, vcDrawerProps), {}, {
          "maskMotion": maskMotion.value,
          "motion": panelMotion,
          "width": mergedWidth.value,
          "height": mergedHeight.value,
          "getContainer": getContainer.value,
          "rootClassName": drawerClassName.value,
          "rootStyle": props.rootStyle,
          "contentWrapperStyle": wrapperStyle.value
        }), {
          handler: props.handle ? () => props.handle : slots.handle,
          default: () => renderBody(prefixCls.value)
        })]
      }));
    };
  }
});
export default withInstall(Drawer);