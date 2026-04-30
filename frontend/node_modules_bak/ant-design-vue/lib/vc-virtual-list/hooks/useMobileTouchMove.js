"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMobileTouchMove;
var _vue = require("vue");
const SMOOTH_PTG = 14 / 15;
function useMobileTouchMove(inVirtual, listRef, callback) {
  let touched = false;
  let touchY = 0;
  let element = null;
  // Smooth scroll
  let interval = null;
  const cleanUpEvents = () => {
    if (element) {
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd);
    }
  };
  const onTouchMove = e => {
    if (touched) {
      const currentY = Math.ceil(e.touches[0].pageY);
      let offsetY = touchY - currentY;
      touchY = currentY;
      if (callback(offsetY)) {
        e.preventDefault();
      }
      // Smooth interval
      clearInterval(interval);
      interval = setInterval(() => {
        offsetY *= SMOOTH_PTG;
        if (!callback(offsetY, true) || Math.abs(offsetY) <= 0.1) {
          clearInterval(interval);
        }
      }, 16);
    }
  };
  const onTouchEnd = () => {
    touched = false;
    cleanUpEvents();
  };
  const onTouchStart = e => {
    cleanUpEvents();
    if (e.touches.length === 1 && !touched) {
      touched = true;
      touchY = Math.ceil(e.touches[0].pageY);
      element = e.target;
      element.addEventListener('touchmove', onTouchMove, {
        passive: false
      });
      element.addEventListener('touchend', onTouchEnd);
    }
  };
  const noop = () => {};
  (0, _vue.onMounted)(() => {
    document.addEventListener('touchmove', noop, {
      passive: false
    });
    (0, _vue.watch)(inVirtual, val => {
      listRef.value.removeEventListener('touchstart', onTouchStart);
      cleanUpEvents();
      clearInterval(interval);
      if (val) {
        listRef.value.addEventListener('touchstart', onTouchStart, {
          passive: false
        });
      }
    }, {
      immediate: true
    });
  });
  (0, _vue.onBeforeUnmount)(() => {
    document.removeEventListener('touchmove', noop);
  });
}