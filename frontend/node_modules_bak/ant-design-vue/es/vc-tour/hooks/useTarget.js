import { computed, watchEffect, onMounted, watch, onBeforeUnmount } from 'vue';
import { isInViewPort } from '../util';
import useState from '../../_util/hooks/useState';
export default function useTarget(target, open, gap, scrollIntoViewOptions) {
  // ========================= Target =========================
  // We trade `undefined` as not get target by function yet.
  // `null` as empty target.
  const [targetElement, setTargetElement] = useState(undefined);
  watchEffect(() => {
    const nextElement = typeof target.value === 'function' ? target.value() : target.value;
    setTargetElement(nextElement || null);
  }, {
    flush: 'post'
  });
  // ========================= Align ==========================
  const [posInfo, setPosInfo] = useState(null);
  const updatePos = () => {
    if (!open.value) {
      setPosInfo(null);
      return;
    }
    if (targetElement.value) {
      // Exist target element. We should scroll and get target position
      if (!isInViewPort(targetElement.value) && open.value) {
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
  onMounted(() => {
    watch([open, targetElement], () => {
      updatePos();
    }, {
      flush: 'post',
      immediate: true
    });
    // update when window resize
    window.addEventListener('resize', updatePos);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', updatePos);
  });
  // ======================== PosInfo =========================
  const mergedPosInfo = computed(() => {
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