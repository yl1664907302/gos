"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.avatarProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../_util/props-util");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _useBreakpoint = _interopRequireDefault(require("../_util/hooks/useBreakpoint"));
var _responsiveObserve = require("../_util/responsiveObserve");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
var _eagerComputed = _interopRequireDefault(require("../_util/eagerComputed"));
var _style = _interopRequireDefault(require("./style"));
var _AvatarContext = require("./AvatarContext");
const avatarProps = () => ({
  prefixCls: String,
  shape: {
    type: String,
    default: 'circle'
  },
  size: {
    type: [Number, String, Object],
    default: () => 'default'
  },
  src: String,
  /** Srcset of image avatar */
  srcset: String,
  icon: _vueTypes.default.any,
  alt: String,
  gap: Number,
  draggable: {
    type: Boolean,
    default: undefined
  },
  crossOrigin: String,
  loadError: {
    type: Function
  }
});
exports.avatarProps = avatarProps;
const Avatar = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AAvatar',
  inheritAttrs: false,
  props: avatarProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const isImgExist = (0, _vue.shallowRef)(true);
    const isMounted = (0, _vue.shallowRef)(false);
    const scale = (0, _vue.shallowRef)(1);
    const avatarChildrenRef = (0, _vue.shallowRef)(null);
    const avatarNodeRef = (0, _vue.shallowRef)(null);
    const {
      prefixCls
    } = (0, _useConfigInject.default)('avatar', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const avatarCtx = (0, _AvatarContext.useAvatarInjectContext)();
    const size = (0, _vue.computed)(() => {
      return props.size === 'default' ? avatarCtx.size : props.size;
    });
    const screens = (0, _useBreakpoint.default)();
    const responsiveSize = (0, _eagerComputed.default)(() => {
      if (typeof props.size !== 'object') {
        return undefined;
      }
      const currentBreakpoint = _responsiveObserve.responsiveArray.find(screen => screens.value[screen]);
      const currentSize = props.size[currentBreakpoint];
      return currentSize;
    });
    const responsiveSizeStyle = hasIcon => {
      if (responsiveSize.value) {
        return {
          width: `${responsiveSize.value}px`,
          height: `${responsiveSize.value}px`,
          lineHeight: `${responsiveSize.value}px`,
          fontSize: `${hasIcon ? responsiveSize.value / 2 : 18}px`
        };
      }
      return {};
    };
    const setScaleParam = () => {
      if (!avatarChildrenRef.value || !avatarNodeRef.value) {
        return;
      }
      const childrenWidth = avatarChildrenRef.value.offsetWidth; // offsetWidth avoid affecting be transform scale
      const nodeWidth = avatarNodeRef.value.offsetWidth;
      // denominator is 0 is no meaning
      if (childrenWidth !== 0 && nodeWidth !== 0) {
        const {
          gap = 4
        } = props;
        if (gap * 2 < nodeWidth) {
          scale.value = nodeWidth - gap * 2 < childrenWidth ? (nodeWidth - gap * 2) / childrenWidth : 1;
        }
      }
    };
    const handleImgLoadError = () => {
      const {
        loadError
      } = props;
      const errorFlag = loadError === null || loadError === void 0 ? void 0 : loadError();
      if (errorFlag !== false) {
        isImgExist.value = false;
      }
    };
    (0, _vue.watch)(() => props.src, () => {
      (0, _vue.nextTick)(() => {
        isImgExist.value = true;
        scale.value = 1;
      });
    });
    (0, _vue.watch)(() => props.gap, () => {
      (0, _vue.nextTick)(() => {
        setScaleParam();
      });
    });
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        setScaleParam();
        isMounted.value = true;
      });
    });
    return () => {
      var _a, _b;
      const {
        shape,
        src,
        alt,
        srcset,
        draggable,
        crossOrigin
      } = props;
      const mergeShape = (_a = avatarCtx.shape) !== null && _a !== void 0 ? _a : shape;
      const icon = (0, _propsUtil.getPropsSlot)(slots, props, 'icon');
      const pre = prefixCls.value;
      const classString = {
        [`${attrs.class}`]: !!attrs.class,
        [pre]: true,
        [`${pre}-lg`]: size.value === 'large',
        [`${pre}-sm`]: size.value === 'small',
        [`${pre}-${mergeShape}`]: true,
        [`${pre}-image`]: src && isImgExist.value,
        [`${pre}-icon`]: icon,
        [hashId.value]: true
      };
      const sizeStyle = typeof size.value === 'number' ? {
        width: `${size.value}px`,
        height: `${size.value}px`,
        lineHeight: `${size.value}px`,
        fontSize: icon ? `${size.value / 2}px` : '18px'
      } : {};
      const children = (_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots);
      let childrenToRender;
      if (src && isImgExist.value) {
        childrenToRender = (0, _vue.createVNode)("img", {
          "draggable": draggable,
          "src": src,
          "srcset": srcset,
          "onError": handleImgLoadError,
          "alt": alt,
          "crossorigin": crossOrigin
        }, null);
      } else if (icon) {
        childrenToRender = icon;
      } else if (isMounted.value || scale.value !== 1) {
        const transformString = `scale(${scale.value}) translateX(-50%)`;
        const childrenStyle = {
          msTransform: transformString,
          WebkitTransform: transformString,
          transform: transformString
        };
        const sizeChildrenStyle = typeof size.value === 'number' ? {
          lineHeight: `${size.value}px`
        } : {};
        childrenToRender = (0, _vue.createVNode)(_vcResizeObserver.default, {
          "onResize": setScaleParam
        }, {
          default: () => [(0, _vue.createVNode)("span", {
            "class": `${pre}-string`,
            "ref": avatarChildrenRef,
            "style": (0, _extends2.default)((0, _extends2.default)({}, sizeChildrenStyle), childrenStyle)
          }, [children])]
        });
      } else {
        childrenToRender = (0, _vue.createVNode)("span", {
          "class": `${pre}-string`,
          "ref": avatarChildrenRef,
          "style": {
            opacity: 0
          }
        }, [children]);
      }
      return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "ref": avatarNodeRef,
        "class": classString,
        "style": [sizeStyle, responsiveSizeStyle(!!icon), attrs.style]
      }), [childrenToRender]));
    };
  }
});
var _default = exports.default = Avatar;