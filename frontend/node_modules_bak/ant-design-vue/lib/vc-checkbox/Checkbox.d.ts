export declare const checkboxProps: {
    prefixCls: StringConstructor;
    name: StringConstructor;
    id: StringConstructor;
    type: StringConstructor;
    defaultChecked: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: any;
    };
    checked: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: any;
    };
    disabled: BooleanConstructor;
    tabindex: {
        type: (StringConstructor | NumberConstructor)[];
    };
    readonly: BooleanConstructor;
    autofocus: BooleanConstructor;
    value: import("vue-types").VueTypeValidableDef<any>;
    required: BooleanConstructor;
};
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    name: StringConstructor;
    id: StringConstructor;
    type: StringConstructor;
    defaultChecked: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: any;
    };
    checked: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: any;
    };
    disabled: BooleanConstructor;
    tabindex: {
        type: (StringConstructor | NumberConstructor)[];
    };
    readonly: BooleanConstructor;
    autofocus: BooleanConstructor;
    value: import("vue-types").VueTypeValidableDef<any>;
    required: BooleanConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "click")[], "change" | "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    name: StringConstructor;
    id: StringConstructor;
    type: StringConstructor;
    defaultChecked: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: any;
    };
    checked: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: any;
    };
    disabled: BooleanConstructor;
    tabindex: {
        type: (StringConstructor | NumberConstructor)[];
    };
    readonly: BooleanConstructor;
    autofocus: BooleanConstructor;
    value: import("vue-types").VueTypeValidableDef<any>;
    required: BooleanConstructor;
}>> & Readonly<{
    onClick?: (...args: any[]) => any;
    onChange?: (...args: any[]) => any;
}>, {
    required: boolean;
    disabled: boolean;
    autofocus: boolean;
    defaultChecked: number | boolean;
    checked: number | boolean;
    readonly: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
