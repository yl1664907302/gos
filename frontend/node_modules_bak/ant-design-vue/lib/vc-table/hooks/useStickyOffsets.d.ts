import type { ComputedRef, Ref } from 'vue';
import type { StickyOffsets } from '../interface';
/**
 * Get sticky column offset width
 */
declare function useStickyOffsets(colWidthsRef: Ref<number[]>, columnCountRef: Ref<number>, directionRef: Ref<'ltr' | 'rtl'>): ComputedRef<StickyOffsets>;
export default useStickyOffsets;
