declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    selectPrefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    current: NumberConstructor;
    defaultCurrent: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    total: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    pageSize: NumberConstructor;
    defaultPageSize: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    hideOnSinglePage: {
        type: BooleanConstructor;
        default: boolean;
    };
    showSizeChanger: {
        type: BooleanConstructor;
        default: any;
    };
    showLessItems: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectComponentClass: import("vue-types").VueTypeValidableDef<any>;
    showPrevNextJumpers: {
        type: BooleanConstructor;
        default: boolean;
    };
    showQuickJumper: import("vue-types").VueTypeDef<boolean | {
        [key: string]: any;
    }> & {
        default: boolean | (() => {
            [key: string]: any;
        });
    };
    showTitle: {
        type: BooleanConstructor;
        default: boolean;
    };
    pageSizeOptions: import("vue-types").VueTypeDef<(string | number)[]>;
    buildOptionText: FunctionConstructor;
    showTotal: FunctionConstructor;
    simple: {
        type: BooleanConstructor;
        default: any;
    };
    locale: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    } & {
        default: () => {
            [key: string]: any;
        };
    };
    itemRender: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    prevIcon: import("vue-types").VueTypeValidableDef<any>;
    nextIcon: import("vue-types").VueTypeValidableDef<any>;
    jumpPrevIcon: import("vue-types").VueTypeValidableDef<any>;
    jumpNextIcon: import("vue-types").VueTypeValidableDef<any>;
    totalBoundaryShowSizeChanger: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
}>, {}, {
    stateCurrent: number;
    stateCurrentInputValue: number;
    statePageSize: number;
}, {}, {
    getJumpPrevPage(): number;
    getJumpNextPage(): number;
    getItemIcon(icon: any, label: any): any;
    getValidValue(e: any): any;
    isValid(page: any): boolean;
    shouldDisplayQuickJumper(): any;
    handleKeyDown(event: any): void;
    handleKeyUp(e: any): void;
    changePageSize(size: any): void;
    handleChange(p: any): any;
    prev(): void;
    next(): void;
    jumpPrev(): void;
    jumpNext(): void;
    hasPrev(): boolean;
    hasNext(): boolean;
    getShowSizeChanger(): any;
    runIfEnter(event: any, callback: any, ...restParams: any[]): void;
    runIfEnterPrev(event: any): void;
    runIfEnterNext(event: any): void;
    runIfEnterJumpPrev(event: any): void;
    runIfEnterJumpNext(event: any): void;
    handleGoTO(event: any): void;
    renderPrev(prevPage: any): any;
    renderNext(nextPage: any): any;
}, {
    methods: {
        setState(state: {}, callback: () => any): void;
        __emit(): void;
    };
}, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    selectPrefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    current: NumberConstructor;
    defaultCurrent: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    total: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    pageSize: NumberConstructor;
    defaultPageSize: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    hideOnSinglePage: {
        type: BooleanConstructor;
        default: boolean;
    };
    showSizeChanger: {
        type: BooleanConstructor;
        default: any;
    };
    showLessItems: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectComponentClass: import("vue-types").VueTypeValidableDef<any>;
    showPrevNextJumpers: {
        type: BooleanConstructor;
        default: boolean;
    };
    showQuickJumper: import("vue-types").VueTypeDef<boolean | {
        [key: string]: any;
    }> & {
        default: boolean | (() => {
            [key: string]: any;
        });
    };
    showTitle: {
        type: BooleanConstructor;
        default: boolean;
    };
    pageSizeOptions: import("vue-types").VueTypeDef<(string | number)[]>;
    buildOptionText: FunctionConstructor;
    showTotal: FunctionConstructor;
    simple: {
        type: BooleanConstructor;
        default: any;
    };
    locale: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    } & {
        default: () => {
            [key: string]: any;
        };
    };
    itemRender: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    prevIcon: import("vue-types").VueTypeValidableDef<any>;
    nextIcon: import("vue-types").VueTypeValidableDef<any>;
    jumpPrevIcon: import("vue-types").VueTypeValidableDef<any>;
    jumpNextIcon: import("vue-types").VueTypeValidableDef<any>;
    totalBoundaryShowSizeChanger: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
}>> & Readonly<{}>, {
    disabled: boolean;
    prefixCls: string;
    locale: {
        [key: string]: any;
    };
    showTitle: boolean;
    itemRender: (...args: any[]) => any;
    selectPrefixCls: string;
    defaultCurrent: number;
    total: number;
    defaultPageSize: number;
    hideOnSinglePage: boolean;
    showSizeChanger: boolean;
    showLessItems: boolean;
    showPrevNextJumpers: boolean;
    showQuickJumper: boolean | {
        [key: string]: any;
    };
    simple: boolean;
    totalBoundaryShowSizeChanger: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
