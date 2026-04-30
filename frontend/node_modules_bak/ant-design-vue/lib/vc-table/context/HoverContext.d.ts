import type { InjectionKey, Ref } from 'vue';
export interface HoverContextProps {
    startRow: Ref<number>;
    endRow: Ref<number>;
    onHover: (start: number, end: number) => void;
}
export declare const HoverContextKey: InjectionKey<HoverContextProps>;
export declare const useProvideHover: (props: HoverContextProps) => void;
export declare const useInjectHover: () => HoverContextProps;
