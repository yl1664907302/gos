"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _isVisible = _interopRequireDefault(require("../../vc-util/Dom/isVisible"));
var _classNames = _interopRequireDefault(require("../classNames"));
var _propsUtil = require("../props-util");
var _style = _interopRequireDefault(require("./style"));
var _useWave = _interopRequireDefault(require("./useWave"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Wave',
  props: {
    disabled: Boolean
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const instance = (0, _vue.getCurrentInstance)();
    const {
      prefixCls,
      wave
    } = (0, _useConfigInject.default)('wave', props);
    // ============================== Style ===============================
    const [, hashId] = (0, _style.default)(prefixCls);
    // =============================== Wave ===============================
    const showWave = (0, _useWave.default)((0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, hashId.value)), wave);
    let onClick;
    const clear = () => {
      const node = (0, _propsUtil.findDOMNode)(instance);
      node.removeEventListener('click', onClick, true);
    };
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(() => props.disabled, () => {
        clear();
        (0, _vue.nextTick)(() => {
          const node = (0, _propsUtil.findDOMNode)(instance);
          node === null || node === void 0 ? void 0 : node.removeEventListener('click', onClick, true);
          if (!node || node.nodeType !== 1 || props.disabled) {
            return;
          }
          // Click handler
          onClick = e => {
            // Fix radio button click twice
            if (e.target.tagName === 'INPUT' || !(0, _isVisible.default)(e.target) ||
            // No need wave
            !node.getAttribute || node.getAttribute('disabled') || node.disabled || node.className.includes('disabled') || node.className.includes('-leave')) {
              return;
            }
            showWave();
          };
          // Bind events
          node.addEventListener('click', onClick, true);
        });
      }, {
        immediate: true,
        flush: 'post'
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      clear();
    });
    return () => {
      var _a;
      // ============================== Render ==============================
      const children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)[0];
      return children;
    };
  }
});