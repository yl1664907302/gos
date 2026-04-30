"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _default = exports.default = (0, _vue.defineComponent)({
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
    const duration = (0, _vue.computed)(() => props.duration === undefined ? 4.5 : props.duration);
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
    (0, _vue.onMounted)(() => {
      startCloseTimer();
    });
    (0, _vue.onUnmounted)(() => {
      isUnMounted = true;
      clearCloseTimer();
    });
    (0, _vue.watch)([duration, () => props.updateMark, () => props.visible], (_ref2, _ref3) => {
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
      const node = (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
        "class": (0, _classNames.default)(componentClass, className, {
          [`${componentClass}-closable`]: closable
        }),
        "style": style,
        "onMouseenter": clearCloseTimer,
        "onMouseleave": startCloseTimer,
        "onClick": onClick
      }, dataOrAriaAttributeProps), [(0, _vue.createVNode)("div", {
        "class": `${componentClass}-content`
      }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)]), closable ? (0, _vue.createVNode)("a", {
        "tabindex": 0,
        "onClick": close,
        "class": `${componentClass}-close`
      }, [closeIcon || (0, _vue.createVNode)("span", {
        "class": `${componentClass}-close-x`
      }, null)]) : null]);
      if (holder) {
        return (0, _vue.createVNode)(_vue.Teleport, {
          "to": holder
        }, {
          default: () => node
        });
      }
      return node;
    };
  }
});