"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _vcTrigger = _interopRequireDefault(require("../vc-trigger"));
var _placements = _interopRequireDefault(require("./placements"));
var _vnode = require("../_util/vnode");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  props: {
    minOverlayWidthMatchTrigger: {
      type: Boolean,
      default: undefined
    },
    arrow: {
      type: Boolean,
      default: false
    },
    prefixCls: _vueTypes.default.string.def('rc-dropdown'),
    transitionName: String,
    overlayClassName: _vueTypes.default.string.def(''),
    openClassName: String,
    animation: _vueTypes.default.any,
    align: _vueTypes.default.object,
    overlayStyle: {
      type: Object,
      default: undefined
    },
    placement: _vueTypes.default.string.def('bottomLeft'),
    overlay: _vueTypes.default.any,
    trigger: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.arrayOf(_vueTypes.default.string)]).def('hover'),
    alignPoint: {
      type: Boolean,
      default: undefined
    },
    showAction: _vueTypes.default.array,
    hideAction: _vueTypes.default.array,
    getPopupContainer: Function,
    visible: {
      type: Boolean,
      default: undefined
    },
    defaultVisible: {
      type: Boolean,
      default: false
    },
    mouseEnterDelay: _vueTypes.default.number.def(0.15),
    mouseLeaveDelay: _vueTypes.default.number.def(0.1)
  },
  emits: ['visibleChange', 'overlayClick'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      expose
    } = _ref;
    const triggerVisible = (0, _vue.ref)(!!props.visible);
    (0, _vue.watch)(() => props.visible, val => {
      if (val !== undefined) {
        triggerVisible.value = val;
      }
    });
    const triggerRef = (0, _vue.ref)();
    expose({
      triggerRef
    });
    const onClick = e => {
      if (props.visible === undefined) {
        triggerVisible.value = false;
      }
      emit('overlayClick', e);
    };
    const onVisibleChange = visible => {
      if (props.visible === undefined) {
        triggerVisible.value = visible;
      }
      emit('visibleChange', visible);
    };
    const getMenuElement = () => {
      var _a;
      const overlayElement = (_a = slots.overlay) === null || _a === void 0 ? void 0 : _a.call(slots);
      const extraOverlayProps = {
        prefixCls: `${props.prefixCls}-menu`,
        onClick
      };
      return (0, _vue.createVNode)(_vue.Fragment, {
        "key": _propsUtil.skipFlattenKey
      }, [props.arrow && (0, _vue.createVNode)("div", {
        "class": `${props.prefixCls}-arrow`
      }, null), (0, _vnode.cloneElement)(overlayElement, extraOverlayProps, false)]);
    };
    const minOverlayWidthMatchTrigger = (0, _vue.computed)(() => {
      const {
        minOverlayWidthMatchTrigger: matchTrigger = !props.alignPoint
      } = props;
      return matchTrigger;
    });
    const renderChildren = () => {
      var _a;
      const children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      return triggerVisible.value && children ? (0, _vnode.cloneElement)(children[0], {
        class: props.openClassName || `${props.prefixCls}-open`
      }, false) : children;
    };
    const triggerHideAction = (0, _vue.computed)(() => {
      if (!props.hideAction && props.trigger.indexOf('contextmenu') !== -1) {
        return ['click'];
      }
      return props.hideAction;
    });
    return () => {
      const {
          prefixCls,
          arrow,
          showAction,
          overlayStyle,
          trigger,
          placement,
          align,
          getPopupContainer,
          transitionName,
          animation,
          overlayClassName
        } = props,
        otherProps = __rest(props, ["prefixCls", "arrow", "showAction", "overlayStyle", "trigger", "placement", "align", "getPopupContainer", "transitionName", "animation", "overlayClassName"]);
      return (0, _vue.createVNode)(_vcTrigger.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, otherProps), {}, {
        "prefixCls": prefixCls,
        "ref": triggerRef,
        "popupClassName": (0, _classNames.default)(overlayClassName, {
          [`${prefixCls}-show-arrow`]: arrow
        }),
        "popupStyle": overlayStyle,
        "builtinPlacements": _placements.default,
        "action": trigger,
        "showAction": showAction,
        "hideAction": triggerHideAction.value || [],
        "popupPlacement": placement,
        "popupAlign": align,
        "popupTransitionName": transitionName,
        "popupAnimation": animation,
        "popupVisible": triggerVisible.value,
        "stretch": minOverlayWidthMatchTrigger.value ? 'minWidth' : '',
        "onPopupVisibleChange": onVisibleChange,
        "getPopupContainer": getPopupContainer
      }), {
        popup: getMenuElement,
        default: renderChildren
      });
    };
  }
});