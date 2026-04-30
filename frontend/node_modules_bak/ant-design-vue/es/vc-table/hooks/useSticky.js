import canUseDom from '../../_util/canUseDom';
import { computed } from 'vue';
// fix ssr render
const defaultContainer = canUseDom() ? window : null;
/** Sticky header hooks */
export default function useSticky(stickyRef, prefixClsRef) {
  return computed(() => {
    const {
      offsetHeader = 0,
      offsetSummary = 0,
      offsetScroll = 0,
      getContainer = () => defaultContainer
    } = typeof stickyRef.value === 'object' ? stickyRef.value : {};
    const container = getContainer() || defaultContainer;
    const isSticky = !!stickyRef.value;
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixClsRef.value}-sticky-holder` : '',
      offsetHeader,
      offsetSummary,
      offsetScroll,
      container
    };
  });
}