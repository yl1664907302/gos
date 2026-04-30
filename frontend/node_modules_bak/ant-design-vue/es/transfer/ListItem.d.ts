import type { ExtractPropTypes } from 'vue';
export declare const transferListItemProps: {
    renderedText: import("vue-types").VueTypeValidableDef<any>;
    renderedEl: import("vue-types").VueTypeValidableDef<any>;
    item: import("vue-types").VueTypeValidableDef<any>;
    checked: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    onClick: FunctionConstructor;
    onRemove: FunctionConstructor;
};
export type TransferListItemProps = Partial<ExtractPropTypes<typeof transferListItemProps>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    renderedText: import("vue-types").VueTypeValidableDef<any>;
    renderedEl: import("vue-types").VueTypeValidableDef<any>;
    item: import("vue-types").VueTypeValidableDef<any>;
    checked: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    onClick: FunctionConstructor;
    onRemove: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("click" | "remove")[], "click" | "remove", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    renderedText: import("vue-types").VueTypeValidableDef<any>;
    renderedEl: import("vue-types").VueTypeValidableDef<any>;
    item: import("vue-types").VueTypeValidableDef<any>;
    checked: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    onClick: FunctionConstructor;
    onRemove: FunctionConstructor;
}>> & Readonly<{
    onClick?: (...args: any[]) => any;
    onRemove?: (...args: any[]) => any;
}>, {
    disabled: boolean;
    checked: boolean;
    showRemove: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
