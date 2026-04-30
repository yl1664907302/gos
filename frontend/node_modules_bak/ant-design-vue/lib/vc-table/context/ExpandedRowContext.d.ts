import type { InjectionKey, Ref } from 'vue';
export interface ExpandedRowProps {
    componentWidth: Ref<number>;
    fixHeader: Ref<boolean>;
    fixColumn: Ref<boolean>;
    horizonScroll: Ref<boolean>;
}
export declare const ExpandedRowContextKey: InjectionKey<ExpandedRowProps>;
export declare const useProvideExpandedRow: (props: ExpandedRowProps) => void;
export declare const useInjectExpandedRow: () => ExpandedRowProps;
