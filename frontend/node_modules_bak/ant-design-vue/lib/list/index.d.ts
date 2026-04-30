import type { Plugin, ExtractPropTypes, PropType, HTMLAttributes } from 'vue';
import Item from './Item';
import type { CustomSlotsType, Key } from '../_util/type';
import ItemMeta from './ItemMeta';
export type { ListItemProps } from './Item';
export type { ListItemMetaProps } from './ItemMeta';
export type ColumnType = 'gutter' | 'column' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
export type ColumnCount = number;
export interface ListGridType {
    gutter?: number;
    column?: ColumnCount;
    xs?: ColumnCount;
    sm?: ColumnCount;
    md?: ColumnCount;
    lg?: ColumnCount;
    xl?: ColumnCount;
    xxl?: ColumnCount;
    xxxl?: ColumnCount;
}
export type ListSize = 'small' | 'default' | 'large';
export type ListItemLayout = 'horizontal' | 'vertical';
export declare const listProps: () => {
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dataSource: {
        type: PropType<any[]>;
        default: any[];
    };
    extra: {
        type: PropType<import("../_util/type").VueNode>;
    };
    grid: {
        type: PropType<ListGridType>;
        default: ListGridType;
    };
    itemLayout: PropType<ListItemLayout>;
    loading: {
        type: PropType<boolean | (Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>> & HTMLAttributes)>;
        default: boolean | (Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>> & HTMLAttributes);
    };
    loadMore: {
        type: PropType<import("../_util/type").VueNode>;
    };
    pagination: {
        type: PropType<false | Partial<ExtractPropTypes<{
            position: {
                type: PropType<import("../pagination/Pagination").PaginationPosition>;
                default: import("../pagination/Pagination").PaginationPosition;
            };
            total: NumberConstructor;
            defaultCurrent: NumberConstructor;
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            current: NumberConstructor;
            defaultPageSize: NumberConstructor;
            pageSize: NumberConstructor;
            hideOnSinglePage: {
                type: BooleanConstructor;
                default: boolean;
            };
            showSizeChanger: {
                type: BooleanConstructor;
                default: boolean;
            };
            pageSizeOptions: {
                type: PropType<(string | number)[]>;
                default: (string | number)[];
            };
            buildOptionText: {
                type: PropType<(opt: {
                    value: any;
                }) => any>;
                default: (opt: {
                    value: any;
                }) => any;
            };
            showQuickJumper: {
                type: PropType<boolean | {
                    goButton?: any;
                }>;
                default: boolean | {
                    goButton?: any;
                };
            };
            showTotal: {
                type: PropType<(total: number, range: [number, number]) => any>;
                default: (total: number, range: [number, number]) => any;
            };
            size: {
                type: PropType<"default" | "small">;
                default: "default" | "small";
            };
            simple: {
                type: BooleanConstructor;
                default: boolean;
            };
            locale: ObjectConstructor;
            prefixCls: StringConstructor;
            selectPrefixCls: StringConstructor;
            totalBoundaryShowSizeChanger: NumberConstructor;
            selectComponentClass: StringConstructor;
            itemRender: {
                type: PropType<(opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any>;
                default: (opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any;
            };
            role: StringConstructor;
            responsive: BooleanConstructor;
            showLessItems: {
                type: BooleanConstructor;
                default: boolean;
            };
            onChange: {
                type: PropType<(page: number, pageSize: number) => void>;
                default: (page: number, pageSize: number) => void;
            };
            onShowSizeChange: {
                type: PropType<(current: number, size: number) => void>;
                default: (current: number, size: number) => void;
            };
            'onUpdate:current': {
                type: PropType<(current: number) => void>;
                default: (current: number) => void;
            };
            'onUpdate:pageSize': {
                type: PropType<(size: number) => void>;
                default: (size: number) => void;
            };
        }>>>;
        default: false | Partial<ExtractPropTypes<{
            position: {
                type: PropType<import("../pagination/Pagination").PaginationPosition>;
                default: import("../pagination/Pagination").PaginationPosition;
            };
            total: NumberConstructor;
            defaultCurrent: NumberConstructor;
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            current: NumberConstructor;
            defaultPageSize: NumberConstructor;
            pageSize: NumberConstructor;
            hideOnSinglePage: {
                type: BooleanConstructor;
                default: boolean;
            };
            showSizeChanger: {
                type: BooleanConstructor;
                default: boolean;
            };
            pageSizeOptions: {
                type: PropType<(string | number)[]>;
                default: (string | number)[];
            };
            buildOptionText: {
                type: PropType<(opt: {
                    value: any;
                }) => any>;
                default: (opt: {
                    value: any;
                }) => any;
            };
            showQuickJumper: {
                type: PropType<boolean | {
                    goButton?: any;
                }>;
                default: boolean | {
                    goButton?: any;
                };
            };
            showTotal: {
                type: PropType<(total: number, range: [number, number]) => any>;
                default: (total: number, range: [number, number]) => any;
            };
            size: {
                type: PropType<"default" | "small">;
                default: "default" | "small";
            };
            simple: {
                type: BooleanConstructor;
                default: boolean;
            };
            locale: ObjectConstructor;
            prefixCls: StringConstructor;
            selectPrefixCls: StringConstructor;
            totalBoundaryShowSizeChanger: NumberConstructor;
            selectComponentClass: StringConstructor;
            itemRender: {
                type: PropType<(opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any>;
                default: (opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any;
            };
            role: StringConstructor;
            responsive: BooleanConstructor;
            showLessItems: {
                type: BooleanConstructor;
                default: boolean;
            };
            onChange: {
                type: PropType<(page: number, pageSize: number) => void>;
                default: (page: number, pageSize: number) => void;
            };
            onShowSizeChange: {
                type: PropType<(current: number, size: number) => void>;
                default: (current: number, size: number) => void;
            };
            'onUpdate:current': {
                type: PropType<(current: number) => void>;
                default: (current: number) => void;
            };
            'onUpdate:pageSize': {
                type: PropType<(size: number) => void>;
                default: (size: number) => void;
            };
        }>>;
    };
    prefixCls: StringConstructor;
    rowKey: {
        type: PropType<Key | ((item: any) => Key)>;
        default: Key | ((item: any) => Key);
    };
    renderItem: {
        type: PropType<(opt: {
            item: any;
            index: number;
        }) => any>;
        default: (opt: {
            item: any;
            index: number;
        }) => any;
    };
    size: PropType<ListSize>;
    split: {
        type: BooleanConstructor;
        default: boolean;
    };
    header: {
        type: PropType<import("../_util/type").VueNode>;
    };
    footer: {
        type: PropType<import("../_util/type").VueNode>;
    };
    locale: {
        type: PropType<ListLocale>;
        default: ListLocale;
    };
};
export interface ListLocale {
    emptyText: any;
}
export type ListProps = Partial<ExtractPropTypes<ReturnType<typeof listProps>>>;
export { ItemMeta as ListItemMeta, Item as ListItem };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dataSource: {
            type: PropType<any[]>;
            default: any[];
        };
        extra: {
            type: PropType<import("../_util/type").VueNode>;
        };
        grid: {
            type: PropType<ListGridType>;
            default: ListGridType;
        };
        itemLayout: PropType<ListItemLayout>;
        loading: {
            type: PropType<boolean | (Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>> & HTMLAttributes)>;
            default: boolean | (Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>> & HTMLAttributes);
        };
        loadMore: {
            type: PropType<import("../_util/type").VueNode>;
        };
        pagination: {
            type: PropType<false | Partial<ExtractPropTypes<{
                position: {
                    type: PropType<import("../pagination/Pagination").PaginationPosition>;
                    default: import("../pagination/Pagination").PaginationPosition;
                };
                total: NumberConstructor;
                defaultCurrent: NumberConstructor;
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                current: NumberConstructor;
                defaultPageSize: NumberConstructor;
                pageSize: NumberConstructor;
                hideOnSinglePage: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                showSizeChanger: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                pageSizeOptions: {
                    type: PropType<(string | number)[]>;
                    default: (string | number)[];
                };
                buildOptionText: {
                    type: PropType<(opt: {
                        value: any;
                    }) => any>;
                    default: (opt: {
                        value: any;
                    }) => any;
                };
                showQuickJumper: {
                    type: PropType<boolean | {
                        goButton?: any;
                    }>;
                    default: boolean | {
                        goButton?: any;
                    };
                };
                showTotal: {
                    type: PropType<(total: number, range: [number, number]) => any>;
                    default: (total: number, range: [number, number]) => any;
                };
                size: {
                    type: PropType<"default" | "small">;
                    default: "default" | "small";
                };
                simple: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                locale: ObjectConstructor;
                prefixCls: StringConstructor;
                selectPrefixCls: StringConstructor;
                totalBoundaryShowSizeChanger: NumberConstructor;
                selectComponentClass: StringConstructor;
                itemRender: {
                    type: PropType<(opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any>;
                    default: (opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any;
                };
                role: StringConstructor;
                responsive: BooleanConstructor;
                showLessItems: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                onChange: {
                    type: PropType<(page: number, pageSize: number) => void>;
                    default: (page: number, pageSize: number) => void;
                };
                onShowSizeChange: {
                    type: PropType<(current: number, size: number) => void>;
                    default: (current: number, size: number) => void;
                };
                'onUpdate:current': {
                    type: PropType<(current: number) => void>;
                    default: (current: number) => void;
                };
                'onUpdate:pageSize': {
                    type: PropType<(size: number) => void>;
                    default: (size: number) => void;
                };
            }>>>;
            default: false | Partial<ExtractPropTypes<{
                position: {
                    type: PropType<import("../pagination/Pagination").PaginationPosition>;
                    default: import("../pagination/Pagination").PaginationPosition;
                };
                total: NumberConstructor;
                defaultCurrent: NumberConstructor;
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                current: NumberConstructor;
                defaultPageSize: NumberConstructor;
                pageSize: NumberConstructor;
                hideOnSinglePage: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                showSizeChanger: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                pageSizeOptions: {
                    type: PropType<(string | number)[]>;
                    default: (string | number)[];
                };
                buildOptionText: {
                    type: PropType<(opt: {
                        value: any;
                    }) => any>;
                    default: (opt: {
                        value: any;
                    }) => any;
                };
                showQuickJumper: {
                    type: PropType<boolean | {
                        goButton?: any;
                    }>;
                    default: boolean | {
                        goButton?: any;
                    };
                };
                showTotal: {
                    type: PropType<(total: number, range: [number, number]) => any>;
                    default: (total: number, range: [number, number]) => any;
                };
                size: {
                    type: PropType<"default" | "small">;
                    default: "default" | "small";
                };
                simple: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                locale: ObjectConstructor;
                prefixCls: StringConstructor;
                selectPrefixCls: StringConstructor;
                totalBoundaryShowSizeChanger: NumberConstructor;
                selectComponentClass: StringConstructor;
                itemRender: {
                    type: PropType<(opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any>;
                    default: (opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any;
                };
                role: StringConstructor;
                responsive: BooleanConstructor;
                showLessItems: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                onChange: {
                    type: PropType<(page: number, pageSize: number) => void>;
                    default: (page: number, pageSize: number) => void;
                };
                onShowSizeChange: {
                    type: PropType<(current: number, size: number) => void>;
                    default: (current: number, size: number) => void;
                };
                'onUpdate:current': {
                    type: PropType<(current: number) => void>;
                    default: (current: number) => void;
                };
                'onUpdate:pageSize': {
                    type: PropType<(size: number) => void>;
                    default: (size: number) => void;
                };
            }>>;
        };
        prefixCls: StringConstructor;
        rowKey: {
            type: PropType<Key | ((item: any) => Key)>;
            default: Key | ((item: any) => Key);
        };
        renderItem: {
            type: PropType<(opt: {
                item: any;
                index: number;
            }) => any>;
            default: (opt: {
                item: any;
                index: number;
            }) => any;
        };
        size: PropType<ListSize>;
        split: {
            type: BooleanConstructor;
            default: boolean;
        };
        header: {
            type: PropType<import("../_util/type").VueNode>;
        };
        footer: {
            type: PropType<import("../_util/type").VueNode>;
        };
        locale: {
            type: PropType<ListLocale>;
            default: ListLocale;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        grid: ListGridType;
        split: boolean;
        locale: ListLocale;
        renderItem: (opt: {
            item: any;
            index: number;
        }) => any;
        loading: boolean | (Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>> & HTMLAttributes);
        bordered: boolean;
        pagination: false | Partial<ExtractPropTypes<{
            position: {
                type: PropType<import("../pagination/Pagination").PaginationPosition>;
                default: import("../pagination/Pagination").PaginationPosition;
            };
            total: NumberConstructor;
            defaultCurrent: NumberConstructor;
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            current: NumberConstructor;
            defaultPageSize: NumberConstructor;
            pageSize: NumberConstructor;
            hideOnSinglePage: {
                type: BooleanConstructor;
                default: boolean;
            };
            showSizeChanger: {
                type: BooleanConstructor;
                default: boolean;
            };
            pageSizeOptions: {
                type: PropType<(string | number)[]>;
                default: (string | number)[];
            };
            buildOptionText: {
                type: PropType<(opt: {
                    value: any;
                }) => any>;
                default: (opt: {
                    value: any;
                }) => any;
            };
            showQuickJumper: {
                type: PropType<boolean | {
                    goButton?: any;
                }>;
                default: boolean | {
                    goButton?: any;
                };
            };
            showTotal: {
                type: PropType<(total: number, range: [number, number]) => any>;
                default: (total: number, range: [number, number]) => any;
            };
            size: {
                type: PropType<"default" | "small">;
                default: "default" | "small";
            };
            simple: {
                type: BooleanConstructor;
                default: boolean;
            };
            locale: ObjectConstructor;
            prefixCls: StringConstructor;
            selectPrefixCls: StringConstructor;
            totalBoundaryShowSizeChanger: NumberConstructor;
            selectComponentClass: StringConstructor;
            itemRender: {
                type: PropType<(opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any>;
                default: (opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any;
            };
            role: StringConstructor;
            responsive: BooleanConstructor;
            showLessItems: {
                type: BooleanConstructor;
                default: boolean;
            };
            onChange: {
                type: PropType<(page: number, pageSize: number) => void>;
                default: (page: number, pageSize: number) => void;
            };
            onShowSizeChange: {
                type: PropType<(current: number, size: number) => void>;
                default: (current: number, size: number) => void;
            };
            'onUpdate:current': {
                type: PropType<(current: number) => void>;
                default: (current: number) => void;
            };
            'onUpdate:pageSize': {
                type: PropType<(size: number) => void>;
                default: (size: number) => void;
            };
        }>>;
        dataSource: any[];
        rowKey: Key | ((item: any) => Key);
    }, true, {}, CustomSlotsType<{
        extra: any;
        loadMore: any;
        renderItem: {
            item: any;
            index: number;
        };
        header: any;
        footer: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dataSource: {
            type: PropType<any[]>;
            default: any[];
        };
        extra: {
            type: PropType<import("../_util/type").VueNode>;
        };
        grid: {
            type: PropType<ListGridType>;
            default: ListGridType;
        };
        itemLayout: PropType<ListItemLayout>;
        loading: {
            type: PropType<boolean | (Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>> & HTMLAttributes)>;
            default: boolean | (Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>> & HTMLAttributes);
        };
        loadMore: {
            type: PropType<import("../_util/type").VueNode>;
        };
        pagination: {
            type: PropType<false | Partial<ExtractPropTypes<{
                position: {
                    type: PropType<import("../pagination/Pagination").PaginationPosition>;
                    default: import("../pagination/Pagination").PaginationPosition;
                };
                total: NumberConstructor;
                defaultCurrent: NumberConstructor;
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                current: NumberConstructor;
                defaultPageSize: NumberConstructor;
                pageSize: NumberConstructor;
                hideOnSinglePage: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                showSizeChanger: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                pageSizeOptions: {
                    type: PropType<(string | number)[]>;
                    default: (string | number)[];
                };
                buildOptionText: {
                    type: PropType<(opt: {
                        value: any;
                    }) => any>;
                    default: (opt: {
                        value: any;
                    }) => any;
                };
                showQuickJumper: {
                    type: PropType<boolean | {
                        goButton?: any;
                    }>;
                    default: boolean | {
                        goButton?: any;
                    };
                };
                showTotal: {
                    type: PropType<(total: number, range: [number, number]) => any>;
                    default: (total: number, range: [number, number]) => any;
                };
                size: {
                    type: PropType<"default" | "small">;
                    default: "default" | "small";
                };
                simple: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                locale: ObjectConstructor;
                prefixCls: StringConstructor;
                selectPrefixCls: StringConstructor;
                totalBoundaryShowSizeChanger: NumberConstructor;
                selectComponentClass: StringConstructor;
                itemRender: {
                    type: PropType<(opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any>;
                    default: (opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any;
                };
                role: StringConstructor;
                responsive: BooleanConstructor;
                showLessItems: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                onChange: {
                    type: PropType<(page: number, pageSize: number) => void>;
                    default: (page: number, pageSize: number) => void;
                };
                onShowSizeChange: {
                    type: PropType<(current: number, size: number) => void>;
                    default: (current: number, size: number) => void;
                };
                'onUpdate:current': {
                    type: PropType<(current: number) => void>;
                    default: (current: number) => void;
                };
                'onUpdate:pageSize': {
                    type: PropType<(size: number) => void>;
                    default: (size: number) => void;
                };
            }>>>;
            default: false | Partial<ExtractPropTypes<{
                position: {
                    type: PropType<import("../pagination/Pagination").PaginationPosition>;
                    default: import("../pagination/Pagination").PaginationPosition;
                };
                total: NumberConstructor;
                defaultCurrent: NumberConstructor;
                disabled: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                current: NumberConstructor;
                defaultPageSize: NumberConstructor;
                pageSize: NumberConstructor;
                hideOnSinglePage: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                showSizeChanger: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                pageSizeOptions: {
                    type: PropType<(string | number)[]>;
                    default: (string | number)[];
                };
                buildOptionText: {
                    type: PropType<(opt: {
                        value: any;
                    }) => any>;
                    default: (opt: {
                        value: any;
                    }) => any;
                };
                showQuickJumper: {
                    type: PropType<boolean | {
                        goButton?: any;
                    }>;
                    default: boolean | {
                        goButton?: any;
                    };
                };
                showTotal: {
                    type: PropType<(total: number, range: [number, number]) => any>;
                    default: (total: number, range: [number, number]) => any;
                };
                size: {
                    type: PropType<"default" | "small">;
                    default: "default" | "small";
                };
                simple: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                locale: ObjectConstructor;
                prefixCls: StringConstructor;
                selectPrefixCls: StringConstructor;
                totalBoundaryShowSizeChanger: NumberConstructor;
                selectComponentClass: StringConstructor;
                itemRender: {
                    type: PropType<(opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any>;
                    default: (opt: {
                        page: number;
                        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                        originalElement: any;
                    }) => any;
                };
                role: StringConstructor;
                responsive: BooleanConstructor;
                showLessItems: {
                    type: BooleanConstructor;
                    default: boolean;
                };
                onChange: {
                    type: PropType<(page: number, pageSize: number) => void>;
                    default: (page: number, pageSize: number) => void;
                };
                onShowSizeChange: {
                    type: PropType<(current: number, size: number) => void>;
                    default: (current: number, size: number) => void;
                };
                'onUpdate:current': {
                    type: PropType<(current: number) => void>;
                    default: (current: number) => void;
                };
                'onUpdate:pageSize': {
                    type: PropType<(size: number) => void>;
                    default: (size: number) => void;
                };
            }>>;
        };
        prefixCls: StringConstructor;
        rowKey: {
            type: PropType<Key | ((item: any) => Key)>;
            default: Key | ((item: any) => Key);
        };
        renderItem: {
            type: PropType<(opt: {
                item: any;
                index: number;
            }) => any>;
            default: (opt: {
                item: any;
                index: number;
            }) => any;
        };
        size: PropType<ListSize>;
        split: {
            type: BooleanConstructor;
            default: boolean;
        };
        header: {
            type: PropType<import("../_util/type").VueNode>;
        };
        footer: {
            type: PropType<import("../_util/type").VueNode>;
        };
        locale: {
            type: PropType<ListLocale>;
            default: ListLocale;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        grid: ListGridType;
        split: boolean;
        locale: ListLocale;
        renderItem: (opt: {
            item: any;
            index: number;
        }) => any;
        loading: boolean | (Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>> & HTMLAttributes);
        bordered: boolean;
        pagination: false | Partial<ExtractPropTypes<{
            position: {
                type: PropType<import("../pagination/Pagination").PaginationPosition>;
                default: import("../pagination/Pagination").PaginationPosition;
            };
            total: NumberConstructor;
            defaultCurrent: NumberConstructor;
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            current: NumberConstructor;
            defaultPageSize: NumberConstructor;
            pageSize: NumberConstructor;
            hideOnSinglePage: {
                type: BooleanConstructor;
                default: boolean;
            };
            showSizeChanger: {
                type: BooleanConstructor;
                default: boolean;
            };
            pageSizeOptions: {
                type: PropType<(string | number)[]>;
                default: (string | number)[];
            };
            buildOptionText: {
                type: PropType<(opt: {
                    value: any;
                }) => any>;
                default: (opt: {
                    value: any;
                }) => any;
            };
            showQuickJumper: {
                type: PropType<boolean | {
                    goButton?: any;
                }>;
                default: boolean | {
                    goButton?: any;
                };
            };
            showTotal: {
                type: PropType<(total: number, range: [number, number]) => any>;
                default: (total: number, range: [number, number]) => any;
            };
            size: {
                type: PropType<"default" | "small">;
                default: "default" | "small";
            };
            simple: {
                type: BooleanConstructor;
                default: boolean;
            };
            locale: ObjectConstructor;
            prefixCls: StringConstructor;
            selectPrefixCls: StringConstructor;
            totalBoundaryShowSizeChanger: NumberConstructor;
            selectComponentClass: StringConstructor;
            itemRender: {
                type: PropType<(opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any>;
                default: (opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any;
            };
            role: StringConstructor;
            responsive: BooleanConstructor;
            showLessItems: {
                type: BooleanConstructor;
                default: boolean;
            };
            onChange: {
                type: PropType<(page: number, pageSize: number) => void>;
                default: (page: number, pageSize: number) => void;
            };
            onShowSizeChange: {
                type: PropType<(current: number, size: number) => void>;
                default: (current: number, size: number) => void;
            };
            'onUpdate:current': {
                type: PropType<(current: number) => void>;
                default: (current: number) => void;
            };
            'onUpdate:pageSize': {
                type: PropType<(size: number) => void>;
                default: (size: number) => void;
            };
        }>>;
        dataSource: any[];
        rowKey: Key | ((item: any) => Key);
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dataSource: {
        type: PropType<any[]>;
        default: any[];
    };
    extra: {
        type: PropType<import("../_util/type").VueNode>;
    };
    grid: {
        type: PropType<ListGridType>;
        default: ListGridType;
    };
    itemLayout: PropType<ListItemLayout>;
    loading: {
        type: PropType<boolean | (Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>> & HTMLAttributes)>;
        default: boolean | (Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>> & HTMLAttributes);
    };
    loadMore: {
        type: PropType<import("../_util/type").VueNode>;
    };
    pagination: {
        type: PropType<false | Partial<ExtractPropTypes<{
            position: {
                type: PropType<import("../pagination/Pagination").PaginationPosition>;
                default: import("../pagination/Pagination").PaginationPosition;
            };
            total: NumberConstructor;
            defaultCurrent: NumberConstructor;
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            current: NumberConstructor;
            defaultPageSize: NumberConstructor;
            pageSize: NumberConstructor;
            hideOnSinglePage: {
                type: BooleanConstructor;
                default: boolean;
            };
            showSizeChanger: {
                type: BooleanConstructor;
                default: boolean;
            };
            pageSizeOptions: {
                type: PropType<(string | number)[]>;
                default: (string | number)[];
            };
            buildOptionText: {
                type: PropType<(opt: {
                    value: any;
                }) => any>;
                default: (opt: {
                    value: any;
                }) => any;
            };
            showQuickJumper: {
                type: PropType<boolean | {
                    goButton?: any;
                }>;
                default: boolean | {
                    goButton?: any;
                };
            };
            showTotal: {
                type: PropType<(total: number, range: [number, number]) => any>;
                default: (total: number, range: [number, number]) => any;
            };
            size: {
                type: PropType<"default" | "small">;
                default: "default" | "small";
            };
            simple: {
                type: BooleanConstructor;
                default: boolean;
            };
            locale: ObjectConstructor;
            prefixCls: StringConstructor;
            selectPrefixCls: StringConstructor;
            totalBoundaryShowSizeChanger: NumberConstructor;
            selectComponentClass: StringConstructor;
            itemRender: {
                type: PropType<(opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any>;
                default: (opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any;
            };
            role: StringConstructor;
            responsive: BooleanConstructor;
            showLessItems: {
                type: BooleanConstructor;
                default: boolean;
            };
            onChange: {
                type: PropType<(page: number, pageSize: number) => void>;
                default: (page: number, pageSize: number) => void;
            };
            onShowSizeChange: {
                type: PropType<(current: number, size: number) => void>;
                default: (current: number, size: number) => void;
            };
            'onUpdate:current': {
                type: PropType<(current: number) => void>;
                default: (current: number) => void;
            };
            'onUpdate:pageSize': {
                type: PropType<(size: number) => void>;
                default: (size: number) => void;
            };
        }>>>;
        default: false | Partial<ExtractPropTypes<{
            position: {
                type: PropType<import("../pagination/Pagination").PaginationPosition>;
                default: import("../pagination/Pagination").PaginationPosition;
            };
            total: NumberConstructor;
            defaultCurrent: NumberConstructor;
            disabled: {
                type: BooleanConstructor;
                default: boolean;
            };
            current: NumberConstructor;
            defaultPageSize: NumberConstructor;
            pageSize: NumberConstructor;
            hideOnSinglePage: {
                type: BooleanConstructor;
                default: boolean;
            };
            showSizeChanger: {
                type: BooleanConstructor;
                default: boolean;
            };
            pageSizeOptions: {
                type: PropType<(string | number)[]>;
                default: (string | number)[];
            };
            buildOptionText: {
                type: PropType<(opt: {
                    value: any;
                }) => any>;
                default: (opt: {
                    value: any;
                }) => any;
            };
            showQuickJumper: {
                type: PropType<boolean | {
                    goButton?: any;
                }>;
                default: boolean | {
                    goButton?: any;
                };
            };
            showTotal: {
                type: PropType<(total: number, range: [number, number]) => any>;
                default: (total: number, range: [number, number]) => any;
            };
            size: {
                type: PropType<"default" | "small">;
                default: "default" | "small";
            };
            simple: {
                type: BooleanConstructor;
                default: boolean;
            };
            locale: ObjectConstructor;
            prefixCls: StringConstructor;
            selectPrefixCls: StringConstructor;
            totalBoundaryShowSizeChanger: NumberConstructor;
            selectComponentClass: StringConstructor;
            itemRender: {
                type: PropType<(opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any>;
                default: (opt: {
                    page: number;
                    type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                    originalElement: any;
                }) => any;
            };
            role: StringConstructor;
            responsive: BooleanConstructor;
            showLessItems: {
                type: BooleanConstructor;
                default: boolean;
            };
            onChange: {
                type: PropType<(page: number, pageSize: number) => void>;
                default: (page: number, pageSize: number) => void;
            };
            onShowSizeChange: {
                type: PropType<(current: number, size: number) => void>;
                default: (current: number, size: number) => void;
            };
            'onUpdate:current': {
                type: PropType<(current: number) => void>;
                default: (current: number) => void;
            };
            'onUpdate:pageSize': {
                type: PropType<(size: number) => void>;
                default: (size: number) => void;
            };
        }>>;
    };
    prefixCls: StringConstructor;
    rowKey: {
        type: PropType<Key | ((item: any) => Key)>;
        default: Key | ((item: any) => Key);
    };
    renderItem: {
        type: PropType<(opt: {
            item: any;
            index: number;
        }) => any>;
        default: (opt: {
            item: any;
            index: number;
        }) => any;
    };
    size: PropType<ListSize>;
    split: {
        type: BooleanConstructor;
        default: boolean;
    };
    header: {
        type: PropType<import("../_util/type").VueNode>;
    };
    footer: {
        type: PropType<import("../_util/type").VueNode>;
    };
    locale: {
        type: PropType<ListLocale>;
        default: ListLocale;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    grid: ListGridType;
    split: boolean;
    locale: ListLocale;
    renderItem: (opt: {
        item: any;
        index: number;
    }) => any;
    loading: boolean | (Partial<ExtractPropTypes<{
        prefixCls: StringConstructor;
        spinning: {
            type: BooleanConstructor;
            default: any;
        };
        size: PropType<import("../spin/Spin").SpinSize>;
        wrapperClassName: StringConstructor;
        tip: import("vue-types").VueTypeValidableDef<any>;
        delay: NumberConstructor;
        indicator: import("vue-types").VueTypeValidableDef<any>;
    }>> & HTMLAttributes);
    bordered: boolean;
    pagination: false | Partial<ExtractPropTypes<{
        position: {
            type: PropType<import("../pagination/Pagination").PaginationPosition>;
            default: import("../pagination/Pagination").PaginationPosition;
        };
        total: NumberConstructor;
        defaultCurrent: NumberConstructor;
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        current: NumberConstructor;
        defaultPageSize: NumberConstructor;
        pageSize: NumberConstructor;
        hideOnSinglePage: {
            type: BooleanConstructor;
            default: boolean;
        };
        showSizeChanger: {
            type: BooleanConstructor;
            default: boolean;
        };
        pageSizeOptions: {
            type: PropType<(string | number)[]>;
            default: (string | number)[];
        };
        buildOptionText: {
            type: PropType<(opt: {
                value: any;
            }) => any>;
            default: (opt: {
                value: any;
            }) => any;
        };
        showQuickJumper: {
            type: PropType<boolean | {
                goButton?: any;
            }>;
            default: boolean | {
                goButton?: any;
            };
        };
        showTotal: {
            type: PropType<(total: number, range: [number, number]) => any>;
            default: (total: number, range: [number, number]) => any;
        };
        size: {
            type: PropType<"default" | "small">;
            default: "default" | "small";
        };
        simple: {
            type: BooleanConstructor;
            default: boolean;
        };
        locale: ObjectConstructor;
        prefixCls: StringConstructor;
        selectPrefixCls: StringConstructor;
        totalBoundaryShowSizeChanger: NumberConstructor;
        selectComponentClass: StringConstructor;
        itemRender: {
            type: PropType<(opt: {
                page: number;
                type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                originalElement: any;
            }) => any>;
            default: (opt: {
                page: number;
                type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
                originalElement: any;
            }) => any;
        };
        role: StringConstructor;
        responsive: BooleanConstructor;
        showLessItems: {
            type: BooleanConstructor;
            default: boolean;
        };
        onChange: {
            type: PropType<(page: number, pageSize: number) => void>;
            default: (page: number, pageSize: number) => void;
        };
        onShowSizeChange: {
            type: PropType<(current: number, size: number) => void>;
            default: (current: number, size: number) => void;
        };
        'onUpdate:current': {
            type: PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        'onUpdate:pageSize': {
            type: PropType<(size: number) => void>;
            default: (size: number) => void;
        };
    }>>;
    dataSource: any[];
    rowKey: Key | ((item: any) => Key);
}, {}, string, CustomSlotsType<{
    extra: any;
    loadMore: any;
    renderItem: {
        item: any;
        index: number;
    };
    header: any;
    footer: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Item: typeof Item & {
        readonly Meta: typeof ItemMeta;
    };
};
export default _default;
