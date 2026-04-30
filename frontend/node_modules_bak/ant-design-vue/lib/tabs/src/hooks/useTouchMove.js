"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTouchMove;
var _vue = require("vue");
var _useState = _interopRequireDefault(require("../../../_util/hooks/useState"));
const MIN_SWIPE_DISTANCE = 0.1;
const STOP_SWIPE_DISTANCE = 0.01;
const REFRESH_INTERVAL = 20;
const SPEED_OFF_MULTIPLE = Math.pow(0.995, REFRESH_INTERVAL);
// ================================= Hook =================================
function useTouchMove(domRef, onOffset) {
  const [touchPosition, setTouchPosition] = (0, _useState.default)();
  const [lastTimestamp, setLastTimestamp] = (0, _useState.default)(0);
  const [lastTimeDiff, setLastTimeDiff] = (0, _useState.default)(0);
  const [lastOffset, setLastOffset] = (0, _useState.default)();
  const motionInterval = (0, _vue.ref)();
  // ========================= Events =========================
  // >>> Touch events
  function onTouchStart(e) {
    const {
      screenX,
      screenY
    } = e.touches[0];
    setTouchPosition({
      x: screenX,
      y: screenY
    });
    clearInterval(motionInterval.value);
  }
  function onTouchMove(e) {
    if (!touchPosition.value) return;
    e.preventDefault();
    const {
      screenX,
      screenY
    } = e.touches[0];
    const offsetX = screenX - touchPosition.value.x;
    const offsetY = screenY - touchPosition.value.y;
    onOffset(offsetX, offsetY);
    setTouchPosition({
      x: screenX,
      y: screenY
    });
    const now = Date.now();
    setLastTimeDiff(now - lastTimestamp.value);
    setLastTimestamp(now);
    setLastOffset({
      x: offsetX,
      y: offsetY
    });
  }
  function onTouchEnd() {
    if (!touchPosition.value) return;
    const lastOffsetValue = lastOffset.value;
    setTouchPosition(null);
    setLastOffset(null);
    // Swipe if needed
    if (lastOffsetValue) {
      const distanceX = lastOffsetValue.x / lastTimeDiff.value;
      const distanceY = lastOffsetValue.y / lastTimeDiff.value;
      const absX = Math.abs(distanceX);
      const absY = Math.abs(distanceY);
      // Skip swipe if low distance
      if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) return;
      let currentX = distanceX;
      let currentY = distanceY;
      motionInterval.value = setInterval(() => {
        if (Math.abs(currentX) < STOP_SWIPE_DISTANCE && Math.abs(currentY) < STOP_SWIPE_DISTANCE) {
          clearInterval(motionInterval.value);
          return;
        }
        currentX *= SPEED_OFF_MULTIPLE;
        currentY *= SPEED_OFF_MULTIPLE;
        onOffset(currentX * REFRESH_INTERVAL, currentY * REFRESH_INTERVAL);
      }, REFRESH_INTERVAL);
    }
  }
  // >>> Wheel event
  const lastWheelDirectionRef = (0, _vue.ref)();
  function onWheel(e) {
    const {
      deltaX,
      deltaY
    } = e;
    // Convert both to x & y since wheel only happened on PC
    let mixed = 0;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    if (absX === absY) {
      mixed = lastWheelDirectionRef.value === 'x' ? deltaX : deltaY;
    } else if (absX > absY) {
      mixed = deltaX;
      lastWheelDirectionRef.value = 'x';
    } else {
      mixed = deltaY;
      lastWheelDirectionRef.value = 'y';
    }
    if (onOffset(-mixed, -mixed)) {
      e.preventDefault();
    }
  }
  // ========================= Effect =========================
  const touchEventsRef = (0, _vue.ref)({
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onWheel
  });
  function onProxyTouchStart(e) {
    touchEventsRef.value.onTouchStart(e);
  }
  function onProxyTouchMove(e) {
    touchEventsRef.value.onTouchMove(e);
  }
  function onProxyTouchEnd(e) {
    touchEventsRef.value.onTouchEnd(e);
  }
  function onProxyWheel(e) {
    touchEventsRef.value.onWheel(e);
  }
  (0, _vue.onMounted)(() => {
    var _a, _b;
    document.addEventListener('touchmove', onProxyTouchMove, {
      passive: false
    });
    document.addEventListener('touchend', onProxyTouchEnd, {
      passive: false
    });
    // No need to clean up since element removed
    (_a = domRef.value) === null || _a === void 0 ? void 0 : _a.addEventListener('touchstart', onProxyTouchStart, {
      passive: false
    });
    (_b = domRef.value) === null || _b === void 0 ? void 0 : _b.addEventListener('wheel', onProxyWheel, {
      passive: false
    });
  });
  (0, _vue.onBeforeUnmount)(() => {
    document.removeEventListener('touchmove', onProxyTouchMove);
    document.removeEventListener('touchend', onProxyTouchEnd);
  });
}