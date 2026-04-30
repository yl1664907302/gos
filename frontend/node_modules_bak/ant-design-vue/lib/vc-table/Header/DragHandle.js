"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _addEventListener = _interopRequireDefault(require("../../vc-util/Dom/addEventListener"));
var _raf = _interopRequireDefault(require("../../_util/raf"));
var _devWarning = _interopRequireDefault(require("../../vc-util/devWarning"));
var _context = require("../../table/context");
var _supportsPassive = _interopRequireDefault(require("../../_util/supportsPassive"));
const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
};
const defaultMinWidth = 50;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'DragHandle',
  props: {
    prefixCls: String,
    width: {
      type: Number,
      required: true
    },
    minWidth: {
      type: Number,
      default: defaultMinWidth
    },
    maxWidth: {
      type: Number,
      default: Infinity
    },
    column: {
      type: Object,
      default: undefined
    }
  },
  setup(props) {
    let startX = 0;
    let moveEvent = {
      remove: () => {}
    };
    let stopEvent = {
      remove: () => {}
    };
    const removeEvents = () => {
      moveEvent.remove();
      stopEvent.remove();
    };
    (0, _vue.onUnmounted)(() => {
      removeEvents();
    });
    (0, _vue.watchEffect)(() => {
      (0, _devWarning.default)(!isNaN(props.width), 'Table', 'width must be a number when use resizable');
    });
    const {
      onResizeColumn
    } = (0, _context.useInjectTableContext)();
    const minWidth = (0, _vue.computed)(() => {
      return typeof props.minWidth === 'number' && !isNaN(props.minWidth) ? props.minWidth : defaultMinWidth;
    });
    const maxWidth = (0, _vue.computed)(() => {
      return typeof props.maxWidth === 'number' && !isNaN(props.maxWidth) ? props.maxWidth : Infinity;
    });
    const instance = (0, _vue.getCurrentInstance)();
    let baseWidth = 0;
    const dragging = (0, _vue.shallowRef)(false);
    let rafId;
    const updateWidth = e => {
      let pageX = 0;
      if (e.touches) {
        if (e.touches.length) {
          // touchmove
          pageX = e.touches[0].pageX;
        } else {
          // touchend
          pageX = e.changedTouches[0].pageX;
        }
      } else {
        pageX = e.pageX;
      }
      const tmpDeltaX = startX - pageX;
      let w = Math.max(baseWidth - tmpDeltaX, minWidth.value);
      w = Math.min(w, maxWidth.value);
      _raf.default.cancel(rafId);
      rafId = (0, _raf.default)(() => {
        onResizeColumn(w, props.column.__originColumn__);
      });
    };
    const handleMove = e => {
      updateWidth(e);
    };
    const handleStop = e => {
      dragging.value = false;
      updateWidth(e);
      removeEvents();
    };
    const handleStart = (e, eventsFor) => {
      dragging.value = true;
      removeEvents();
      baseWidth = instance.vnode.el.parentNode.getBoundingClientRect().width;
      if (e instanceof MouseEvent && e.which !== 1) {
        return;
      }
      if (e.stopPropagation) e.stopPropagation();
      startX = e.touches ? e.touches[0].pageX : e.pageX;
      moveEvent = (0, _addEventListener.default)(document.documentElement, eventsFor.move, handleMove);
      stopEvent = (0, _addEventListener.default)(document.documentElement, eventsFor.stop, handleStop);
    };
    const handleDown = e => {
      e.stopPropagation();
      e.preventDefault();
      handleStart(e, events.mouse);
    };
    const handleTouchDown = e => {
      e.stopPropagation();
      e.preventDefault();
      handleStart(e, events.touch);
    };
    const handleClick = e => {
      e.stopPropagation();
      e.preventDefault();
    };
    return () => {
      const {
        prefixCls
      } = props;
      const touchEvents = {
        [_supportsPassive.default ? 'onTouchstartPassive' : 'onTouchstart']: e => handleTouchDown(e)
      };
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "class": `${prefixCls}-resize-handle ${dragging.value ? 'dragging' : ''}`,
        "onMousedown": handleDown
      }, touchEvents), {}, {
        "onClick": handleClick
      }), [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-resize-handle-line`
      }, null)]);
    };
  }
});