import type { Ref } from 'vue';
export default function useTouchMove(domRef: Ref<HTMLDivElement>, onOffset: (offsetX: number, offsetY: number) => boolean): void;
