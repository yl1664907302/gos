import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { VueNode, CustomSlotsType } from '../_util/type';
import type { TransferListBodyProps } from './ListBody';
import type { PaginationType } from './interface';
export type { TransferListProps } from './list';
export type { TransferOperationProps } from './operation';
export type { TransferSearchProps } from './search';
export type TransferDirection = 'left' | 'right';
export interface RenderResultObject {
    label: VueNode;
    value: string;
}
export type RenderResult = VueNode | RenderResultObject | string | null;
export interface TransferItem {
    key?: string;
    title?: string;
    description?: string;
    disabled?: boolean;
    [name: string]: any;
}
export type KeyWise<T> = T & {
    key: string;
};
export type KeyWiseTransferItem = KeyWise<TransferItem>;
type TransferRender<RecordType> = (item: RecordType) => RenderResult;
export interface ListStyle {
    direction: TransferDirection;
}
export type SelectAllLabel = VueNode | ((info: {
    selectedCount: number;
    totalCount: number;
}) => VueNode);
export interface TransferLocale {
    titles?: VueNode[];
    notFoundContent?: VueNode;
    searchPlaceholder: string;
    itemUnit: string;
    itemsUnit: string;
    remove?: string;
    selectAll?: string;
    selectCurrent?: string;
    selectInvert?: string;
    removeAll?: string;
    removeCurrent?: string;
}
export declare const transferProps: () => {
    id: StringConstructor;
    prefixCls: StringConstructor;
    dataSource: {
        type: import("vue").PropType<TransferItem[]>;
        default: TransferItem[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    targetKeys: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    selectedKeys: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    render: {
        type: import("vue").PropType<TransferRender<TransferItem>>;
        default: TransferRender<TransferItem>;
    };
    listStyle: {
        type: import("vue").PropType<CSSProperties | ((style: ListStyle) => CSSProperties)>;
        default: CSSProperties | ((style: ListStyle) => CSSProperties);
    };
    operationStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    titles: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    operations: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterOption: {
        type: import("vue").PropType<(inputValue: string, item: TransferItem) => boolean>;
        default: (inputValue: string, item: TransferItem) => boolean;
    };
    searchPlaceholder: StringConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    locale: {
        type: import("vue").PropType<{}>;
        default: {};
    };
    rowKey: {
        type: import("vue").PropType<(record: TransferItem) => string>;
        default: (record: TransferItem) => string;
    };
    showSelectAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectAllLabels: {
        type: import("vue").PropType<SelectAllLabel[]>;
        default: SelectAllLabel[];
    };
    children: {
        type: import("vue").PropType<(props: TransferListBodyProps) => VueNode>;
        default: (props: TransferListBodyProps) => VueNode;
    };
    oneWay: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: {
        type: import("vue").PropType<PaginationType>;
        default: PaginationType;
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    onChange: {
        type: import("vue").PropType<(targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void>;
        default: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
    };
    onSelectChange: {
        type: import("vue").PropType<(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void>;
        default: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
    };
    onSearch: {
        type: import("vue").PropType<(direction: TransferDirection, value: string) => void>;
        default: (direction: TransferDirection, value: string) => void;
    };
    onScroll: {
        type: import("vue").PropType<(direction: TransferDirection, e: UIEvent) => void>;
        default: (direction: TransferDirection, e: UIEvent) => void;
    };
    'onUpdate:targetKeys': {
        type: import("vue").PropType<(keys: string[]) => void>;
        default: (keys: string[]) => void;
    };
    'onUpdate:selectedKeys': {
        type: import("vue").PropType<(keys: string[]) => void>;
        default: (keys: string[]) => void;
    };
};
export type TransferProps = Partial<ExtractPropTypes<ReturnType<typeof transferProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        dataSource: {
            type: import("vue").PropType<TransferItem[]>;
            default: TransferItem[];
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        targetKeys: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        selectedKeys: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        render: {
            type: import("vue").PropType<TransferRender<TransferItem>>;
            default: TransferRender<TransferItem>;
        };
        listStyle: {
            type: import("vue").PropType<CSSProperties | ((style: ListStyle) => CSSProperties)>;
            default: CSSProperties | ((style: ListStyle) => CSSProperties);
        };
        operationStyle: {
            type: import("vue").PropType<CSSProperties>;
            default: CSSProperties;
        };
        titles: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        operations: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        showSearch: {
            type: BooleanConstructor;
            default: boolean;
        };
        filterOption: {
            type: import("vue").PropType<(inputValue: string, item: TransferItem) => boolean>;
            default: (inputValue: string, item: TransferItem) => boolean;
        };
        searchPlaceholder: StringConstructor;
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        locale: {
            type: import("vue").PropType<{}>;
            default: {};
        };
        rowKey: {
            type: import("vue").PropType<(record: TransferItem) => string>;
            default: (record: TransferItem) => string;
        };
        showSelectAll: {
            type: BooleanConstructor;
            default: boolean;
        };
        selectAllLabels: {
            type: import("vue").PropType<SelectAllLabel[]>;
            default: SelectAllLabel[];
        };
        children: {
            type: import("vue").PropType<(props: Partial<ExtractPropTypes<{
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
            }>>) => VueNode>;
            default: (props: Partial<ExtractPropTypes<{
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
            }>>) => VueNode;
        };
        oneWay: {
            type: BooleanConstructor;
            default: boolean;
        };
        pagination: {
            type: import("vue").PropType<PaginationType>;
            default: PaginationType;
        };
        status: {
            type: import("vue").PropType<"" | "error" | "warning">;
            default: "" | "error" | "warning";
        };
        onChange: {
            type: import("vue").PropType<(targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void>;
            default: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
        };
        onSelectChange: {
            type: import("vue").PropType<(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void>;
            default: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
        };
        onSearch: {
            type: import("vue").PropType<(direction: TransferDirection, value: string) => void>;
            default: (direction: TransferDirection, value: string) => void;
        };
        onScroll: {
            type: import("vue").PropType<(direction: TransferDirection, e: UIEvent) => void>;
            default: (direction: TransferDirection, e: UIEvent) => void;
        };
        'onUpdate:targetKeys': {
            type: import("vue").PropType<(keys: string[]) => void>;
            default: (keys: string[]) => void;
        };
        'onUpdate:selectedKeys': {
            type: import("vue").PropType<(keys: string[]) => void>;
            default: (keys: string[]) => void;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        children: (props: Partial<ExtractPropTypes<{
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
        }>>) => VueNode;
        onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
        onScroll: (direction: TransferDirection, e: UIEvent) => void;
        render: TransferRender<TransferItem>;
        listStyle: CSSProperties | ((style: ListStyle) => CSSProperties);
        disabled: boolean;
        locale: {};
        status: "" | "error" | "warning";
        selectedKeys: string[];
        'onUpdate:selectedKeys': (keys: string[]) => void;
        onSearch: (direction: TransferDirection, value: string) => void;
        titles: string[];
        showSearch: boolean;
        filterOption: (inputValue: string, item: TransferItem) => boolean;
        pagination: boolean | {
            pageSize?: number;
            simple?: boolean;
            showSizeChanger?: boolean;
            showLessItems?: boolean;
        };
        dataSource: TransferItem[];
        showSelectAll: boolean;
        oneWay: boolean;
        targetKeys: string[];
        operationStyle: CSSProperties;
        operations: string[];
        rowKey: (record: TransferItem) => string;
        selectAllLabels: SelectAllLabel[];
        onSelectChange: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
        'onUpdate:targetKeys': (keys: string[]) => void;
    }, true, {}, CustomSlotsType<{
        leftTitle?: any;
        rightTitle?: any;
        children?: any;
        render?: TransferItem;
        notFoundContent?: any;
        leftSelectAllLabel?: any;
        rightSelectAllLabel?: any;
        footer?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        dataSource: {
            type: import("vue").PropType<TransferItem[]>;
            default: TransferItem[];
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        targetKeys: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        selectedKeys: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        render: {
            type: import("vue").PropType<TransferRender<TransferItem>>;
            default: TransferRender<TransferItem>;
        };
        listStyle: {
            type: import("vue").PropType<CSSProperties | ((style: ListStyle) => CSSProperties)>;
            default: CSSProperties | ((style: ListStyle) => CSSProperties);
        };
        operationStyle: {
            type: import("vue").PropType<CSSProperties>;
            default: CSSProperties;
        };
        titles: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        operations: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        showSearch: {
            type: BooleanConstructor;
            default: boolean;
        };
        filterOption: {
            type: import("vue").PropType<(inputValue: string, item: TransferItem) => boolean>;
            default: (inputValue: string, item: TransferItem) => boolean;
        };
        searchPlaceholder: StringConstructor;
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        locale: {
            type: import("vue").PropType<{}>;
            default: {};
        };
        rowKey: {
            type: import("vue").PropType<(record: TransferItem) => string>;
            default: (record: TransferItem) => string;
        };
        showSelectAll: {
            type: BooleanConstructor;
            default: boolean;
        };
        selectAllLabels: {
            type: import("vue").PropType<SelectAllLabel[]>;
            default: SelectAllLabel[];
        };
        children: {
            type: import("vue").PropType<(props: Partial<ExtractPropTypes<{
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
            }>>) => VueNode>;
            default: (props: Partial<ExtractPropTypes<{
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
            }>>) => VueNode;
        };
        oneWay: {
            type: BooleanConstructor;
            default: boolean;
        };
        pagination: {
            type: import("vue").PropType<PaginationType>;
            default: PaginationType;
        };
        status: {
            type: import("vue").PropType<"" | "error" | "warning">;
            default: "" | "error" | "warning";
        };
        onChange: {
            type: import("vue").PropType<(targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void>;
            default: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
        };
        onSelectChange: {
            type: import("vue").PropType<(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void>;
            default: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
        };
        onSearch: {
            type: import("vue").PropType<(direction: TransferDirection, value: string) => void>;
            default: (direction: TransferDirection, value: string) => void;
        };
        onScroll: {
            type: import("vue").PropType<(direction: TransferDirection, e: UIEvent) => void>;
            default: (direction: TransferDirection, e: UIEvent) => void;
        };
        'onUpdate:targetKeys': {
            type: import("vue").PropType<(keys: string[]) => void>;
            default: (keys: string[]) => void;
        };
        'onUpdate:selectedKeys': {
            type: import("vue").PropType<(keys: string[]) => void>;
            default: (keys: string[]) => void;
        };
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, {
        children: (props: Partial<ExtractPropTypes<{
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
        }>>) => VueNode;
        onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
        onScroll: (direction: TransferDirection, e: UIEvent) => void;
        render: TransferRender<TransferItem>;
        listStyle: CSSProperties | ((style: ListStyle) => CSSProperties);
        disabled: boolean;
        locale: {};
        status: "" | "error" | "warning";
        selectedKeys: string[];
        'onUpdate:selectedKeys': (keys: string[]) => void;
        onSearch: (direction: TransferDirection, value: string) => void;
        titles: string[];
        showSearch: boolean;
        filterOption: (inputValue: string, item: TransferItem) => boolean;
        pagination: boolean | {
            pageSize?: number;
            simple?: boolean;
            showSizeChanger?: boolean;
            showLessItems?: boolean;
        };
        dataSource: TransferItem[];
        showSelectAll: boolean;
        oneWay: boolean;
        targetKeys: string[];
        operationStyle: CSSProperties;
        operations: string[];
        rowKey: (record: TransferItem) => string;
        selectAllLabels: SelectAllLabel[];
        onSelectChange: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
        'onUpdate:targetKeys': (keys: string[]) => void;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    dataSource: {
        type: import("vue").PropType<TransferItem[]>;
        default: TransferItem[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    targetKeys: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    selectedKeys: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    render: {
        type: import("vue").PropType<TransferRender<TransferItem>>;
        default: TransferRender<TransferItem>;
    };
    listStyle: {
        type: import("vue").PropType<CSSProperties | ((style: ListStyle) => CSSProperties)>;
        default: CSSProperties | ((style: ListStyle) => CSSProperties);
    };
    operationStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    titles: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    operations: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    filterOption: {
        type: import("vue").PropType<(inputValue: string, item: TransferItem) => boolean>;
        default: (inputValue: string, item: TransferItem) => boolean;
    };
    searchPlaceholder: StringConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    locale: {
        type: import("vue").PropType<{}>;
        default: {};
    };
    rowKey: {
        type: import("vue").PropType<(record: TransferItem) => string>;
        default: (record: TransferItem) => string;
    };
    showSelectAll: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectAllLabels: {
        type: import("vue").PropType<SelectAllLabel[]>;
        default: SelectAllLabel[];
    };
    children: {
        type: import("vue").PropType<(props: Partial<ExtractPropTypes<{
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
        }>>) => VueNode>;
        default: (props: Partial<ExtractPropTypes<{
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
        }>>) => VueNode;
    };
    oneWay: {
        type: BooleanConstructor;
        default: boolean;
    };
    pagination: {
        type: import("vue").PropType<PaginationType>;
        default: PaginationType;
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    onChange: {
        type: import("vue").PropType<(targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void>;
        default: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
    };
    onSelectChange: {
        type: import("vue").PropType<(sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void>;
        default: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
    };
    onSearch: {
        type: import("vue").PropType<(direction: TransferDirection, value: string) => void>;
        default: (direction: TransferDirection, value: string) => void;
    };
    onScroll: {
        type: import("vue").PropType<(direction: TransferDirection, e: UIEvent) => void>;
        default: (direction: TransferDirection, e: UIEvent) => void;
    };
    'onUpdate:targetKeys': {
        type: import("vue").PropType<(keys: string[]) => void>;
        default: (keys: string[]) => void;
    };
    'onUpdate:selectedKeys': {
        type: import("vue").PropType<(keys: string[]) => void>;
        default: (keys: string[]) => void;
    };
}>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    children: (props: Partial<ExtractPropTypes<{
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
    }>>) => VueNode;
    onChange: (targetKeys: string[], direction: TransferDirection, moveKeys: string[]) => void;
    onScroll: (direction: TransferDirection, e: UIEvent) => void;
    render: TransferRender<TransferItem>;
    listStyle: CSSProperties | ((style: ListStyle) => CSSProperties);
    disabled: boolean;
    locale: {};
    status: "" | "error" | "warning";
    selectedKeys: string[];
    'onUpdate:selectedKeys': (keys: string[]) => void;
    onSearch: (direction: TransferDirection, value: string) => void;
    titles: string[];
    showSearch: boolean;
    filterOption: (inputValue: string, item: TransferItem) => boolean;
    pagination: boolean | {
        pageSize?: number;
        simple?: boolean;
        showSizeChanger?: boolean;
        showLessItems?: boolean;
    };
    dataSource: TransferItem[];
    showSelectAll: boolean;
    oneWay: boolean;
    targetKeys: string[];
    operationStyle: CSSProperties;
    operations: string[];
    rowKey: (record: TransferItem) => string;
    selectAllLabels: SelectAllLabel[];
    onSelectChange: (sourceSelectedKeys: string[], targetSelectedKeys: string[]) => void;
    'onUpdate:targetKeys': (keys: string[]) => void;
}, {}, string, CustomSlotsType<{
    leftTitle?: any;
    rightTitle?: any;
    children?: any;
    render?: TransferItem;
    notFoundContent?: any;
    leftSelectAllLabel?: any;
    rightSelectAllLabel?: any;
    footer?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
