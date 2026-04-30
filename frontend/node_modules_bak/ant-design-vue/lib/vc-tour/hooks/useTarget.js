"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useTarget;
var _vue = require("vue");
var _util = require("../util");
var _useState = _interopRequireDefault(require("../../_util/hooks/useState"));
function useTarget(target, open, gap, scrollIntoViewOptions) {
  // ========================= Target =========================
  // We trade `undefined` as not get target by function yet.
  // `null` as empty target.
  const [targetElement, setTargetElement] = (0, _useState.default)(undefined);
  (0, _vue.watchEffect)(() => {
    const nextElement = typeof target.value === 'function' ? target.value() : target.value;
    setTargetElement(nextElement || null);
  }, {
    flush: 'post'
  });
  // ========================= Align ==========================
  const [posInfo, setPosInfo] = (0, _useState.default)(null);
  const updatePos = () => {
    if (!open.value) {
      setPosInfo(null);
      return;
    }
    if (targetElement.value) {
      // Exist target element. We should scroll and get target position
      if (!(0, _util.isInViewPort)(targetElement.value) && open.value) {
        targetElement.value.scrollIntoView(scrollIntoViewOptions.value);
      }
      const {
        left,
        top,
        width,
        height
      } = targetElement.value.getBoundingClientRect();
      const nextPosInfo = {
        left,
        top,
        width,
        height,
        radius: 0
      };
      if (JSON.stringify(posInfo.value) !== JSON.stringify(nextPosInfo)) {
        setPosInfo(nextPosInfo);
      }
    } else {
      // Not exist target which means we just show in center
      setPosInfo(null);
    }
  };
  (0, _vue.onMounted)(() => {
    (0, _vue.watch)([open, targetElement], () => {
      updatePos();
    }, {
      flush: 'post',
      immediate: true
    });
    // update when window resize
    window.addEventListener('resize', updatePos);
  });
  (0, _vue.onBeforeUnmount)(() => {
    window.removeEventListener('resize', updatePos);
  });
  // ======================== PosInfo =========================
  const mergedPosInfo = (0, _vue.computed)(() => {
    var _a, _b;
    if (!posInfo.value) {
      return posInfo.value;
    }
    const gapOffset = ((_a = gap.value) === null || _a === void 0 ? void 0 : _a.offset) || 6;
    const gapRadius = ((_b = gap.value) === null || _b === void 0 ? void 0 : _b.radius) || 2;
    return {
      left: posInfo.value.left - gapOffset,
      top: posInfo.value.top - gapOffset,
      width: posInfo.value.width + gapOffset * 2,
      height: posInfo.value.height + gapOffset * 2,
      radius: gapRadius
    };
  });
  return [mergedPosInfo, targetElement];
}