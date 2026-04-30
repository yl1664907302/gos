import type { ExtractPropTypes } from 'vue';
export declare const cardGridProps: () => {
    prefixCls: StringConstructor;
    hoverable: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type CardGridProps = Partial<ExtractPropTypes<ReturnType<typeof cardGridProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hoverable: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hoverable: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    hoverable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
