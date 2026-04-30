import type { Ref } from 'vue';
interface FireFoxDOMMouseScrollEvent {
    detail: number;
    preventDefault: Function;
}
export default function useFrameWheel(inVirtual: Ref<boolean>, isScrollAtTop: Ref<boolean>, isScrollAtBottom: Ref<boolean>, onWheelDelta: (offset: number) => void): [(e: WheelEvent) => void, (e: FireFoxDOMMouseScrollEvent) => void];
export {};
