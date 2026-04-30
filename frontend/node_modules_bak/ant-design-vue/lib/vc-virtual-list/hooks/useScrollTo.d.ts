import type { ShallowRef, Ref } from 'vue';
import type { GetKey } from '../interface';
import type { CacheMap } from './useHeights';
export default function useScrollTo(containerRef: Ref<Element | undefined>, mergedData: ShallowRef<any[]>, heights: CacheMap, props: any, getKey: GetKey, collectHeight: () => void, syncScrollTop: (newTop: number) => void, triggerFlash: () => void): (arg?: any) => void;
