import type { Ref } from 'vue';
export default function useMobileTouchMove(inVirtual: Ref<boolean>, listRef: Ref<HTMLDivElement | undefined>, callback: (offsetY: number, smoothOffset?: boolean) => boolean): void;
