import type { DirectionType, SizeType } from '../config-provider';
import type { PropType, ExtractPropTypes, Ref } from 'vue';
export declare const spaceCompactItemProps: () => {
    compactSize: PropType<SizeType>;
    compactDirection: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    isFirstItem: {
        type: BooleanConstructor;
        default: boolean;
    };
    isLastItem: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type SpaceCompactItemContextType = Partial<ExtractPropTypes<ReturnType<typeof spaceCompactItemProps>>>;
export declare const SpaceCompactItemContext: {
    useProvide: (props: Partial<ExtractPropTypes<{
        compactSize: PropType<SizeType>;
        compactDirection: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        isFirstItem: {
            type: BooleanConstructor;
            default: boolean;
        };
        isLastItem: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>>, newProps?: Partial<ExtractPropTypes<{
        compactSize: PropType<SizeType>;
        compactDirection: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        isFirstItem: {
            type: BooleanConstructor;
            default: boolean;
        };
        isLastItem: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>>) => {
        compactDirection?: string;
        isFirstItem?: boolean;
        isLastItem?: boolean;
        compactSize?: SizeType;
    };
    useInject: () => Partial<ExtractPropTypes<{
        compactSize: PropType<SizeType>;
        compactDirection: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        isFirstItem: {
            type: BooleanConstructor;
            default: boolean;
        };
        isLastItem: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>>;
};
export declare const useCompactItemContext: (prefixCls: Ref<string>, direction: Ref<DirectionType>) => {
    compactSize: import("vue").ComputedRef<SizeType>;
    compactDirection: import("vue").ComputedRef<string>;
    compactItemClassnames: import("vue").ComputedRef<string>;
};
export declare const NoCompactStyle: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const spaceCompactProps: () => {
    prefixCls: StringConstructor;
    size: {
        type: PropType<SizeType>;
    };
    direction: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    align: import("vue-types").VueTypeDef<string>;
    block: {
        type: BooleanConstructor;
        default: any;
    };
};
export type SpaceCompactProps = Partial<ExtractPropTypes<ReturnType<typeof spaceCompactProps>>>;
declare const Compact: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    size: {
        type: PropType<SizeType>;
    };
    direction: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    align: import("vue-types").VueTypeDef<string>;
    block: {
        type: BooleanConstructor;
        default: any;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    size: {
        type: PropType<SizeType>;
    };
    direction: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    align: import("vue-types").VueTypeDef<string>;
    block: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{}>, {
    block: boolean;
    direction: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Compact;
