"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawerProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../_util/props-util");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcDrawer = _interopRequireDefault(require("../vc-drawer"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _type = require("../_util/type");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _style = _interopRequireDefault(require("./style"));
var _Compact = require("../space/Compact");
var _isNumeric = _interopRequireDefault(require("../_util/isNumeric"));
var _transition = require("../_util/transition");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const PlacementTypes = ['top', 'right', 'bottom', 'left'];
const SizeTypes = ['default', 'large'];
const defaultPushState = {
  distance: 180
};
const drawerProps = () => ({
  autofocus: {
    type: Boolean,
    default: undefined
  },
  closable: {
    type: Boolean,
    default: undefined
  },
  closeIcon: _vueTypes.default.any,
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
  maskStyle: (0, _type.objectType)(),
  rootClassName: String,
  rootStyle: (0, _type.objectType)(),
  size: {
    type: String
  },
  drawerStyle: (0, _type.objectType)(),
  headerStyle: (0, _type.objectType)(),
  bodyStyle: (0, _type.objectType)(),
  contentWrapperStyle: {
    type: Object,
    default: undefined
  },
  title: _vueTypes.default.any,
  /** @deprecated Please use `open` instead */
  visible: {
    type: Boolean,
    default: undefined
  },
  open: {
    type: Boolean,
    default: undefined
  },
  width: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number]),
  height: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number]),
  zIndex: Number,
  prefixCls: String,
  push: _vueTypes.default.oneOfType([_vueTypes.default.looseBool, {
    type: Object
  }]),
  placement: _vueTypes.default.oneOf(PlacementTypes),
  keyboard: {
    type: Boolean,
    default: undefined
  },
  extra: _vueTypes.default.any,
  footer: _vueTypes.default.any,
  footerStyle: (0, _type.objectType)(),
  level: _vueTypes.default.any,
  levelMove: {
    type: [Number, Array, Function]
  },
  handle: _vueTypes.default.any,
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
exports.drawerProps = drawerProps;
const Drawer = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ADrawer',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(drawerProps(), {
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
    const sPush = (0, _vue.shallowRef)(false);
    const destroyClose = (0, _vue.shallowRef)(false);
    const vcDrawer = (0, _vue.shallowRef)(null);
    const load = (0, _vue.shallowRef)(false);
    const visible = (0, _vue.shallowRef)(false);
    const mergedOpen = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.open) !== null && _a !== void 0 ? _a : props.visible;
    });
    (0, _vue.watch)(mergedOpen, () => {
      if (mergedOpen.value) {
        load.value = true;
      } else {
        visible.value = false;
      }
    }, {
      immediate: true
    });
    (0, _vue.watch)([mergedOpen, load], () => {
      if (mergedOpen.value && load.value) {
        visible.value = true;
      }
    }, {
      immediate: true
    });
    const parentDrawerOpts = (0, _vue.inject)('parentDrawerOpts', null);
    const {
      prefixCls,
      getPopupContainer,
      direction
    } = (0, _useConfigInject.default)('drawer', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const getContainer = (0, _vue.computed)(() =>
    // 有可能为 false，所以不能直接判断
    props.getContainer === undefined && (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value) ? () => getPopupContainer.value(document.body) : props.getContainer);
    (0, _devWarning.default)(!props.afterVisibleChange, 'Drawer', '`afterVisibleChange` prop is deprecated, please use `@afterVisibleChange` event instead');
    // ========================== Warning ===========================
    if (process.env.NODE_ENV !== 'production') {
      [['visible', 'open'], ['onUpdate:visible', 'onUpdate:open'], ['onAfterVisibleChange', 'onAfterOpenChange']].forEach(_ref2 => {
        let [deprecatedName, newName] = _ref2;
        (0, _devWarning.default)(!props[deprecatedName], 'Drawer', `\`${deprecatedName}\` is deprecated, please use \`${newName}\` instead.`);
      });
    }
    const setPush = () => {
      sPush.value = true;
    };
    const setPull = () => {
      sPush.value = false;
      (0, _vue.nextTick)(() => {
        domFocus();
      });
    };
    (0, _vue.provide)('parentDrawerOpts', {
      setPush,
      setPull
    });
    (0, _vue.onMounted)(() => {
      if (mergedOpen.value && parentDrawerOpts) {
        parentDrawerOpts.setPush();
      }
    });
    (0, _vue.onUnmounted)(() => {
      if (parentDrawerOpts) {
        parentDrawerOpts.setPull();
      }
    });
    (0, _vue.watch)(visible, () => {
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
    const pushTransform = (0, _vue.computed)(() => {
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
    const mergedWidth = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.width) !== null && _a !== void 0 ? _a : props.size === 'large' ? 736 : 378;
    });
    const mergedHeight = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.height) !== null && _a !== void 0 ? _a : props.size === 'large' ? 736 : 378;
    });
    const offsetStyle = (0, _vue.computed)(() => {
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
        val.width = (0, _isNumeric.default)(mergedWidth.value) ? `${mergedWidth.value}px` : mergedWidth.value;
      } else {
        val.height = (0, _isNumeric.default)(mergedHeight.value) ? `${mergedHeight.value}px` : mergedHeight.value;
      }
      return val;
    });
    const wrapperStyle = (0, _vue.computed)(() => {
      const {
        zIndex,
        contentWrapperStyle
      } = props;
      const val = offsetStyle.value;
      return [{
        zIndex,
        transform: sPush.value ? pushTransform.value : undefined
      }, (0, _extends2.default)({}, contentWrapperStyle), val];
    });
    const renderHeader = prefixCls => {
      const {
        closable,
        headerStyle
      } = props;
      const extra = (0, _propsUtil.getPropsSlot)(slots, props, 'extra');
      const title = (0, _propsUtil.getPropsSlot)(slots, props, 'title');
      if (!title && !closable) {
        return null;
      }
      return (0, _vue.createVNode)("div", {
        "class": (0, _classNames.default)(`${prefixCls}-header`, {
          [`${prefixCls}-header-close-only`]: closable && !title && !extra
        }),
        "style": headerStyle
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-header-title`
      }, [renderCloseIcon(prefixCls), title && (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-title`
      }, [title])]), extra && (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-extra`
      }, [extra])]);
    };
    const renderCloseIcon = prefixCls => {
      var _a;
      const {
        closable
      } = props;
      const $closeIcon = slots.closeIcon ? (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots) : props.closeIcon;
      return closable && (0, _vue.createVNode)("button", {
        "key": "closer",
        "onClick": close,
        "aria-label": "Close",
        "class": `${prefixCls}-close`
      }, [$closeIcon === undefined ? (0, _vue.createVNode)(_CloseOutlined.default, null, null) : $closeIcon]);
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
      return (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-wrapper-body`,
        "style": drawerStyle
      }, [renderHeader(prefixCls), (0, _vue.createVNode)("div", {
        "key": "body",
        "class": `${prefixCls}-body`,
        "style": bodyStyle
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), renderFooter(prefixCls)]);
    };
    const renderFooter = prefixCls => {
      const footer = (0, _propsUtil.getPropsSlot)(slots, props, 'footer');
      if (!footer) {
        return null;
      }
      const footerClassName = `${prefixCls}-footer`;
      return (0, _vue.createVNode)("div", {
        "class": footerClassName,
        "style": props.footerStyle
      }, [footer]);
    };
    const drawerClassName = (0, _vue.computed)(() => (0, _classNames.default)({
      'no-mask': !props.mask,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }, props.rootClassName, hashId.value));
    // =========================== Motion ===========================
    const maskMotion = (0, _vue.computed)(() => {
      return (0, _transition.getTransitionProps)((0, _transition.getTransitionName)(prefixCls.value, 'mask-motion'));
    });
    const panelMotion = motionPlacement => {
      return (0, _transition.getTransitionProps)((0, _transition.getTransitionName)(prefixCls.value, `panel-motion-${motionPlacement}`));
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
      const vcDrawerProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), (0, _omit.default)(rest, ['size', 'closeIcon', 'closable', 'destroyOnClose', 'drawerStyle', 'headerStyle', 'bodyStyle', 'title', 'push', 'onAfterVisibleChange', 'onClose', 'onUpdate:visible', 'onUpdate:open', 'visible'])), {
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
      return wrapSSR((0, _vue.createVNode)(_Compact.NoCompactStyle, null, {
        default: () => [(0, _vue.createVNode)(_vcDrawer.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, vcDrawerProps), {}, {
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
var _default = exports.default = (0, _type.withInstall)(Drawer);