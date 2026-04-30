"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Dialog = _interopRequireDefault(require("./Dialog"));
var _IDialogPropTypes = _interopRequireDefault(require("./IDialogPropTypes"));
var _PortalWrapper = _interopRequireDefault(require("../_util/PortalWrapper"));
var _context = require("../vc-trigger/context");
var _propsUtil = require("../_util/props-util");
const IDialogPropTypes = (0, _IDialogPropTypes.default)();
const DialogWrap = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'DialogWrap',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(IDialogPropTypes, {
    visible: false
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const animatedVisible = (0, _vue.ref)(props.visible);
    (0, _context.useProvidePortal)({}, {
      inTriggerContext: false
    });
    (0, _vue.watch)(() => props.visible, () => {
      if (props.visible) {
        animatedVisible.value = true;
      }
    }, {
      flush: 'post'
    });
    return () => {
      const {
        visible,
        getContainer,
        forceRender,
        destroyOnClose = false,
        afterClose
      } = props;
      let dialogProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), attrs), {
        ref: '_component',
        key: 'dialog'
      });
      // 渲染在当前 dom 里；
      if (getContainer === false) {
        return (0, _vue.createVNode)(_Dialog.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, dialogProps), {}, {
          "getOpenCount": () => 2
        }), slots);
      }
      // Destroy on close will remove wrapped div
      if (!forceRender && destroyOnClose && !animatedVisible.value) {
        return null;
      }
      return (0, _vue.createVNode)(_PortalWrapper.default, {
        "autoLock": true,
        "visible": visible,
        "forceRender": forceRender,
        "getContainer": getContainer
      }, {
        default: childProps => {
          dialogProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, dialogProps), childProps), {
            afterClose: () => {
              afterClose === null || afterClose === void 0 ? void 0 : afterClose();
              animatedVisible.value = false;
            }
          });
          return (0, _vue.createVNode)(_Dialog.default, dialogProps, slots);
        }
      });
    };
  }
});
var _default = exports.default = DialogWrap;