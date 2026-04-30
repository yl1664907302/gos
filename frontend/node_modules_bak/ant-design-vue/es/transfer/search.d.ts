import type { ExtractPropTypes } from 'vue';
export declare const transferSearchProps: {
    prefixCls: StringConstructor;
    placeholder: StringConstructor;
    value: StringConstructor;
    handleClear: FunctionConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    onChange: FunctionConstructor;
};
export type TransferSearchProps = Partial<ExtractPropTypes<typeof transferSearchProps>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    placeholder: StringConstructor;
    value: StringConstructor;
    handleClear: FunctionConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    onChange: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "change"[], "change", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    placeholder: StringConstructor;
    value: StringConstructor;
    handleClear: FunctionConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    onChange: FunctionConstructor;
}>> & Readonly<{
    onChange?: (...args: any[]) => any;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
