"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _isMobile = _interopRequireDefault(require("../../vc-util/isMobile"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _type = require("../../_util/type");
/**
 * When click and hold on a button - the speed of auto changing the value.
 */
const STEP_INTERVAL = 200;
/**
 * When click and hold on a button - the delay before auto changing the value.
 */
const STEP_DELAY = 600;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'StepHandler',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    upDisabled: Boolean,
    downDisabled: Boolean,
    onStep: (0, _type.functionType)()
  },
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const stepTimeoutRef = (0, _vue.ref)();
    // We will interval update step when hold mouse down
    const onStepMouseDown = (e, up) => {
      e.preventDefault();
      emit('step', up);
      // Loop step for interval
      function loopStep() {
        emit('step', up);
        stepTimeoutRef.value = setTimeout(loopStep, STEP_INTERVAL);
      }
      // First time press will wait some time to trigger loop step update
      stepTimeoutRef.value = setTimeout(loopStep, STEP_DELAY);
    };
    const onStopStep = () => {
      clearTimeout(stepTimeoutRef.value);
    };
    (0, _vue.onBeforeUnmount)(() => {
      onStopStep();
    });
    return () => {
      if ((0, _isMobile.default)()) {
        return null;
      }
      const {
        prefixCls,
        upDisabled,
        downDisabled
      } = props;
      const handlerClassName = `${prefixCls}-handler`;
      const upClassName = (0, _classNames.default)(handlerClassName, `${handlerClassName}-up`, {
        [`${handlerClassName}-up-disabled`]: upDisabled
      });
      const downClassName = (0, _classNames.default)(handlerClassName, `${handlerClassName}-down`, {
        [`${handlerClassName}-down-disabled`]: downDisabled
      });
      const sharedHandlerProps = {
        unselectable: 'on',
        role: 'button',
        onMouseup: onStopStep,
        onMouseleave: onStopStep
      };
      const {
        upNode,
        downNode
      } = slots;
      return (0, _vue.createVNode)("div", {
        "class": `${handlerClassName}-wrap`
      }, [(0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sharedHandlerProps), {}, {
        "onMousedown": e => {
          onStepMouseDown(e, true);
        },
        "aria-label": "Increase Value",
        "aria-disabled": upDisabled,
        "class": upClassName
      }), [(upNode === null || upNode === void 0 ? void 0 : upNode()) || (0, _vue.createVNode)("span", {
        "unselectable": "on",
        "class": `${prefixCls}-handler-up-inner`
      }, null)]), (0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, sharedHandlerProps), {}, {
        "onMousedown": e => {
          onStepMouseDown(e, false);
        },
        "aria-label": "Decrease Value",
        "aria-disabled": downDisabled,
        "class": downClassName
      }), [(downNode === null || downNode === void 0 ? void 0 : downNode()) || (0, _vue.createVNode)("span", {
        "unselectable": "on",
        "class": `${prefixCls}-handler-down-inner`
      }, null)])]);
    };
  }
});