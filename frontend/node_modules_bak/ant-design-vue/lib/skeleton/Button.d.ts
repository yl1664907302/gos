import type { ExtractPropTypes, PropType } from 'vue';
export declare const skeletonButtonProps: () => {
    size: PropType<"default" | "small" | "large">;
    block: BooleanConstructor;
    prefixCls: StringConstructor;
    shape: PropType<"default" | "circle" | "round" | "square">;
    active: {
        type: BooleanConstructor;
        default: any;
    };
};
export type SkeletonButtonProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonButtonProps>>>;
declare const SkeletonButton: import("vue").DefineComponent<ExtractPropTypes<{
    size: PropType<"default" | "small" | "large">;
    block: BooleanConstructor;
    prefixCls: StringConstructor;
    shape: PropType<"default" | "circle" | "round" | "square">;
    active: {
        type: BooleanConstructor;
        default: any;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    size: PropType<"default" | "small" | "large">;
    block: BooleanConstructor;
    prefixCls: StringConstructor;
    shape: PropType<"default" | "circle" | "round" | "square">;
    active: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{}>, {
    block: boolean;
    active: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default SkeletonButton;
