import type { ExtractPropTypes } from 'vue';
export declare const menuDividerProps: () => {
    prefixCls: StringConstructor;
    dashed: BooleanConstructor;
};
export type MenuDividerProps = Partial<ExtractPropTypes<ReturnType<typeof menuDividerProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    dashed: BooleanConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    dashed: BooleanConstructor;
}>> & Readonly<{}>, {
    dashed: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
