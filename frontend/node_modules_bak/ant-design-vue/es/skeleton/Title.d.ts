import type { ExtractPropTypes, PropType } from 'vue';
export declare const skeletonTitleProps: () => {
    prefixCls: StringConstructor;
    width: {
        type: PropType<string | number>;
    };
};
export type SkeletonTitleProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonTitleProps>>>;
declare const SkeletonTitle: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    width: {
        type: PropType<string | number>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    width: {
        type: PropType<string | number>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default SkeletonTitle;
