"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getOpenCount = getOpenCount;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("./vue-types"));
var _Portal = _interopRequireDefault(require("./Portal"));
var _canUseDom = _interopRequireDefault(require("./canUseDom"));
var _raf = _interopRequireDefault(require("./raf"));
var _type = require("./type");
var _useScrollLocker = _interopRequireDefault(require("./hooks/useScrollLocker"));
let openCount = 0;
const supportDom = (0, _canUseDom.default)();
/** @private Test usage only */
function getOpenCount() {
  return process.env.NODE_ENV === 'test' ? openCount : 0;
}
const getParent = getContainer => {
  if (!supportDom) {
    return null;
  }
  if (getContainer) {
    if (typeof getContainer === 'string') {
      return document.querySelectorAll(getContainer)[0];
    }
    if (typeof getContainer === 'function') {
      return getContainer();
    }
    if (typeof getContainer === 'object' && getContainer instanceof window.HTMLElement) {
      return getContainer;
    }
  }
  return document.body;
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'PortalWrapper',
  inheritAttrs: false,
  props: {
    wrapperClassName: String,
    forceRender: {
      type: Boolean,
      default: undefined
    },
    getContainer: _vueTypes.default.any,
    visible: {
      type: Boolean,
      default: undefined
    },
    autoLock: (0, _type.booleanType)(),
    didUpdate: Function
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const container = (0, _vue.shallowRef)();
    const componentRef = (0, _vue.shallowRef)();
    const rafId = (0, _vue.shallowRef)();
    const triggerUpdate = (0, _vue.shallowRef)(1);
    const defaultContainer = (0, _canUseDom.default)() && document.createElement('div');
    const removeCurrentContainer = () => {
      var _a, _b;
      // Portal will remove from `parentNode`.
      // Let's handle this again to avoid refactor issue.
      if (container.value === defaultContainer) {
        (_b = (_a = container.value) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(container.value);
      }
      container.value = null;
    };
    let parent = null;
    const attachToParent = function () {
      let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (force || container.value && !container.value.parentNode) {
        parent = getParent(props.getContainer);
        if (parent) {
          parent.appendChild(container.value);
          return true;
        }
        return false;
      }
      return true;
    };
    const getContainer = () => {
      if (!supportDom) {
        return null;
      }
      if (!container.value) {
        container.value = defaultContainer;
        attachToParent(true);
      }
      setWrapperClassName();
      return container.value;
    };
    const setWrapperClassName = () => {
      const {
        wrapperClassName
      } = props;
      if (container.value && wrapperClassName && wrapperClassName !== container.value.className) {
        container.value.className = wrapperClassName;
      }
    };
    (0, _vue.onUpdated)(() => {
      setWrapperClassName();
      attachToParent();
    });
    (0, _useScrollLocker.default)((0, _vue.computed)(() => {
      return props.autoLock && props.visible && (0, _canUseDom.default)() && (container.value === document.body || container.value === defaultContainer);
    }));
    (0, _vue.onMounted)(() => {
      let init = false;
      (0, _vue.watch)([() => props.visible, () => props.getContainer], (_ref2, _ref3) => {
        let [visible, getContainer] = _ref2;
        let [prevVisible, prevGetContainer] = _ref3;
        // Update count
        if (supportDom) {
          parent = getParent(props.getContainer);
          if (parent === document.body) {
            if (visible && !prevVisible) {
              openCount += 1;
            } else if (init) {
              openCount -= 1;
            }
          }
        }
        if (init) {
          // Clean up container if needed
          const getContainerIsFunc = typeof getContainer === 'function' && typeof prevGetContainer === 'function';
          if (getContainerIsFunc ? getContainer.toString() !== prevGetContainer.toString() : getContainer !== prevGetContainer) {
            removeCurrentContainer();
          }
        }
        init = true;
      }, {
        immediate: true,
        flush: 'post'
      });
      (0, _vue.nextTick)(() => {
        if (!attachToParent()) {
          rafId.value = (0, _raf.default)(() => {
            triggerUpdate.value += 1;
          });
        }
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      const {
        visible
      } = props;
      if (supportDom && parent === document.body) {
        // 离开时不会 render， 导到离开时数值不变，改用 func 。。
        openCount = visible && openCount ? openCount - 1 : openCount;
      }
      removeCurrentContainer();
      _raf.default.cancel(rafId.value);
    });
    return () => {
      const {
        forceRender,
        visible
      } = props;
      let portal = null;
      const childProps = {
        getOpenCount: () => openCount,
        getContainer
      };
      if (triggerUpdate.value && (forceRender || visible || componentRef.value)) {
        portal = (0, _vue.createVNode)(_Portal.default, {
          "getContainer": getContainer,
          "ref": componentRef,
          "didUpdate": props.didUpdate
        }, {
          default: () => {
            var _a;
            return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots, childProps);
          }
        });
      }
      return portal;
    };
  }
});