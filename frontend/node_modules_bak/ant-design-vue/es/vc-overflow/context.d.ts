import type { ComputedRef, PropType } from 'vue';
import type { Key } from '../_util/type';
export interface OverflowContextProviderValueType {
    prefixCls: string;
    responsive: boolean;
    order: number;
    registerSize: (key: Key, width: number | null) => void;
    display: boolean;
    invalidate: boolean;
    item?: any;
    itemKey?: Key;
    className?: string;
}
export declare const OverflowContextProvider: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    value: {
        type: PropType<OverflowContextProviderValueType>;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: {
        type: PropType<OverflowContextProviderValueType>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const useInjectOverflowContext: () => ComputedRef<OverflowContextProviderValueType | null>;
