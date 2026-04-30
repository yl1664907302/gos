import type { ExtractPropTypes } from 'vue';
export declare const starProps: {
    value: NumberConstructor;
    index: NumberConstructor;
    prefixCls: StringConstructor;
    allowHalf: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    count: NumberConstructor;
    onClick: FunctionConstructor;
    onHover: FunctionConstructor;
};
export type StarProps = Partial<ExtractPropTypes<typeof starProps>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    value: NumberConstructor;
    index: NumberConstructor;
    prefixCls: StringConstructor;
    allowHalf: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    count: NumberConstructor;
    onClick: FunctionConstructor;
    onHover: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("click" | "hover")[], "click" | "hover", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    value: NumberConstructor;
    index: NumberConstructor;
    prefixCls: StringConstructor;
    allowHalf: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    count: NumberConstructor;
    onClick: FunctionConstructor;
    onHover: FunctionConstructor;
}>> & Readonly<{
    onClick?: (...args: any[]) => any;
    onHover?: (...args: any[]) => any;
}>, {
    focused: boolean;
    disabled: boolean;
    allowHalf: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
