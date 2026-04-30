import type { ComputedRef, Ref } from 'vue';
import type { TableSticky } from '../interface';
/** Sticky header hooks */
export default function useSticky(stickyRef: Ref<boolean | TableSticky>, prefixClsRef: Ref<string>): ComputedRef<{
    isSticky: boolean;
    offsetHeader: number;
    offsetSummary: number;
    offsetScroll: number;
    stickyClassName: string;
    container: Window | HTMLElement;
}>;
