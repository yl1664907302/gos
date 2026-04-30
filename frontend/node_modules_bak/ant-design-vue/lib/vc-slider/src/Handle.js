"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _addEventListener = _interopRequireDefault(require("../../vc-util/Dom/addEventListener"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Handle',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    vertical: {
      type: Boolean,
      default: undefined
    },
    offset: Number,
    disabled: {
      type: Boolean,
      default: undefined
    },
    min: Number,
    max: Number,
    value: Number,
    tabindex: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
    reverse: {
      type: Boolean,
      default: undefined
    },
    ariaLabel: String,
    ariaLabelledBy: String,
    ariaValueTextFormatter: Function,
    onMouseenter: {
      type: Function
    },
    onMouseleave: {
      type: Function
    },
    onMousedown: {
      type: Function
    }
  },
  setup(props, _ref) {
    let {
      attrs,
      emit,
      expose
    } = _ref;
    const clickFocused = (0, _vue.shallowRef)(false);
    const handle = (0, _vue.shallowRef)();
    const handleMouseUp = () => {
      if (document.activeElement === handle.value) {
        clickFocused.value = true;
      }
    };
    const handleBlur = e => {
      clickFocused.value = false;
      emit('blur', e);
    };
    const handleKeyDown = () => {
      clickFocused.value = false;
    };
    const focus = () => {
      var _a;
      (_a = handle.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = handle.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    const clickFocus = () => {
      clickFocused.value = true;
      focus();
    };
    // when click can not focus in vue, use mousedown trigger focus
    const handleMousedown = e => {
      e.preventDefault();
      focus();
      emit('mousedown', e);
    };
    expose({
      focus,
      blur,
      clickFocus,
      ref: handle
    });
    let onMouseUpListener = null;
    (0, _vue.onMounted)(() => {
      onMouseUpListener = (0, _addEventListener.default)(document, 'mouseup', handleMouseUp);
    });
    (0, _vue.onBeforeUnmount)(() => {
      onMouseUpListener === null || onMouseUpListener === void 0 ? void 0 : onMouseUpListener.remove();
    });
    const positionStyle = (0, _vue.computed)(() => {
      const {
        vertical,
        offset,
        reverse
      } = props;
      return vertical ? {
        [reverse ? 'top' : 'bottom']: `${offset}%`,
        [reverse ? 'bottom' : 'top']: 'auto',
        transform: reverse ? null : `translateY(+50%)`
      } : {
        [reverse ? 'right' : 'left']: `${offset}%`,
        [reverse ? 'left' : 'right']: 'auto',
        transform: `translateX(${reverse ? '+' : '-'}50%)`
      };
    });
    return () => {
      const {
        prefixCls,
        disabled,
        min,
        max,
        value,
        tabindex,
        ariaLabel,
        ariaLabelledBy,
        ariaValueTextFormatter,
        onMouseenter,
        onMouseleave
      } = props;
      const className = (0, _classNames.default)(attrs.class, {
        [`${prefixCls}-handle-click-focused`]: clickFocused.value
      });
      const ariaProps = {
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled
      };
      const elStyle = [attrs.style, positionStyle.value];
      let mergedTabIndex = tabindex || 0;
      if (disabled || tabindex === null) {
        mergedTabIndex = null;
      }
      let ariaValueText;
      if (ariaValueTextFormatter) {
        ariaValueText = ariaValueTextFormatter(value);
      }
      const handleProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), {
        role: 'slider',
        tabindex: mergedTabIndex
      }), ariaProps), {
        class: className,
        onBlur: handleBlur,
        onKeydown: handleKeyDown,
        onMousedown: handleMousedown,
        onMouseenter,
        onMouseleave,
        ref: handle,
        style: elStyle
      });
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, handleProps), {}, {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-valuetext": ariaValueText
      }), null);
    };
  }
});