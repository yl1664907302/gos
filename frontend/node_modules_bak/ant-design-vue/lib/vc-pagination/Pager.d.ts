declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    rootPrefixCls: StringConstructor;
    page: NumberConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    last: {
        type: BooleanConstructor;
        default: any;
    };
    locale: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    showTitle: {
        type: BooleanConstructor;
        default: any;
    };
    itemRender: {
        type: FunctionConstructor;
        default: () => void;
    };
    onClick: {
        type: FunctionConstructor;
    };
    onKeypress: {
        type: FunctionConstructor;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    rootPrefixCls: StringConstructor;
    page: NumberConstructor;
    active: {
        type: BooleanConstructor;
        default: any;
    };
    last: {
        type: BooleanConstructor;
        default: any;
    };
    locale: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    showTitle: {
        type: BooleanConstructor;
        default: any;
    };
    itemRender: {
        type: FunctionConstructor;
        default: () => void;
    };
    onClick: {
        type: FunctionConstructor;
    };
    onKeypress: {
        type: FunctionConstructor;
    };
}>> & Readonly<{}>, {
    last: boolean;
    active: boolean;
    locale: {
        [key: string]: any;
    };
    showTitle: boolean;
    itemRender: Function;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
