import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { Teleport, computed, defineComponent, onMounted, watch, onUnmounted } from 'vue';
import classNames from '../_util/classNames';
export default defineComponent({
  name: 'Notice',
  inheritAttrs: false,
  props: ['prefixCls', 'duration', 'updateMark', 'noticeKey', 'closeIcon', 'closable', 'props', 'onClick', 'onClose', 'holder', 'visible'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    let closeTimer;
    let isUnMounted = false;
    const duration = computed(() => props.duration === undefined ? 4.5 : props.duration);
    const startCloseTimer = () => {
      if (duration.value && !isUnMounted) {
        closeTimer = setTimeout(() => {
          close();
        }, duration.value * 1000);
      }
    };
    const clearCloseTimer = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };
    const close = e => {
      if (e) {
        e.stopPropagation();
      }
      clearCloseTimer();
      const {
        onClose,
        noticeKey
      } = props;
      if (onClose) {
        onClose(noticeKey);
      }
    };
    const restartCloseTimer = () => {
      clearCloseTimer();
      startCloseTimer();
    };
    onMounted(() => {
      startCloseTimer();
    });
    onUnmounted(() => {
      isUnMounted = true;
      clearCloseTimer();
    });
    watch([duration, () => props.updateMark, () => props.visible], (_ref2, _ref3) => {
      let [preDuration, preUpdateMark, preVisible] = _ref2;
      let [newDuration, newUpdateMark, newVisible] = _ref3;
      if (preDuration !== newDuration || preUpdateMark !== newUpdateMark || preVisible !== newVisible && newVisible) {
        restartCloseTimer();
      }
    }, {
      flush: 'post'
    });
    return () => {
      var _a, _b;
      const {
        prefixCls,
        closable,
        closeIcon = (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots),
        onClick,
        holder
      } = props;
      const {
        class: className,
        style
      } = attrs;
      const componentClass = `${prefixCls}-notice`;
      const dataOrAriaAttributeProps = Object.keys(attrs).reduce((acc, key) => {
        if (key.startsWith('data-') || key.startsWith('aria-') || key === 'role') {
          acc[key] = attrs[key];
        }
        return acc;
      }, {});
      const node = _createVNode("div", _objectSpread({
        "class": classNames(componentClass, className, {
          [`${componentClass}-closable`]: closable
        }),
        "style": style,
        "onMouseenter": clearCloseTimer,
        "onMouseleave": startCloseTimer,
        "onClick": onClick
      }, dataOrAriaAttributeProps), [_createVNode("div", {
        "class": `${componentClass}-content`
      }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)]), closable ? _createVNode("a", {
        "tabindex": 0,
        "onClick": close,
        "class": `${componentClass}-close`
      }, [closeIcon || _createVNode("span", {
        "class": `${componentClass}-close-x`
      }, null)]) : null]);
      if (holder) {
        return _createVNode(Teleport, {
          "to": holder
        }, {
          default: () => node
        });
      }
      return node;
    };
  }
});