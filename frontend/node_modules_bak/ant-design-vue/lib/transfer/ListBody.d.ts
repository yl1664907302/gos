import type { ExtractPropTypes } from 'vue';
export declare const transferListBodyProps: {
    prefixCls: StringConstructor;
    filteredRenderItems: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    } & {
        default: () => unknown[];
    };
    selectedKeys: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: import("vue-types").VueTypeValidableDef<any>;
    onItemSelect: FunctionConstructor;
    onScroll: FunctionConstructor;
    onItemRemove: FunctionConstructor;
};
export type TransferListBodyProps = Partial<ExtractPropTypes<typeof transferListBodyProps>>;
declare const ListBody: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    filteredRenderItems: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    } & {
        default: () => unknown[];
    };
    selectedKeys: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: import("vue-types").VueTypeValidableDef<any>;
    onItemSelect: FunctionConstructor;
    onScroll: FunctionConstructor;
    onItemRemove: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("scroll" | "itemSelect" | "itemRemove")[], "scroll" | "itemSelect" | "itemRemove", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    filteredRenderItems: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    } & {
        default: () => unknown[];
    };
    selectedKeys: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: import("vue-types").VueTypeValidableDef<any>;
    onItemSelect: FunctionConstructor;
    onScroll: FunctionConstructor;
    onItemRemove: FunctionConstructor;
}>> & Readonly<{
    onScroll?: (...args: any[]) => any;
    onItemSelect?: (...args: any[]) => any;
    onItemRemove?: (...args: any[]) => any;
}>, {
    disabled: boolean;
    selectedKeys: unknown[];
    showRemove: boolean;
    filteredRenderItems: unknown[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default ListBody;
