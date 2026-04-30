export { paginationProps, paginationConfig } from './Pagination';
export type { PaginationProps, PaginationConfig } from './Pagination';
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<(string | number)[]>;
            default: (string | number)[];
        };
        buildOptionText: {
            type: import("vue").PropType<(opt: {
                value: any;
            }) => any>;
            default: (opt: {
                value: any;
            }) => any;
        };
        showQuickJumper: {
            type: import("vue").PropType<boolean | {
                goButton?: any;
            }>;
            default: boolean | {
                goButton?: any;
            };
        };
        showTotal: {
            type: import("vue").PropType<(total: number, range: [number, number]) => any>;
            default: (total: number, range: [number, number]) => any;
        };
        size: {
            type: import("vue").PropType<"default" | "small">;
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
            type: import("vue").PropType<(opt: {
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
            type: import("vue").PropType<(page: number, pageSize: number) => void>;
            default: (page: number, pageSize: number) => void;
        };
        onShowSizeChange: {
            type: import("vue").PropType<(current: number, size: number) => void>;
            default: (current: number, size: number) => void;
        };
        'onUpdate:current': {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        'onUpdate:pageSize': {
            type: import("vue").PropType<(size: number) => void>;
            default: (size: number) => void;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: "default" | "small";
        onChange: (page: number, pageSize: number) => void;
        responsive: boolean;
        disabled: boolean;
        itemRender: (opt: {
            page: number;
            type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
            originalElement: any;
        }) => any;
        buildOptionText: (opt: {
            value: any;
        }) => any;
        pageSizeOptions: (string | number)[];
        showTotal: (total: number, range: [number, number]) => any;
        hideOnSinglePage: boolean;
        showSizeChanger: boolean;
        showLessItems: boolean;
        showQuickJumper: boolean | {
            goButton?: any;
        };
        simple: boolean;
        onShowSizeChange: (current: number, size: number) => void;
        'onUpdate:current': (current: number) => void;
        'onUpdate:pageSize': (size: number) => void;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<(string | number)[]>;
            default: (string | number)[];
        };
        buildOptionText: {
            type: import("vue").PropType<(opt: {
                value: any;
            }) => any>;
            default: (opt: {
                value: any;
            }) => any;
        };
        showQuickJumper: {
            type: import("vue").PropType<boolean | {
                goButton?: any;
            }>;
            default: boolean | {
                goButton?: any;
            };
        };
        showTotal: {
            type: import("vue").PropType<(total: number, range: [number, number]) => any>;
            default: (total: number, range: [number, number]) => any;
        };
        size: {
            type: import("vue").PropType<"default" | "small">;
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
            type: import("vue").PropType<(opt: {
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
            type: import("vue").PropType<(page: number, pageSize: number) => void>;
            default: (page: number, pageSize: number) => void;
        };
        onShowSizeChange: {
            type: import("vue").PropType<(current: number, size: number) => void>;
            default: (current: number, size: number) => void;
        };
        'onUpdate:current': {
            type: import("vue").PropType<(current: number) => void>;
            default: (current: number) => void;
        };
        'onUpdate:pageSize': {
            type: import("vue").PropType<(size: number) => void>;
            default: (size: number) => void;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: "default" | "small";
        onChange: (page: number, pageSize: number) => void;
        responsive: boolean;
        disabled: boolean;
        itemRender: (opt: {
            page: number;
            type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
            originalElement: any;
        }) => any;
        buildOptionText: (opt: {
            value: any;
        }) => any;
        pageSizeOptions: (string | number)[];
        showTotal: (total: number, range: [number, number]) => any;
        hideOnSinglePage: boolean;
        showSizeChanger: boolean;
        showLessItems: boolean;
        showQuickJumper: boolean | {
            goButton?: any;
        };
        simple: boolean;
        onShowSizeChange: (current: number, size: number) => void;
        'onUpdate:current': (current: number) => void;
        'onUpdate:pageSize': (size: number) => void;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<(string | number)[]>;
        default: (string | number)[];
    };
    buildOptionText: {
        type: import("vue").PropType<(opt: {
            value: any;
        }) => any>;
        default: (opt: {
            value: any;
        }) => any;
    };
    showQuickJumper: {
        type: import("vue").PropType<boolean | {
            goButton?: any;
        }>;
        default: boolean | {
            goButton?: any;
        };
    };
    showTotal: {
        type: import("vue").PropType<(total: number, range: [number, number]) => any>;
        default: (total: number, range: [number, number]) => any;
    };
    size: {
        type: import("vue").PropType<"default" | "small">;
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
        type: import("vue").PropType<(opt: {
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
        type: import("vue").PropType<(page: number, pageSize: number) => void>;
        default: (page: number, pageSize: number) => void;
    };
    onShowSizeChange: {
        type: import("vue").PropType<(current: number, size: number) => void>;
        default: (current: number, size: number) => void;
    };
    'onUpdate:current': {
        type: import("vue").PropType<(current: number) => void>;
        default: (current: number) => void;
    };
    'onUpdate:pageSize': {
        type: import("vue").PropType<(size: number) => void>;
        default: (size: number) => void;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: "default" | "small";
    onChange: (page: number, pageSize: number) => void;
    responsive: boolean;
    disabled: boolean;
    itemRender: (opt: {
        page: number;
        type: "next" | "page" | "prev" | "jump-prev" | "jump-next";
        originalElement: any;
    }) => any;
    buildOptionText: (opt: {
        value: any;
    }) => any;
    pageSizeOptions: (string | number)[];
    showTotal: (total: number, range: [number, number]) => any;
    hideOnSinglePage: boolean;
    showSizeChanger: boolean;
    showLessItems: boolean;
    showQuickJumper: boolean | {
        goButton?: any;
    };
    simple: boolean;
    onShowSizeChange: (current: number, size: number) => void;
    'onUpdate:current': (current: number) => void;
    'onUpdate:pageSize': (size: number) => void;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
