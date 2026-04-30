import { createVNode as _createVNode } from "vue";
import { addClass, removeClass } from '../../vc-util/Dom/class';
import { onBeforeUnmount, nextTick, Transition, watch, defineComponent, computed, ref } from 'vue';
import { anyType } from '../../_util/type';
const calcThumbStyle = targetElement => targetElement ? {
  left: targetElement.offsetLeft,
  right: targetElement.parentElement.clientWidth - targetElement.clientWidth - targetElement.offsetLeft,
  width: targetElement.clientWidth
} : null;
const toPX = value => value !== undefined ? `${value}px` : undefined;
const MotionThumb = defineComponent({
  props: {
    value: anyType(),
    getValueIndex: anyType(),
    prefixCls: anyType(),
    motionName: anyType(),
    onMotionStart: anyType(),
    onMotionEnd: anyType(),
    direction: anyType(),
    containerRef: anyType()
  },
  emits: ['motionStart', 'motionEnd'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const thumbRef = ref();
    // =========================== Effect ===========================
    const findValueElement = val => {
      var _a;
      const index = props.getValueIndex(val);
      const ele = (_a = props.containerRef.value) === null || _a === void 0 ? void 0 : _a.querySelectorAll(`.${props.prefixCls}-item`)[index];
      return (ele === null || ele === void 0 ? void 0 : ele.offsetParent) && ele;
    };
    const prevStyle = ref(null);
    const nextStyle = ref(null);
    watch(() => props.value, (value, prevValue) => {
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
    const thumbStart = computed(() => {
      var _a, _b;
      return props.direction === 'rtl' ? toPX(-((_a = prevStyle.value) === null || _a === void 0 ? void 0 : _a.right)) : toPX((_b = prevStyle.value) === null || _b === void 0 ? void 0 : _b.left);
    });
    const thumbActive = computed(() => {
      var _a, _b;
      return props.direction === 'rtl' ? toPX(-((_a = nextStyle.value) === null || _a === void 0 ? void 0 : _a.right)) : toPX((_b = nextStyle.value) === null || _b === void 0 ? void 0 : _b.left);
    });
    // =========================== Motion ===========================
    let timeid;
    const onAppearStart = el => {
      clearTimeout(timeid);
      nextTick(() => {
        if (el) {
          el.style.transform = `translateX(var(--thumb-start-left))`;
          el.style.width = `var(--thumb-start-width)`;
        }
      });
    };
    const onAppearActive = el => {
      timeid = setTimeout(() => {
        if (el) {
          addClass(el, `${props.motionName}-appear-active`);
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
        removeClass(el, `${props.motionName}-appear-active`);
      }
      emit('motionEnd');
    };
    const mergedStyle = computed(() => {
      var _a, _b;
      return {
        '--thumb-start-left': thumbStart.value,
        '--thumb-start-width': toPX((_a = prevStyle.value) === null || _a === void 0 ? void 0 : _a.width),
        '--thumb-active-left': thumbActive.value,
        '--thumb-active-width': toPX((_b = nextStyle.value) === null || _b === void 0 ? void 0 : _b.width)
      };
    });
    onBeforeUnmount(() => {
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
      return _createVNode(Transition, {
        "appear": true,
        "onBeforeEnter": onAppearStart,
        "onEnter": onAppearActive,
        "onAfterEnter": onAppearEnd
      }, {
        default: () => [!prevStyle.value || !nextStyle.value ? null : _createVNode("div", motionProps, null)]
      });
    };
  }
});
export default MotionThumb;