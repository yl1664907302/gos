"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _class = require("../../vc-util/Dom/class");
var _type = require("../../_util/type");
const calcThumbStyle = targetElement => targetElement ? {
  left: targetElement.offsetLeft,
  right: targetElement.parentElement.clientWidth - targetElement.clientWidth - targetElement.offsetLeft,
  width: targetElement.clientWidth
} : null;
const toPX = value => value !== undefined ? `${value}px` : undefined;
const MotionThumb = (0, _vue.defineComponent)({
  props: {
    value: (0, _type.anyType)(),
    getValueIndex: (0, _type.anyType)(),
    prefixCls: (0, _type.anyType)(),
    motionName: (0, _type.anyType)(),
    onMotionStart: (0, _type.anyType)(),
    onMotionEnd: (0, _type.anyType)(),
    direction: (0, _type.anyType)(),
    containerRef: (0, _type.anyType)()
  },
  emits: ['motionStart', 'motionEnd'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const thumbRef = (0, _vue.ref)();
    // =========================== Effect ===========================
    const findValueElement = val => {
      var _a;
      const index = props.getValueIndex(val);
      const ele = (_a = props.containerRef.value) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`.${props.prefixCls}-item`)[index];
      return (ele === null || ele === void 0 ? void 0 : ele.offsetParent) && ele;
    };
    const prevStyle = (0, _vue.ref)(null);
    const nextStyle = (0, _vue.ref)(null);
    (0, _vue.watch)(() => props.value, (value, prevValue) => {
      const prev = findValueElement(prevValue);
      const next = findValueElement(value);
      const calcPrevStyle = calcThumbStyle(prev);
      const calcNextStyle = calcThumbStyle(next);
      prevStyle.value = calcPrevStyle;
      nextStyle.value = calcNextStyle;
      if (prev && next) {
        emit('motionStart');
      } else {
        emit('motionEnd');
      }
    }, {
      flush: 'post'
    });
    const thumbStart = (0, _vue.computed)(() => {
      var _a, _b;
      return props.direction === 'rtl' ? toPX(-((_a = prevStyle.value) === null || _a === void 0 ? void 0 : _a.right)) : toPX((_b = prevStyle.value) === null || _b === void 0 ? void 0 : _b.left);
    });
    const thumbActive = (0, _vue.computed)(() => {
      var _a, _b;
      return props.direction === 'rtl' ? toPX(-((_a = nextStyle.value) === null || _a === void 0 ? void 0 : _a.right)) : toPX((_b = nextStyle.value) === null || _b === void 0 ? void 0 : _b.left);
    });
    // =========================== Motion ===========================
    let timeid;
    const onAppearStart = el => {
      clearTimeout(timeid);
      (0, _vue.nextTick)(() => {
        if (el) {
          el.style.transform = `translateX(var(--thumb-start-left))`;
          el.style.width = `var(--thumb-start-width)`;
        }
      });
    };
    const onAppearActive = el => {
      timeid = setTimeout(() => {
        if (el) {
          (0, _class.addClass)(el, `${props.motionName}-appear-active`);
          el.style.transform = `translateX(var(--thumb-active-left))`;
          el.style.width = `var(--thumb-active-width)`;
        }
      });
    };
    const onAppearEnd = el => {
      prevStyle.value = null;
      nextStyle.value = null;
      if (el) {
        el.style.transform = null;
        el.style.width = null;
        (0, _class.removeClass)(el, `${props.motionName}-appear-active`);
      }
      emit('motionEnd');
    };
    const mergedStyle = (0, _vue.computed)(() => {
      var _a, _b;
      return {
        '--thumb-start-left': thumbStart.value,
        '--thumb-start-width': toPX((_a = prevStyle.value) === null || _a === void 0 ? void 0 : _a.width),
        '--thumb-active-left': thumbActive.value,
        '--thumb-active-width': toPX((_b = nextStyle.value) === null || _b === void 0 ? void 0 : _b.width)
      };
    });
    (0, _vue.onBeforeUnmount)(() => {
      clearTimeout(timeid);
    });
    return () => {
      // It's little ugly which should be refactor when @umi/test update to latest jsdom
      const motionProps = {
        ref: thumbRef,
        style: mergedStyle.value,
        class: [`${props.prefixCls}-thumb`]
      };
      if (process.env.NODE_ENV === 'test') {
        motionProps['data-test-style'] = JSON.stringify(mergedStyle.value);
      }
      return (0, _vue.createVNode)(_vue.Transition, {
        "appear": true,
        "onBeforeEnter": onAppearStart,
        "onEnter": onAppearActive,
        "onAfterEnter": onAppearEnd
      }, {
        default: () => [!prevStyle.value || !nextStyle.value ? null : (0, _vue.createVNode)("div", motionProps, null)]
      });
    };
  }
});
var _default = exports.default = MotionThumb;