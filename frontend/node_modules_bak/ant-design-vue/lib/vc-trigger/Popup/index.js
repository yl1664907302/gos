"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _interface = require("./interface");
var _Mask = _interopRequireDefault(require("./Mask"));
var _MobilePopupInner = _interopRequireDefault(require("./MobilePopupInner"));
var _PopupInner = _interopRequireDefault(require("./PopupInner"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Popup',
  inheritAttrs: false,
  props: _interface.popupProps,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose
    } = _ref;
    const innerVisible = (0, _vue.shallowRef)(false);
    const inMobile = (0, _vue.shallowRef)(false);
    const popupRef = (0, _vue.shallowRef)();
    const rootRef = (0, _vue.shallowRef)();
    (0, _vue.watch)([() => props.visible, () => props.mobile], () => {
      innerVisible.value = props.visible;
      if (props.visible && props.mobile) {
        inMobile.value = true;
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    expose({
      forceAlign: () => {
        var _a;
        (_a = popupRef.value) === null || _a === void 0 ? void 0 : _a.forceAlign();
      },
      getElement: () => {
        var _a;
        return (_a = popupRef.value) === null || _a === void 0 ? void 0 : _a.getElement();
      }
    });
    return () => {
      const cloneProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), attrs), {
        visible: innerVisible.value
      });
      const popupNode = inMobile.value ? (0, _vue.createVNode)(_MobilePopupInner.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cloneProps), {}, {
        "mobile": props.mobile,
        "ref": popupRef
      }), {
        default: slots.default
      }) : (0, _vue.createVNode)(_PopupInner.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, cloneProps), {}, {
        "ref": popupRef
      }), {
        default: slots.default
      });
      return (0, _vue.createVNode)("div", {
        "ref": rootRef
      }, [(0, _vue.createVNode)(_Mask.default, cloneProps, null), popupNode]);
    };
  }
});