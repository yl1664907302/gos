"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useId = _interopRequireDefault(require("../_util/hooks/useId"));
var _PortalWrapper = _interopRequireDefault(require("../_util/PortalWrapper"));
var _type = require("../_util/type");
const COVER_PROPS = {
  fill: 'transparent',
  'pointer-events': 'auto'
};
const Mask = (0, _vue.defineComponent)({
  name: 'TourMask',
  props: {
    prefixCls: {
      type: String
    },
    pos: (0, _type.objectType)(),
    rootClassName: {
      type: String
    },
    showMask: (0, _type.booleanType)(),
    fill: {
      type: String,
      default: 'rgba(0,0,0,0.5)'
    },
    open: (0, _type.booleanType)(),
    animated: (0, _type.someType)([Boolean, Object]),
    zIndex: {
      type: Number
    }
  },
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const id = (0, _useId.default)();
    return () => {
      const {
        prefixCls,
        open,
        rootClassName,
        pos,
        showMask,
        fill,
        animated,
        zIndex
      } = props;
      const maskId = `${prefixCls}-mask-${id}`;
      const mergedAnimated = typeof animated === 'object' ? animated === null || animated === void 0 ? void 0 : animated.placeholder : animated;
      return (0, _vue.createVNode)(_PortalWrapper.default, {
        "visible": open,
        "autoLock": true
      }, {
        default: () => open && (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": (0, _classNames.default)(`${prefixCls}-mask`, rootClassName, attrs.class),
          "style": [{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex,
            pointerEvents: 'none'
          }, attrs.style]
        }), [showMask ? (0, _vue.createVNode)("svg", {
          "style": {
            width: '100%',
            height: '100%'
          }
        }, [(0, _vue.createVNode)("defs", null, [(0, _vue.createVNode)("mask", {
          "id": maskId
        }, [(0, _vue.createVNode)("rect", {
          "x": "0",
          "y": "0",
          "width": "100vw",
          "height": "100vh",
          "fill": "white"
        }, null), pos && (0, _vue.createVNode)("rect", {
          "x": pos.left,
          "y": pos.top,
          "rx": pos.radius,
          "width": pos.width,
          "height": pos.height,
          "fill": "black",
          "class": mergedAnimated ? `${prefixCls}-placeholder-animated` : ''
        }, null)])]), (0, _vue.createVNode)("rect", {
          "x": "0",
          "y": "0",
          "width": "100%",
          "height": "100%",
          "fill": fill,
          "mask": `url(#${maskId})`
        }, null), pos && (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("rect", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, COVER_PROPS), {}, {
          "x": "0",
          "y": "0",
          "width": "100%",
          "height": pos.top
        }), null), (0, _vue.createVNode)("rect", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, COVER_PROPS), {}, {
          "x": "0",
          "y": "0",
          "width": pos.left,
          "height": "100%"
        }), null), (0, _vue.createVNode)("rect", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, COVER_PROPS), {}, {
          "x": "0",
          "y": pos.top + pos.height,
          "width": "100%",
          "height": `calc(100vh - ${pos.top + pos.height}px)`
        }), null), (0, _vue.createVNode)("rect", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, COVER_PROPS), {}, {
          "x": pos.left + pos.width,
          "y": "0",
          "width": `calc(100vw - ${pos.left + pos.width}px)`,
          "height": "100%"
        }), null)])]) : null])
      });
    };
  }
});
var _default = exports.default = Mask;