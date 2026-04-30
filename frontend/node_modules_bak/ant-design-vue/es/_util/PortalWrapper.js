import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import PropTypes from './vue-types';
import Portal from './Portal';
import { defineComponent, shallowRef, watch, onMounted, onBeforeUnmount, onUpdated, nextTick, computed } from 'vue';
import canUseDom from './canUseDom';
import raf from './raf';
import { booleanType } from './type';
import useScrollLocker from './hooks/useScrollLocker';
let openCount = 0;
const supportDom = canUseDom();
/** @private Test usage only */
export function getOpenCount() {
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
export default defineComponent({
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
    getContainer: PropTypes.any,
    visible: {
      type: Boolean,
      default: undefined
    },
    autoLock: booleanType(),
    didUpdate: Function
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const container = shallowRef();
    const componentRef = shallowRef();
    const rafId = shallowRef();
    const triggerUpdate = shallowRef(1);
    const defaultContainer = canUseDom() && document.createElement('div');
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
    onUpdated(() => {
      setWrapperClassName();
      attachToParent();
    });
    useScrollLocker(computed(() => {
      return props.autoLock && props.visible && canUseDom() && (container.value === document.body || container.value === defaultContainer);
    }));
    onMounted(() => {
      let init = false;
      watch([() => props.visible, () => props.getContainer], (_ref2, _ref3) => {
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
      nextTick(() => {
        if (!attachToParent()) {
          rafId.value = raf(() => {
            triggerUpdate.value += 1;
          });
        }
      });
    });
    onBeforeUnmount(() => {
      const {
        visible
      } = props;
      if (supportDom && parent === document.body) {
        // 离开时不会 render， 导到离开时数值不变，改用 func 。。
        openCount = visible && openCount ? openCount - 1 : openCount;
      }
      removeCurrentContainer();
      raf.cancel(rafId.value);
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
        portal = _createVNode(Portal, {
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