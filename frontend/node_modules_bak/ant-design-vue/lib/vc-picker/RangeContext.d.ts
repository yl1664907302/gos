import type { InjectionKey, PropType, Ref } from 'vue';
import type { NullableDateType, RangeValue } from './interface';
export type RangeContextProps = {
    /**
     * Set displayed range value style.
     * Panel only has one value, this is only style effect.
     */
    rangedValue?: Ref<[NullableDateType<any>, NullableDateType<any>] | null>;
    hoverRangedValue?: Ref<RangeValue<any>>;
    inRange?: Ref<boolean>;
    panelPosition?: Ref<'left' | 'right' | false>;
};
type RangeContextProviderValue = {
    /**
     * Set displayed range value style.
     * Panel only has one value, this is only style effect.
     */
    rangedValue?: [NullableDateType<any>, NullableDateType<any>] | null;
    hoverRangedValue?: RangeValue<any>;
    inRange?: boolean;
    panelPosition?: 'left' | 'right' | false;
};
declare const RangeContextKey: InjectionKey<RangeContextProps>;
export declare const useProvideRange: (props: RangeContextProps) => void;
export declare const useInjectRange: () => RangeContextProps;
export declare const RangeContextProvider: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    value: {
        type: PropType<RangeContextProviderValue>;
        default: () => RangeContextProviderValue;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: {
        type: PropType<RangeContextProviderValue>;
        default: () => RangeContextProviderValue;
    };
}>> & Readonly<{}>, {
    value: RangeContextProviderValue;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default RangeContextKey;
