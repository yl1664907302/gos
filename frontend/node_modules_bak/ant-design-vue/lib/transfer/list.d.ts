import type { ExtractPropTypes } from 'vue';
import type { TransferDirection, TransferItem } from './index';
import type { CustomSlotsType } from '../_util/type';
export declare const transferListProps: {
    prefixCls: StringConstructor;
    dataSource: {
        type: import("vue").PropType<TransferItem[]>;
        default: TransferItem[];
    };
    filter: StringConstructor;
    filterOption: FunctionConstructor;
    checkedKeys: import("vue-types").VueTypeDef<string[]>;
    handleFilter: FunctionConstructor;
    handleClear: FunctionConstructor;
    renderItem: FunctionConstructor;
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    searchPlaceholder: StringConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    itemUnit: StringConstructor;
    itemsUnit: StringConstructor;
    renderList: import("vue-types").VueTypeValidableDef<any>;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    direction: {
        type: import("vue").PropType<TransferDirection>;
        default: TransferDirection;
    };
    showSelectAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    remove: StringConstructor;
    selectAll: StringConstructor;
    selectCurrent: StringConstructor;
    selectInvert: StringConstructor;
    removeAll: StringConstructor;
    removeCurrent: StringConstructor;
    selectAllLabel: import("vue-types").VueTypeValidableDef<any>;
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: import("vue-types").VueTypeValidableDef<any>;
    onItemSelect: FunctionConstructor;
    onItemSelectAll: FunctionConstructor;
    onItemRemove: FunctionConstructor;
    onScroll: FunctionConstructor;
};
export type TransferListProps = Partial<ExtractPropTypes<typeof transferListProps>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    dataSource: {
        type: import("vue").PropType<TransferItem[]>;
        default: TransferItem[];
    };
    filter: StringConstructor;
    filterOption: FunctionConstructor;
    checkedKeys: import("vue-types").VueTypeDef<string[]>;
    handleFilter: FunctionConstructor;
    handleClear: FunctionConstructor;
    renderItem: FunctionConstructor;
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    searchPlaceholder: StringConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    itemUnit: StringConstructor;
    itemsUnit: StringConstructor;
    renderList: import("vue-types").VueTypeValidableDef<any>;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    direction: {
        type: import("vue").PropType<TransferDirection>;
        default: TransferDirection;
    };
    showSelectAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    remove: StringConstructor;
    selectAll: StringConstructor;
    selectCurrent: StringConstructor;
    selectInvert: StringConstructor;
    removeAll: StringConstructor;
    removeCurrent: StringConstructor;
    selectAllLabel: import("vue-types").VueTypeValidableDef<any>;
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: import("vue-types").VueTypeValidableDef<any>;
    onItemSelect: FunctionConstructor;
    onItemSelectAll: FunctionConstructor;
    onItemRemove: FunctionConstructor;
    onScroll: FunctionConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    dataSource: {
        type: import("vue").PropType<TransferItem[]>;
        default: TransferItem[];
    };
    filter: StringConstructor;
    filterOption: FunctionConstructor;
    checkedKeys: import("vue-types").VueTypeDef<string[]>;
    handleFilter: FunctionConstructor;
    handleClear: FunctionConstructor;
    renderItem: FunctionConstructor;
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    searchPlaceholder: StringConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    itemUnit: StringConstructor;
    itemsUnit: StringConstructor;
    renderList: import("vue-types").VueTypeValidableDef<any>;
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    direction: {
        type: import("vue").PropType<TransferDirection>;
        default: TransferDirection;
    };
    showSelectAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    remove: StringConstructor;
    selectAll: StringConstructor;
    selectCurrent: StringConstructor;
    selectInvert: StringConstructor;
    removeAll: StringConstructor;
    removeCurrent: StringConstructor;
    selectAllLabel: import("vue-types").VueTypeValidableDef<any>;
    showRemove: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: import("vue-types").VueTypeValidableDef<any>;
    onItemSelect: FunctionConstructor;
    onItemSelectAll: FunctionConstructor;
    onItemRemove: FunctionConstructor;
    onScroll: FunctionConstructor;
}>> & Readonly<{}>, {
    direction: TransferDirection;
    disabled: boolean;
    showRemove: boolean;
    showSearch: boolean;
    dataSource: TransferItem[];
    showSelectAll: boolean;
}, CustomSlotsType<{
    footer?: any;
    titleText?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
