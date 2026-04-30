"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _VerticalAlignTopOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/VerticalAlignTopOutlined"));
var _transition = require("../_util/transition");
var _FloatButton = _interopRequireWildcard(require("./FloatButton"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _getScroll = _interopRequireDefault(require("../_util/getScroll"));
var _scrollTo = _interopRequireDefault(require("../_util/scrollTo"));
var _throttleByAnimationFrame = _interopRequireDefault(require("../_util/throttleByAnimationFrame"));
var _propsUtil = require("../_util/props-util");
var _interface = require("./interface");
var _style = _interopRequireDefault(require("./style"));
var _context = require("./context");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BackTop = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ABackTop',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _interface.backTopProps)(), {
    visibilityHeight: 400,
    target: () => window,
    duration: 450,
    type: 'default',
    shape: 'circle'
  }),
  // emits: ['click'],
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)(_FloatButton.floatButtonPrefixCls, props);
    const [wrapSSR] = (0, _style.default)(prefixCls);
    const domRef = (0, _vue.ref)();
    const state = (0, _vue.reactive)({
      visible: props.visibilityHeight === 0,
      scrollEvent: null
    });
    const getDefaultTarget = () => domRef.value && domRef.value.ownerDocument ? domRef.value.ownerDocument : window;
    const scrollToTop = e => {
      const {
        target = getDefaultTarget,
        duration
      } = props;
      (0, _scrollTo.default)(0, {
        getContainer: target,
        duration
      });
      emit('click', e);
    };
    const handleScroll = (0, _throttleByAnimationFrame.default)(e => {
      const {
        visibilityHeight
      } = props;
      const scrollTop = (0, _getScroll.default)(e.target, true);
      state.visible = scrollTop >= visibilityHeight;
    });
    const bindScrollEvent = () => {
      const {
        target
      } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll({
        target: container
      });
      container === null || container === void 0 ? void 0 : container.addEventListener('scroll', handleScroll);
    };
    const scrollRemove = () => {
      const {
        target
      } = props;
      const getTarget = target || getDefaultTarget;
      const container = getTarget();
      handleScroll.cancel();
      container === null || container === void 0 ? void 0 : container.removeEventListener('scroll', handleScroll);
    };
    (0, _vue.watch)(() => props.target, () => {
      scrollRemove();
      (0, _vue.nextTick)(() => {
        bindScrollEvent();
      });
    });
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        bindScrollEvent();
      });
    });
    (0, _vue.onActivated)(() => {
      (0, _vue.nextTick)(() => {
        bindScrollEvent();
      });
    });
    (0, _vue.onDeactivated)(() => {
      scrollRemove();
    });
    (0, _vue.onBeforeUnmount)(() => {
      scrollRemove();
    });
    const floatButtonGroupContext = (0, _context.useInjectFloatButtonGroupContext)();
    return () => {
      const {
        description,
        type,
        shape,
        tooltip,
        badge
      } = props;
      const floatButtonProps = (0, _extends2.default)((0, _extends2.default)({}, attrs), {
        shape: (floatButtonGroupContext === null || floatButtonGroupContext === void 0 ? void 0 : floatButtonGroupContext.shape.value) || shape,
        onClick: scrollToTop,
        class: {
          [`${prefixCls.value}`]: true,
          [`${attrs.class}`]: attrs.class,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        },
        description,
        type,
        tooltip,
        badge
      });
      const transitionProps = (0, _transition.getTransitionProps)('fade');
      return wrapSSR((0, _vue.createVNode)(_vue.Transition, transitionProps, {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)(_FloatButton.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, floatButtonProps), {}, {
          "ref": domRef
        }), {
          icon: () => {
            var _a;
            return ((_a = slots.icon) === null || _a === void 0 ? void 0 : _a.call(slots)) || (0, _vue.createVNode)(_VerticalAlignTopOutlined.default, null, null);
          }
        }), [[_vue.vShow, state.visible]])]
      }));
    };
  }
});
var _default = exports.default = BackTop;