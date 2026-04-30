import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { isRef, unref, computed, defineComponent, shallowRef, watch } from 'vue';
import { withConfirm, withError, withInfo, withSuccess, withWarn } from '../confirm';
import HookModal from './HookModal';
import destroyFns from '../destroyFns';
let uuid = 0;
const ElementsHolder = defineComponent({
  name: 'ElementsHolder',
  inheritAttrs: false,
  setup(_, _ref) {
    let {
      expose
    } = _ref;
    const modals = shallowRef([]);
    const addModal = modal => {
      modals.value.push(modal);
      modals.value = modals.value.slice();
      return () => {
        modals.value = modals.value.filter(currentModal => currentModal !== modal);
      };
    };
    expose({
      addModal
    });
    return () => {
      return modals.value.map(modal => modal());
    };
  }
});
function useModal() {
  const holderRef = shallowRef(null);
  // ========================== Effect ==========================
  const actionQueue = shallowRef([]);
  watch(actionQueue, () => {
    if (actionQueue.value.length) {
      const cloneQueue = [...actionQueue.value];
      cloneQueue.forEach(action => {
        action();
      });
      actionQueue.value = [];
    }
  }, {
    immediate: true
  });
  // =========================== Hook ===========================
  const getConfirmFunc = withFunc => function hookConfirm(config) {
    var _a;
    uuid += 1;
    const open = shallowRef(true);
    const modalRef = shallowRef(null);
    const configRef = shallowRef(unref(config));
    const updateConfig = shallowRef({});
    watch(() => config, val => {
      updateAction(_extends(_extends({}, isRef(val) ? val.value : val), updateConfig.value));
    });
    const destroyAction = function () {
      open.value = false;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const triggerCancel = args.some(param => param && param.triggerCancel);
      if (configRef.value.onCancel && triggerCancel) {
        configRef.value.onCancel(() => {}, ...args.slice(1));
      }
    };
    // eslint-disable-next-line prefer-const
    let closeFunc;
    const modal = () => _createVNode(HookModal, {
      "key": `modal-${uuid}`,
      "config": withFunc(configRef.value),
      "ref": modalRef,
      "open": open.value,
      "destroyAction": destroyAction,
      "afterClose": () => {
        closeFunc === null || closeFunc === void 0 ? void 0 : closeFunc();
      }
    }, null);
    closeFunc = (_a = holderRef.value) === null || _a === void 0 ? void 0 : _a.addModal(modal);
    if (closeFunc) {
      destroyFns.push(closeFunc);
    }
    const updateAction = newConfig => {
      configRef.value = _extends(_extends({}, configRef.value), newConfig);
    };
    const destroy = () => {
      if (modalRef.value) {
        destroyAction();
      } else {
        actionQueue.value = [...actionQueue.value, destroyAction];
      }
    };
    const update = newConfig => {
      updateConfig.value = newConfig;
      if (modalRef.value) {
        updateAction(newConfig);
      } else {
        actionQueue.value = [...actionQueue.value, () => updateAction(newConfig)];
      }
    };
    return {
      destroy,
      update
    };
  };
  const fns = computed(() => ({
    info: getConfirmFunc(withInfo),
    success: getConfirmFunc(withSuccess),
    error: getConfirmFunc(withError),
    warning: getConfirmFunc(withWarn),
    confirm: getConfirmFunc(withConfirm)
  }));
  const holderKey = Symbol('modalHolderKey');
  return [fns.value, () => _createVNode(ElementsHolder, {
    "key": holderKey,
    "ref": holderRef
  }, null)];
}
export default useModal;