import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { shallowRef, onMounted, defineComponent, onBeforeUnmount } from 'vue';
import Button from '../button';
import { convertLegacyProps } from '../button/buttonTypes';
import useDestroyed from './hooks/useDestroyed';
import { objectType } from './type';
import { findDOMNode } from './props-util';
const actionButtonProps = {
  type: {
    type: String
  },
  actionFn: Function,
  close: Function,
  autofocus: Boolean,
  prefixCls: String,
  buttonProps: objectType(),
  emitEvent: Boolean,
  quitOnNullishReturnValue: Boolean
};
function isThenable(thing) {
  return !!(thing && thing.then);
}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ActionButton',
  props: actionButtonProps,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const clickedRef = shallowRef(false);
    const buttonRef = shallowRef();
    const loading = shallowRef(false);
    let timeoutId;
    const isDestroyed = useDestroyed();
    onMounted(() => {
      if (props.autofocus) {
        timeoutId = setTimeout(() => {
          var _a, _b;
          return (_b = (_a = findDOMNode(buttonRef.value)) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
      }
    });
    onBeforeUnmount(() => {
      clearTimeout(timeoutId);
    });
    const onInternalClose = function () {
      var _a;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_a = props.close) === null || _a === void 0 ? void 0 : _a.call(props, ...args);
    };
    const handlePromiseOnOk = returnValueOfOnOk => {
      if (!isThenable(returnValueOfOnOk)) {
        return;
      }
      loading.value = true;
      returnValueOfOnOk.then(function () {
        if (!isDestroyed.value) {
          loading.value = false;
        }
        onInternalClose(...arguments);
        clickedRef.value = false;
      }, e => {
        // See: https://github.com/ant-design/ant-design/issues/6183
        if (!isDestroyed.value) {
          loading.value = false;
        }
        clickedRef.value = false;
        return Promise.reject(e);
      });
    };
    const onClick = e => {
      const {
        actionFn
      } = props;
      if (clickedRef.value) {
        return;
      }
      clickedRef.value = true;
      if (!actionFn) {
        onInternalClose();
        return;
      }
      let returnValueOfOnOk;
      if (props.emitEvent) {
        returnValueOfOnOk = actionFn(e);
        if (props.quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
          clickedRef.value = false;
          onInternalClose(e);
          return;
        }
      } else if (actionFn.length) {
        returnValueOfOnOk = actionFn(props.close);
        // https://github.com/ant-design/ant-design/issues/23358
        clickedRef.value = false;
      } else {
        returnValueOfOnOk = actionFn();
        if (!returnValueOfOnOk) {
          onInternalClose();
          return;
        }
      }
      handlePromiseOnOk(returnValueOfOnOk);
    };
    return () => {
      const {
        type,
        prefixCls,
        buttonProps
      } = props;
      return _createVNode(Button, _objectSpread(_objectSpread(_objectSpread({}, convertLegacyProps(type)), {}, {
        "onClick": onClick,
        "loading": loading.value,
        "prefixCls": prefixCls
      }, buttonProps), {}, {
        "ref": buttonRef
      }), slots);
    };
  }
});