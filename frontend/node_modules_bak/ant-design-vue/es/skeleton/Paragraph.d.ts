import type { ExtractPropTypes, PropType } from 'vue';
type widthUnit = number | string;
export declare const skeletonParagraphProps: () => {
    prefixCls: StringConstructor;
    width: {
        type: PropType<widthUnit | widthUnit[]>;
    };
    rows: NumberConstructor;
};
export type SkeletonParagraphProps = Partial<ExtractPropTypes<ReturnType<typeof skeletonParagraphProps>>>;
declare const SkeletonParagraph: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    width: {
        type: PropType<widthUnit | widthUnit[]>;
    };
    rows: NumberConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    width: {
        type: PropType<widthUnit | widthUnit[]>;
    };
    rows: NumberConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default SkeletonParagraph;
