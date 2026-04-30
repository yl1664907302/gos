"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcTrigger = _interopRequireDefault(require("../../vc-trigger"));
var _useMenuContext = require("./hooks/useMenuContext");
var _placements = require("./placements");
var _raf = _interopRequireDefault(require("../../_util/raf"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _transition = require("../../_util/transition");
const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'PopupTrigger',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    mode: String,
    visible: Boolean,
    // popup: React.ReactNode;
    popupClassName: String,
    popupOffset: Array,
    disabled: Boolean,
    onVisibleChange: Function
  },
  slots: Object,
  emits: ['visibleChange'],
  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const innerVisible = (0, _vue.shallowRef)(false);
    const {
      getPopupContainer,
      rtl,
      subMenuOpenDelay,
      subMenuCloseDelay,
      builtinPlacements,
      triggerSubMenuAction,
      forceSubMenuRender,
      motion,
      defaultMotions,
      rootClassName
    } = (0, _useMenuContext.useInjectMenu)();
    const forceRender = (0, _useMenuContext.useInjectForceRender)();
    const placement = (0, _vue.computed)(() => rtl.value ? (0, _extends2.default)((0, _extends2.default)({}, _placements.placementsRtl), builtinPlacements.value) : (0, _extends2.default)((0, _extends2.default)({}, _placements.placements), builtinPlacements.value));
    const popupPlacement = (0, _vue.computed)(() => popupPlacementMap[props.mode]);
    const visibleRef = (0, _vue.shallowRef)();
    (0, _vue.watch)(() => props.visible, visible => {
      _raf.default.cancel(visibleRef.value);
      visibleRef.value = (0, _raf.default)(() => {
        innerVisible.value = visible;
      });
    }, {
      immediate: true
    });
    (0, _vue.onBeforeUnmount)(() => {
      _raf.default.cancel(visibleRef.value);
    });
    const onVisibleChange = visible => {
      emit('visibleChange', visible);
    };
    const mergedMotion = (0, _vue.computed)(() => {
      var _a, _b;
      const m = motion.value || ((_a = defaultMotions.value) === null || _a === void 0 ? void 0 : _a[props.mode]) || ((_b = defaultMotions.value) === null || _b === void 0 ? void 0 : _b.other);
      const res = typeof m === 'function' ? m() : m;
      return res ? (0, _transition.getTransitionProps)(res.name, {
        css: true
      }) : undefined;
    });
    return () => {
      const {
        prefixCls,
        popupClassName,
        mode,
        popupOffset,
        disabled
      } = props;
      return (0, _vue.createVNode)(_vcTrigger.default, {
        "prefixCls": prefixCls,
        "popupClassName": (0, _classNames.default)(`${prefixCls}-popup`, {
          [`${prefixCls}-rtl`]: rtl.value
        }, popupClassName, rootClassName.value),
        "stretch": mode === 'horizontal' ? 'minWidth' : null,
        "getPopupContainer": getPopupContainer.value,
        "builtinPlacements": placement.value,
        "popupPlacement": popupPlacement.value,
        "popupVisible": innerVisible.value,
        "popupAlign": popupOffset && {
          offset: popupOffset
        },
        "action": disabled ? [] : [triggerSubMenuAction.value],
        "mouseEnterDelay": subMenuOpenDelay.value,
        "mouseLeaveDelay": subMenuCloseDelay.value,
        "onPopupVisibleChange": onVisibleChange,
        "forceRender": forceRender || forceSubMenuRender.value,
        "popupAnimation": mergedMotion.value
      }, {
        popup: slots.popup,
        default: slots.default
      });
    };
  }
});