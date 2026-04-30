import type { PropType } from 'vue';
import type { SkeletonElementProps } from './Element';
export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
    size?: 'large' | 'small' | 'default';
    block?: boolean;
}
declare const SkeletonInput: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    size: PropType<"default" | "small" | "large">;
    block: BooleanConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    size: PropType<"default" | "small" | "large">;
    block: BooleanConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
}>> & Readonly<{}>, {
    block: boolean;
    active: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default SkeletonInput;
