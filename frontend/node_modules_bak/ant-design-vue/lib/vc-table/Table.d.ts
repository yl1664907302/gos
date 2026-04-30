import type { GetRowKey, ColumnsType, TableComponents, Key, GetComponentProps, PanelRender, TableLayout, RowClassName, ColumnType, TableSticky, ExpandedRowRender, RenderExpandIcon, TransformCellText, DefaultRecordType } from './interface';
export declare const INTERNAL_HOOKS = "rc-table-internal-hook";
export interface TableProps<RecordType = DefaultRecordType> {
    prefixCls?: string;
    data?: RecordType[];
    columns?: ColumnsType<RecordType>;
    rowKey?: string | GetRowKey<RecordType>;
    tableLayout?: TableLayout;
    scroll?: {
        x?: number | true | string;
        y?: number | string;
    };
    rowClassName?: string | RowClassName<RecordType>;
    title?: PanelRender<RecordType>;
    footer?: PanelRender<RecordType>;
    id?: string;
    showHeader?: boolean;
    components?: TableComponents<RecordType>;
    customRow?: GetComponentProps<RecordType>;
    customHeaderRow?: GetComponentProps<ColumnType<RecordType>[]>;
    direction?: 'ltr' | 'rtl';
    expandFixed?: 'left' | 'right' | boolean;
    expandColumnWidth?: number;
    expandedRowKeys?: Key[];
    defaultExpandedRowKeys?: Key[];
    expandedRowRender?: ExpandedRowRender<RecordType>;
    expandRowByClick?: boolean;
    expandIcon?: RenderExpandIcon<RecordType>;
    onExpand?: (expanded: boolean, record: RecordType) => void;
    onExpandedRowsChange?: (expandedKeys: Key[]) => void;
    defaultExpandAllRows?: boolean;
    indentSize?: number;
    expandIconColumnIndex?: number;
    showExpandColumn?: boolean;
    expandedRowClassName?: RowClassName<RecordType>;
    childrenColumnName?: string;
    rowExpandable?: (record: RecordType) => boolean;
    /**
     * @private Internal usage, may remove by refactor. Should always use `columns` instead.
     *
     * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
     */
    internalHooks?: string;
    /**
     * @private Internal usage, may remove by refactor. Should always use `columns` instead.
     *
     * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
     */
    transformColumns?: (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>;
    /**
     * @private Internal usage, may remove by refactor.
     *
     * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
     */
    internalRefs?: {
        body: HTMLDivElement;
    };
    sticky?: boolean | TableSticky;
    canExpandable?: boolean;
    onUpdateInternalRefs?: (refs: Record<string, any>) => void;
    transformCellText?: TransformCellText<RecordType>;
}
declare const _default: import("vue").DefineComponent<{
    scroll?: any;
    data?: any;
    footer?: any;
    title?: any;
    components?: any;
    direction?: any;
    tableLayout?: any;
    columns?: any;
    sticky?: any;
    prefixCls?: any;
    id?: any;
    rowClassName?: any;
    expandIcon?: any;
    onExpand?: any;
    rowKey?: any;
    expandedRowKeys?: any;
    defaultExpandedRowKeys?: any;
    expandedRowRender?: any;
    expandRowByClick?: any;
    onExpandedRowsChange?: any;
    defaultExpandAllRows?: any;
    indentSize?: any;
    expandIconColumnIndex?: any;
    expandedRowClassName?: any;
    childrenColumnName?: any;
    rowExpandable?: any;
    transformCellText?: any;
    customHeaderRow?: any;
    customRow?: any;
    expandColumnWidth?: any;
    expandFixed?: any;
    showHeader?: any;
    "onUpdate:expandedRowKeys"?: any;
    transformColumns?: any;
    internalHooks?: any;
    internalRefs?: any;
    canExpandable?: any;
    onUpdateInternalRefs?: any;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("expand" | "expandedRowsChange" | "updateInternalRefs" | "update:expandedRowKeys")[], "expand" | "expandedRowsChange" | "updateInternalRefs" | "update:expandedRowKeys", import("vue").PublicProps, Readonly<{
    scroll?: any;
    data?: any;
    footer?: any;
    title?: any;
    components?: any;
    direction?: any;
    tableLayout?: any;
    columns?: any;
    sticky?: any;
    prefixCls?: any;
    id?: any;
    rowClassName?: any;
    expandIcon?: any;
    onExpand?: any;
    rowKey?: any;
    expandedRowKeys?: any;
    defaultExpandedRowKeys?: any;
    expandedRowRender?: any;
    expandRowByClick?: any;
    onExpandedRowsChange?: any;
    defaultExpandAllRows?: any;
    indentSize?: any;
    expandIconColumnIndex?: any;
    expandedRowClassName?: any;
    childrenColumnName?: any;
    rowExpandable?: any;
    transformCellText?: any;
    customHeaderRow?: any;
    customRow?: any;
    expandColumnWidth?: any;
    expandFixed?: any;
    showHeader?: any;
    "onUpdate:expandedRowKeys"?: any;
    transformColumns?: any;
    internalHooks?: any;
    internalRefs?: any;
    canExpandable?: any;
    onUpdateInternalRefs?: any;
}> & Readonly<{
    onExpand?: (...args: any[]) => any;
    onExpandedRowsChange?: (...args: any[]) => any;
    "onUpdate:expandedRowKeys"?: (...args: any[]) => any;
    onUpdateInternalRefs?: (...args: any[]) => any;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
