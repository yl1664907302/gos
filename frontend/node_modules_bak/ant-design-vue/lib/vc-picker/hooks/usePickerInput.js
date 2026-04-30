"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePickerInput;
var _vue = require("vue");
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _uiUtil = require("../utils/uiUtil");
var _raf = _interopRequireDefault(require("../../_util/raf"));
function usePickerInput(_ref) {
  let {
    open,
    value,
    isClickOutside,
    triggerOpen,
    forwardKeydown,
    onKeydown,
    blurToCancel,
    onSubmit,
    onCancel,
    onFocus,
    onBlur
  } = _ref;
  const typing = (0, _vue.shallowRef)(false);
  const focused = (0, _vue.shallowRef)(false);
  /**
   * We will prevent blur to handle open event when user click outside,
   * since this will repeat trigger `onOpenChange` event.
   */
  const preventBlurRef = (0, _vue.shallowRef)(false);
  const valueChangedRef = (0, _vue.shallowRef)(false);
  const preventDefaultRef = (0, _vue.shallowRef)(false);
  const inputProps = (0, _vue.computed)(() => ({
    onMousedown: () => {
      typing.value = true;
      triggerOpen(true);
    },
    onKeydown: e => {
      const preventDefault = () => {
        preventDefaultRef.value = true;
      };
      onKeydown(e, preventDefault);
      if (preventDefaultRef.value) return;
      switch (e.which) {
        case _KeyCode.default.ENTER:
          {
            if (!open.value) {
              triggerOpen(true);
            } else if (onSubmit() !== false) {
              typing.value = true;
            }
            e.preventDefault();
            return;
          }
        case _KeyCode.default.TAB:
          {
            if (typing.value && open.value && !e.shiftKey) {
              typing.value = false;
              e.preventDefault();
            } else if (!typing.value && open.value) {
              if (!forwardKeydown(e) && e.shiftKey) {
                typing.value = true;
                e.preventDefault();
              }
            }
            return;
          }
        case _KeyCode.default.ESC:
          {
            typing.value = true;
            onCancel();
            return;
          }
      }
      if (!open.value && ![_KeyCode.default.SHIFT].includes(e.which)) {
        triggerOpen(true);
      } else if (!typing.value) {
        // Let popup panel handle keyboard
        forwardKeydown(e);
      }
    },
    onFocus: e => {
      typing.value = true;
      focused.value = true;
      if (onFocus) {
        onFocus(e);
      }
    },
    onBlur: e => {
      if (preventBlurRef.value || !isClickOutside(document.activeElement)) {
        preventBlurRef.value = false;
        return;
      }
      if (blurToCancel.value) {
        setTimeout(() => {
          let {
            activeElement
          } = document;
          while (activeElement && activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
          }
          if (isClickOutside(activeElement)) {
            onCancel();
          }
        }, 0);
      } else if (open.value) {
        triggerOpen(false);
        if (valueChangedRef.value) {
          onSubmit();
        }
      }
      focused.value = false;
      if (onBlur) {
        onBlur(e);
      }
    }
  }));
  // check if value changed
  (0, _vue.watch)(open, () => {
    valueChangedRef.value = false;
  });
  (0, _vue.watch)(value, () => {
    valueChangedRef.value = true;
  });
  const globalMousedownEvent = (0, _vue.shallowRef)();
  // Global click handler
  (0, _vue.onMounted)(() => {
    globalMousedownEvent.value = (0, _uiUtil.addGlobalMousedownEvent)(e => {
      const target = (0, _uiUtil.getTargetFromEvent)(e);
      if (open.value) {
        const clickedOutside = isClickOutside(target);
        if (!clickedOutside) {
          preventBlurRef.value = true;
          // Always set back in case `onBlur` prevented by user
          (0, _raf.default)(() => {
            preventBlurRef.value = false;
          });
        } else if (!focused.value || clickedOutside) {
          triggerOpen(false);
        }
      }
    });
  });
  (0, _vue.onBeforeUnmount)(() => {
    globalMousedownEvent.value && globalMousedownEvent.value();
  });
  return [inputProps, {
    focused,
    typing
  }];
}