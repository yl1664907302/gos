"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _confirm = require("../confirm");
var _HookModal = _interopRequireDefault(require("./HookModal"));
var _destroyFns = _interopRequireDefault(require("../destroyFns"));
let uuid = 0;
const ElementsHolder = (0, _vue.defineComponent)({
  name: 'ElementsHolder',
  inheritAttrs: false,
  setup(_, _ref) {
    let {
      expose
    } = _ref;
    const modals = (0, _vue.shallowRef)([]);
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
  const holderRef = (0, _vue.shallowRef)(null);
  // ========================== Effect ==========================
  const actionQueue = (0, _vue.shallowRef)([]);
  (0, _vue.watch)(actionQueue, () => {
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
    const open = (0, _vue.shallowRef)(true);
    const modalRef = (0, _vue.shallowRef)(null);
    const configRef = (0, _vue.shallowRef)((0, _vue.unref)(config));
    const updateConfig = (0, _vue.shallowRef)({});
    (0, _vue.watch)(() => config, val => {
      updateAction((0, _extends2.default)((0, _extends2.default)({}, (0, _vue.isRef)(val) ? val.value : val), updateConfig.value));
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
    const modal = () => (0, _vue.createVNode)(_HookModal.default, {
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
      _destroyFns.default.push(closeFunc);
    }
    const updateAction = newConfig => {
      configRef.value = (0, _extends2.default)((0, _extends2.default)({}, configRef.value), newConfig);
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
  const fns = (0, _vue.computed)(() => ({
    info: getConfirmFunc(_confirm.withInfo),
    success: getConfirmFunc(_confirm.withSuccess),
    error: getConfirmFunc(_confirm.withError),
    warning: getConfirmFunc(_confirm.withWarn),
    confirm: getConfirmFunc(_confirm.withConfirm)
  }));
  const holderKey = Symbol('modalHolderKey');
  return [fns.value, () => (0, _vue.createVNode)(ElementsHolder, {
    "key": holderKey,
    "ref": holderRef
  }, null)];
}
var _default = exports.default = useModal;