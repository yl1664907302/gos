import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { createVNode, render as vueRender } from 'vue';
import ConfirmDialog from './ConfirmDialog';
import ConfigProvider, { globalConfigForApi } from '../config-provider';
import omit from '../_util/omit';
import { triggerVNodeUpdate } from '../_util/vnode';
import { getConfirmLocale } from './locale';
import destroyFns from './destroyFns';
const confirm = config => {
  const container = document.createDocumentFragment();
  let currentConfig = _extends(_extends({}, omit(config, ['parentContext', 'appContext'])), {
    close,
    open: true
  });
  let confirmDialogInstance = null;
  function destroy() {
    if (confirmDialogInstance) {
      // destroy
      vueRender(null, container);
      confirmDialogInstance = null;
    }
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    const triggerCancel = args.some(param => param && param.triggerCancel);
    if (config.onCancel && triggerCancel) {
      config.onCancel(() => {}, ...args.slice(1));
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i];
      if (fn === close) {
        destroyFns.splice(i, 1);
        break;
      }
    }
  }
  function close() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    currentConfig = _extends(_extends({}, currentConfig), {
      open: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose();
        }
        destroy.apply(this, args);
      }
    });
    // Legacy support
    if (currentConfig.visible) {
      delete currentConfig.visible;
    }
    update(currentConfig);
  }
  function update(configUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig);
    } else {
      currentConfig = _extends(_extends({}, currentConfig), configUpdate);
    }
    if (confirmDialogInstance) {
      triggerVNodeUpdate(confirmDialogInstance, currentConfig, container);
    }
  }
  const Wrapper = p => {
    const global = globalConfigForApi;
    const rootPrefixCls = global.prefixCls;
    const prefixCls = p.prefixCls || `${rootPrefixCls}-modal`;
    const iconPrefixCls = global.iconPrefixCls;
    const runtimeLocale = getConfirmLocale();
    return _createVNode(ConfigProvider, _objectSpread(_objectSpread({}, global), {}, {
      "prefixCls": rootPrefixCls
    }), {
      default: () => [_createVNode(ConfirmDialog, _objectSpread(_objectSpread({}, p), {}, {
        "rootPrefixCls": rootPrefixCls,
        "prefixCls": prefixCls,
        "iconPrefixCls": iconPrefixCls,
        "locale": runtimeLocale,
        "cancelText": p.cancelText || runtimeLocale.cancelText
      }), null)]
    });
  };
  function render(props) {
    const vm = createVNode(Wrapper, _extends({}, props));
    vm.appContext = config.parentContext || config.appContext || vm.appContext;
    vueRender(vm, container);
    return vm;
  }
  confirmDialogInstance = render(currentConfig);
  destroyFns.push(close);
  return {
    destroy: close,
    update
  };
};
export default confirm;
export function withWarn(props) {
  return _extends(_extends({}, props), {
    type: 'warning'
  });
}
export function withInfo(props) {
  return _extends(_extends({}, props), {
    type: 'info'
  });
}
export function withSuccess(props) {
  return _extends(_extends({}, props), {
    type: 'success'
  });
}
export function withError(props) {
  return _extends(_extends({}, props), {
    type: 'error'
  });
}
export function withConfirm(props) {
  return _extends(_extends({}, props), {
    type: 'confirm'
  });
}