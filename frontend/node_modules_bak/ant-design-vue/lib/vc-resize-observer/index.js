"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _resizeObserverPolyfill = _interopRequireDefault(require("resize-observer-polyfill"));
var _vue = require("vue");
var _propsUtil = require("../_util/props-util");
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ResizeObserver',
  props: {
    disabled: Boolean,
    onResize: Function
  },
  emits: ['resize'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const state = (0, _vue.reactive)({
      width: 0,
      height: 0,
      offsetHeight: 0,
      offsetWidth: 0
    });
    let currentElement = null;
    let resizeObserver = null;
    const destroyObserver = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
    const onResize = entries => {
      const {
        onResize
      } = props;
      const target = entries[0].target;
      const {
        width,
        height
      } = target.getBoundingClientRect();
      const {
        offsetWidth,
        offsetHeight
      } = target;
      /**
       * Resize observer trigger when content size changed.
       * In most case we just care about element size,
       * let's use `boundary` instead of `contentRect` here to avoid shaking.
       */
      const fixedWidth = Math.floor(width);
      const fixedHeight = Math.floor(height);
      if (state.width !== fixedWidth || state.height !== fixedHeight || state.offsetWidth !== offsetWidth || state.offsetHeight !== offsetHeight) {
        const size = {
          width: fixedWidth,
          height: fixedHeight,
          offsetWidth,
          offsetHeight
        };
        (0, _extends2.default)(state, size);
        if (onResize) {
          // defer the callback but not defer to next frame
          Promise.resolve().then(() => {
            onResize((0, _extends2.default)((0, _extends2.default)({}, size), {
              offsetWidth,
              offsetHeight
            }), target);
          });
        }
      }
    };
    const instance = (0, _vue.getCurrentInstance)();
    const registerObserver = () => {
      const {
        disabled
      } = props;
      // Unregister if disabled
      if (disabled) {
        destroyObserver();
        return;
      }
      // Unregister if element changed
      const element = (0, _propsUtil.findDOMNode)(instance);
      const elementChanged = element !== currentElement;
      if (elementChanged) {
        destroyObserver();
        currentElement = element;
      }
      if (!resizeObserver && element) {
        resizeObserver = new _resizeObserverPolyfill.default(onResize);
        resizeObserver.observe(element);
      }
    };
    (0, _vue.onMounted)(() => {
      registerObserver();
    });
    (0, _vue.onUpdated)(() => {
      registerObserver();
    });
    (0, _vue.onUnmounted)(() => {
      destroyObserver();
    });
    (0, _vue.watch)(() => props.disabled, () => {
      registerObserver();
    }, {
      flush: 'post'
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)[0];
    };
  }
});