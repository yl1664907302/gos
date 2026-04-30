import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent, shallowRef, onMounted, onBeforeUnmount } from 'vue';
import classNames from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import addEventListener from '../../vc-util/Dom/addEventListener';
export default defineComponent({
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
    tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
    const clickFocused = shallowRef(false);
    const handle = shallowRef();
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
    onMounted(() => {
      onMouseUpListener = addEventListener(document, 'mouseup', handleMouseUp);
    });
    onBeforeUnmount(() => {
      onMouseUpListener === null || onMouseUpListener === void 0 ? void 0 : onMouseUpListener.remove();
    });
    const positionStyle = computed(() => {
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
      const className = classNames(attrs.class, {
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
      const handleProps = _extends(_extends(_extends(_extends({}, attrs), {
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
      return _createVNode("div", _objectSpread(_objectSpread({}, handleProps), {}, {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-valuetext": ariaValueText
      }), null);
    };
  }
});