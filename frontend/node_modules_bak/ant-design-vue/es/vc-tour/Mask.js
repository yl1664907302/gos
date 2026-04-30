import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import useId from '../_util/hooks/useId';
import Portal from '../_util/PortalWrapper';
import { someType, objectType, booleanType } from '../_util/type';
const COVER_PROPS = {
  fill: 'transparent',
  'pointer-events': 'auto'
};
const Mask = defineComponent({
  name: 'TourMask',
  props: {
    prefixCls: {
      type: String
    },
    pos: objectType(),
    rootClassName: {
      type: String
    },
    showMask: booleanType(),
    fill: {
      type: String,
      default: 'rgba(0,0,0,0.5)'
    },
    open: booleanType(),
    animated: someType([Boolean, Object]),
    zIndex: {
      type: Number
    }
  },
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const id = useId();
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
      return _createVNode(Portal, {
        "visible": open,
        "autoLock": true
      }, {
        default: () => open && _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
          "class": classNames(`${prefixCls}-mask`, rootClassName, attrs.class),
          "style": [{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex,
            pointerEvents: 'none'
          }, attrs.style]
        }), [showMask ? _createVNode("svg", {
          "style": {
            width: '100%',
            height: '100%'
          }
        }, [_createVNode("defs", null, [_createVNode("mask", {
          "id": maskId
        }, [_createVNode("rect", {
          "x": "0",
          "y": "0",
          "width": "100vw",
          "height": "100vh",
          "fill": "white"
        }, null), pos && _createVNode("rect", {
          "x": pos.left,
          "y": pos.top,
          "rx": pos.radius,
          "width": pos.width,
          "height": pos.height,
          "fill": "black",
          "class": mergedAnimated ? `${prefixCls}-placeholder-animated` : ''
        }, null)])]), _createVNode("rect", {
          "x": "0",
          "y": "0",
          "width": "100%",
          "height": "100%",
          "fill": fill,
          "mask": `url(#${maskId})`
        }, null), pos && _createVNode(_Fragment, null, [_createVNode("rect", _objectSpread(_objectSpread({}, COVER_PROPS), {}, {
          "x": "0",
          "y": "0",
          "width": "100%",
          "height": pos.top
        }), null), _createVNode("rect", _objectSpread(_objectSpread({}, COVER_PROPS), {}, {
          "x": "0",
          "y": "0",
          "width": pos.left,
          "height": "100%"
        }), null), _createVNode("rect", _objectSpread(_objectSpread({}, COVER_PROPS), {}, {
          "x": "0",
          "y": pos.top + pos.height,
          "width": "100%",
          "height": `calc(100vh - ${pos.top + pos.height}px)`
        }), null), _createVNode("rect", _objectSpread(_objectSpread({}, COVER_PROPS), {}, {
          "x": pos.left + pos.width,
          "y": "0",
          "width": `calc(100vw - ${pos.left + pos.width}px)`,
          "height": "100%"
        }), null)])]) : null])
      });
    };
  }
});
export default Mask;