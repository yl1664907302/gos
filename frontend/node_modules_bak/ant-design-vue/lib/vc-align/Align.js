"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.alignProps = void 0;
var _vue = require("vue");
var _domAlign = require("dom-align");
var _addEventListener = _interopRequireDefault(require("../vc-util/Dom/addEventListener"));
var _vnode = require("../_util/vnode");
var _isVisible = _interopRequireDefault(require("../vc-util/Dom/isVisible"));
var _util = require("./util");
var _useBuffer = _interopRequireDefault(require("./hooks/useBuffer"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
const alignProps = exports.alignProps = {
  align: Object,
  target: [Object, Function],
  onAlign: Function,
  monitorBufferTime: Number,
  monitorWindowResize: Boolean,
  disabled: Boolean
};
function getElement(func) {
  if (typeof func !== 'function') return null;
  return func();
}
function getPoint(point) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Align',
  props: alignProps,
  emits: ['align'],
  setup(props, _ref) {
    let {
      expose,
      slots
    } = _ref;
    const cacheRef = (0, _vue.ref)({});
    const nodeRef = (0, _vue.ref)();
    const [forceAlign, cancelForceAlign] = (0, _useBuffer.default)(() => {
      const {
        disabled: latestDisabled,
        target: latestTarget,
        align: latestAlign,
        onAlign: latestOnAlign
      } = props;
      if (!latestDisabled && latestTarget && nodeRef.value) {
        const source = nodeRef.value;
        let result;
        const element = getElement(latestTarget);
        const point = getPoint(latestTarget);
        cacheRef.value.element = element;
        cacheRef.value.point = point;
        cacheRef.value.align = latestAlign;
        // IE lose focus after element realign
        // We should record activeElement and restore later
        const {
          activeElement
        } = document;
        // We only align when element is visible
        if (element && (0, _isVisible.default)(element)) {
          result = (0, _domAlign.alignElement)(source, element, latestAlign);
        } else if (point) {
          result = (0, _domAlign.alignPoint)(source, point, latestAlign);
        }
        (0, _util.restoreFocus)(activeElement, source);
        if (latestOnAlign && result) {
          latestOnAlign(source, result);
        }
        return true;
      }
      return false;
    }, (0, _vue.computed)(() => props.monitorBufferTime));
    // ===================== Effect =====================
    // Listen for target updated
    const resizeMonitor = (0, _vue.ref)({
      cancel: () => {}
    });
    // Listen for source updated
    const sourceResizeMonitor = (0, _vue.ref)({
      cancel: () => {}
    });
    const goAlign = () => {
      const target = props.target;
      const element = getElement(target);
      const point = getPoint(target);
      if (nodeRef.value !== sourceResizeMonitor.value.element) {
        sourceResizeMonitor.value.cancel();
        sourceResizeMonitor.value.element = nodeRef.value;
        sourceResizeMonitor.value.cancel = (0, _util.monitorResize)(nodeRef.value, forceAlign);
      }
      if (cacheRef.value.element !== element || !(0, _util.isSamePoint)(cacheRef.value.point, point) || !(0, _isEqual.default)(cacheRef.value.align, props.align)) {
        forceAlign();
        // Add resize observer
        if (resizeMonitor.value.element !== element) {
          resizeMonitor.value.cancel();
          resizeMonitor.value.element = element;
          resizeMonitor.value.cancel = (0, _util.monitorResize)(element, forceAlign);
        }
      }
    };
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        goAlign();
      });
    });
    (0, _vue.onUpdated)(() => {
      (0, _vue.nextTick)(() => {
        goAlign();
      });
    });
    // Listen for disabled change
    (0, _vue.watch)(() => props.disabled, disabled => {
      if (!disabled) {
        forceAlign();
      } else {
        cancelForceAlign();
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    // Listen for window resize
    const winResizeRef = (0, _vue.ref)(null);
    (0, _vue.watch)(() => props.monitorWindowResize, monitorWindowResize => {
      if (monitorWindowResize) {
        if (!winResizeRef.value) {
          winResizeRef.value = (0, _addEventListener.default)(window, 'resize', forceAlign);
        }
      } else if (winResizeRef.value) {
        winResizeRef.value.remove();
        winResizeRef.value = null;
      }
    }, {
      flush: 'post'
    });
    (0, _vue.onUnmounted)(() => {
      resizeMonitor.value.cancel();
      sourceResizeMonitor.value.cancel();
      if (winResizeRef.value) winResizeRef.value.remove();
      cancelForceAlign();
    });
    expose({
      forceAlign: () => forceAlign(true)
    });
    return () => {
      const child = slots === null || slots === void 0 ? void 0 : slots.default();
      if (child) {
        return (0, _vnode.cloneElement)(child[0], {
          ref: nodeRef
        }, true, true);
      }
      return null;
    };
  }
});