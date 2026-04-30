"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _DrawerChild = _interopRequireDefault(require("./DrawerChild"));
var _propsUtil = require("../../_util/props-util");
var _IDrawerPropTypes = require("./IDrawerPropTypes");
var _PortalWrapper = _interopRequireDefault(require("../../_util/PortalWrapper"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const DrawerWrapper = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _IDrawerPropTypes.drawerProps)(), {
    prefixCls: 'drawer',
    placement: 'left',
    getContainer: 'body',
    level: 'all',
    duration: '.3s',
    ease: 'cubic-bezier(0.78, 0.14, 0.15, 0.86)',
    afterVisibleChange: () => {},
    showMask: true,
    maskClosable: true,
    maskStyle: {},
    wrapperClassName: '',
    keyboard: true,
    forceRender: false,
    autofocus: true
  }),
  emits: ['handleClick', 'close'],
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const dom = (0, _vue.ref)(null);
    const onHandleClick = e => {
      emit('handleClick', e);
    };
    const onClose = e => {
      emit('close', e);
    };
    return () => {
      const {
          getContainer,
          wrapperClassName,
          rootClassName,
          rootStyle,
          forceRender
        } = props,
        otherProps = __rest(props, ["getContainer", "wrapperClassName", "rootClassName", "rootStyle", "forceRender"]);
      let portal = null;
      if (!getContainer) {
        return (0, _vue.createVNode)(_DrawerChild.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, otherProps), {}, {
          "rootClassName": rootClassName,
          "rootStyle": rootStyle,
          "open": props.open,
          "onClose": onClose,
          "onHandleClick": onHandleClick,
          "inline": true
        }), slots);
      }
      // 如果有 handler 为内置强制渲染；
      const $forceRender = !!slots.handler || forceRender;
      if ($forceRender || props.open || dom.value) {
        portal = (0, _vue.createVNode)(_PortalWrapper.default, {
          "autoLock": true,
          "visible": props.open,
          "forceRender": $forceRender,
          "getContainer": getContainer,
          "wrapperClassName": wrapperClassName
        }, {
          default: _a => {
            var {
                visible,
                afterClose
              } = _a,
              rest = __rest(_a, ["visible", "afterClose"]);
            return (0, _vue.createVNode)(_DrawerChild.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
              "ref": dom
            }, otherProps), rest), {}, {
              "rootClassName": rootClassName,
              "rootStyle": rootStyle,
              "open": visible !== undefined ? visible : props.open,
              "afterVisibleChange": afterClose !== undefined ? afterClose : props.afterVisibleChange,
              "onClose": onClose,
              "onHandleClick": onHandleClick
            }), slots);
          }
        });
      }
      return portal;
    };
  }
});
var _default = exports.default = DrawerWrapper;