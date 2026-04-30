"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _button = _interopRequireDefault(require("../button"));
var _buttonTypes = require("../button/buttonTypes");
var _useDestroyed = _interopRequireDefault(require("./hooks/useDestroyed"));
var _type = require("./type");
var _propsUtil = require("./props-util");
const actionButtonProps = {
  type: {
    type: String
  },
  actionFn: Function,
  close: Function,
  autofocus: Boolean,
  prefixCls: String,
  buttonProps: (0, _type.objectType)(),
  emitEvent: Boolean,
  quitOnNullishReturnValue: Boolean
};
function isThenable(thing) {
  return !!(thing && thing.then);
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ActionButton',
  props: actionButtonProps,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const clickedRef = (0, _vue.shallowRef)(false);
    const buttonRef = (0, _vue.shallowRef)();
    const loading = (0, _vue.shallowRef)(false);
    let timeoutId;
    const isDestroyed = (0, _useDestroyed.default)();
    (0, _vue.onMounted)(() => {
      if (props.autofocus) {
        timeoutId = setTimeout(() => {
          var _a, _b;
          return (_b = (_a = (0, _propsUtil.findDOMNode)(buttonRef.value)) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
      }
    });
    (0, _vue.onBeforeUnmount)(() => {
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
      return (0, _vue.createVNode)(_button.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _buttonTypes.convertLegacyProps)(type)), {}, {
        "onClick": onClick,
        "loading": loading.value,
        "prefixCls": prefixCls
      }, buttonProps), {}, {
        "ref": buttonRef
      }), slots);
    };
  }
});