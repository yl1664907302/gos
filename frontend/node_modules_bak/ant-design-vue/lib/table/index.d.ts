import { tableProps } from './Table';
import Column from './Column';
import ColumnGroup from './ColumnGroup';
import type { TableProps, TablePaginationConfig } from './Table';
import type { App } from 'vue';
export type { ColumnProps } from './Column';
export type { ColumnsType, ColumnType, ColumnGroupType } from './interface';
export type { TableProps, TablePaginationConfig };
declare const TableSummaryRow: import("vue").DefineComponent<{}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const TableSummaryCell: import("vue").DefineComponent<{
    index?: any;
    align?: any;
    colSpan?: any;
    rowSpan?: any;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    index?: any;
    align?: any;
    colSpan?: any;
    rowSpan?: any;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const TableSummary: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("../vc-table/Footer/Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("../vc-table/Footer/Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("../vc-table/Footer/Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Cell: import("vue").DefineComponent<{
        index?: any;
        align?: any;
        colSpan?: any;
        rowSpan?: any;
    }, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
        index?: any;
        align?: any;
        colSpan?: any;
        rowSpan?: any;
    }> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Row: import("vue").DefineComponent<{}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    name: string;
};
export { tableProps, TableSummary, TableSummaryRow, TableSummaryCell, Column as TableColumn, ColumnGroup as TableColumnGroup, };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: import("vue").PropType<string>;
            default: string;
        };
        columns: {
            type: import("vue").PropType<import("./interface").ColumnsType<any>>;
            default: import("./interface").ColumnsType<any>;
        };
        rowKey: {
            type: import("vue").PropType<string | import("./interface").GetRowKey<any>>;
            default: string | import("./interface").GetRowKey<any>;
        };
        tableLayout: {
            type: import("vue").PropType<import("../vc-table/interface").TableLayout>;
            default: import("../vc-table/interface").TableLayout;
        };
        rowClassName: {
            type: import("vue").PropType<string | import("../vc-table/interface").RowClassName<any>>;
            default: string | import("../vc-table/interface").RowClassName<any>;
        };
        title: {
            type: import("vue").PropType<import("../vc-table/interface").PanelRender<any>>;
            default: import("../vc-table/interface").PanelRender<any>;
        };
        footer: {
            type: import("vue").PropType<import("../vc-table/interface").PanelRender<any>>;
            default: import("../vc-table/interface").PanelRender<any>;
        };
        id: {
            type: import("vue").PropType<string>;
            default: string;
        };
        showHeader: {
            type: BooleanConstructor;
            default: boolean;
        };
        components: {
            type: import("vue").PropType<import("../vc-table/interface").TableComponents<any>>;
            default: import("../vc-table/interface").TableComponents<any>;
        };
        customRow: {
            type: import("vue").PropType<import("../vc-table/interface").GetComponentProps<any>>;
            default: import("../vc-table/interface").GetComponentProps<any>;
        };
        customHeaderRow: {
            type: import("vue").PropType<import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>>;
            default: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
        };
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
            default: "rtl" | "ltr";
        };
        expandFixed: {
            type: import("vue").PropType<boolean | "left" | "right">;
            default: boolean | "left" | "right";
        };
        expandColumnWidth: NumberConstructor;
        expandedRowKeys: {
            type: import("vue").PropType<import("../vc-table/interface").Key[]>;
            default: import("../vc-table/interface").Key[];
        };
        defaultExpandedRowKeys: {
            type: import("vue").PropType<import("../vc-table/interface").Key[]>;
            default: import("../vc-table/interface").Key[];
        };
        expandedRowRender: {
            type: import("vue").PropType<import("../vc-table/interface").ExpandedRowRender<any>>;
            default: import("../vc-table/interface").ExpandedRowRender<any>;
        };
        expandRowByClick: {
            type: BooleanConstructor;
            default: boolean;
        };
        expandIcon: {
            type: import("vue").PropType<import("../vc-table/interface").RenderExpandIcon<any>>;
            default: import("../vc-table/interface").RenderExpandIcon<any>;
        };
        onExpand: {
            type: import("vue").PropType<(expanded: boolean, record: any) => void>;
            default: (expanded: boolean, record: any) => void;
        };
        onExpandedRowsChange: {
            type: import("vue").PropType<(expandedKeys: import("../vc-table/interface").Key[]) => void>;
            default: (expandedKeys: import("../vc-table/interface").Key[]) => void;
        };
        'onUpdate:expandedRowKeys': {
            type: import("vue").PropType<(expandedKeys: import("../vc-table/interface").Key[]) => void>;
            default: (expandedKeys: import("../vc-table/interface").Key[]) => void;
        };
        defaultExpandAllRows: {
            type: BooleanConstructor;
            default: boolean;
        };
        indentSize: NumberConstructor;
        expandIconColumnIndex: NumberConstructor;
        showExpandColumn: {
            type: BooleanConstructor;
            default: boolean;
        };
        expandedRowClassName: {
            type: import("vue").PropType<import("../vc-table/interface").RowClassName<any>>;
            default: import("../vc-table/interface").RowClassName<any>;
        };
        childrenColumnName: {
            type: import("vue").PropType<string>;
            default: string;
        };
        rowExpandable: {
            type: import("vue").PropType<(record: any) => boolean>;
            default: (record: any) => boolean;
        };
        sticky: {
            type: import("vue").PropType<boolean | import("../vc-table/interface").TableSticky>;
            default: boolean | import("../vc-table/interface").TableSticky;
        };
        dropdownPrefixCls: StringConstructor;
        dataSource: {
            type: import("vue").PropType<any[]>;
            default: any[];
        };
        pagination: {
            type: import("vue").PropType<false | TablePaginationConfig>;
            default: false | TablePaginationConfig;
        };
        loading: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: import("vue").PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: import("vue").PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>>;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        locale: {
            type: import("vue").PropType<import("./interface").TableLocale>;
            default: import("./interface").TableLocale;
        };
        onChange: {
            type: import("vue").PropType<(pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void>;
            default: (pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void;
        };
        onResizeColumn: {
            type: import("vue").PropType<(w: number, col: import("./interface").ColumnType<any>) => void>;
            default: (w: number, col: import("./interface").ColumnType<any>) => void;
        };
        rowSelection: {
            type: import("vue").PropType<import("./interface").TableRowSelection<any>>;
            default: import("./interface").TableRowSelection<any>;
        };
        getPopupContainer: {
            type: import("vue").PropType<import("./interface").GetPopupContainer>;
            default: import("./interface").GetPopupContainer;
        };
        scroll: {
            type: import("vue").PropType<{
                x?: string | number | true;
                y?: string | number;
            } & {
                scrollToFirstRowOnChange?: boolean;
            }>;
            default: {
                x?: string | number | true;
                y?: string | number;
            } & {
                scrollToFirstRowOnChange?: boolean;
            };
        };
        sortDirections: {
            type: import("vue").PropType<import("./interface").SortOrder[]>;
            default: import("./interface").SortOrder[];
        };
        showSorterTooltip: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                title: import("vue-types").VueTypeValidableDef<any>;
                trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
                open: {
                    type: BooleanConstructor;
                    default: any;
                };
                visible: {
                    type: BooleanConstructor;
                    default: any;
                };
                placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
                color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
                transitionName: StringConstructor;
                overlayStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayInnerStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayClassName: StringConstructor;
                openClassName: StringConstructor;
                prefixCls: StringConstructor;
                mouseEnterDelay: NumberConstructor;
                mouseLeaveDelay: NumberConstructor;
                getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
                arrowPointAtCenter: {
                    type: BooleanConstructor;
                    default: any;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter?: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter?: boolean;
                    };
                };
                autoAdjustOverflow: {
                    type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                    default: boolean | import("../tooltip").AdjustOverflow;
                };
                destroyTooltipOnHide: {
                    type: BooleanConstructor;
                    default: any;
                };
                align: {
                    type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                    default: import("../vc-trigger/interface").AlignType;
                };
                builtinPlacements: {
                    type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                    default: import("../vc-trigger/interface").BuildInPlacements;
                };
                children: ArrayConstructor;
                onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
                onOpenChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                title: import("vue-types").VueTypeValidableDef<any>;
                trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
                open: {
                    type: BooleanConstructor;
                    default: any;
                };
                visible: {
                    type: BooleanConstructor;
                    default: any;
                };
                placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
                color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
                transitionName: StringConstructor;
                overlayStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayInnerStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayClassName: StringConstructor;
                openClassName: StringConstructor;
                prefixCls: StringConstructor;
                mouseEnterDelay: NumberConstructor;
                mouseLeaveDelay: NumberConstructor;
                getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
                arrowPointAtCenter: {
                    type: BooleanConstructor;
                    default: any;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter?: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter?: boolean;
                    };
                };
                autoAdjustOverflow: {
                    type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                    default: boolean | import("../tooltip").AdjustOverflow;
                };
                destroyTooltipOnHide: {
                    type: BooleanConstructor;
                    default: any;
                };
                align: {
                    type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                    default: import("../vc-trigger/interface").AlignType;
                };
                builtinPlacements: {
                    type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                    default: import("../vc-trigger/interface").BuildInPlacements;
                };
                children: ArrayConstructor;
                onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
                onOpenChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
            }>>;
        };
        transformCellText: {
            type: import("vue").PropType<import("../vc-table/interface").TransformCellText<any>>;
            default: import("../vc-table/interface").TransformCellText<any>;
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        scroll: {
            x?: string | number | true;
            y?: string | number;
        } & {
            scrollToFirstRowOnChange?: boolean;
        };
        size: import("../config-provider").SizeType;
        footer: import("../vc-table/interface").PanelRender<any>;
        title: import("../vc-table/interface").PanelRender<any>;
        onChange: (pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void;
        components: import("../vc-table/interface").TableComponents<any>;
        direction: "rtl" | "ltr";
        tableLayout: import("../vc-table/interface").TableLayout;
        columns: import("./interface").ColumnsType<any>;
        sticky: boolean | import("../vc-table/interface").TableSticky;
        prefixCls: string;
        id: string;
        getPopupContainer: import("./interface").GetPopupContainer;
        rowClassName: string | import("../vc-table/interface").RowClassName<any>;
        locale: import("./interface").TableLocale;
        expandIcon: import("../vc-table/interface").RenderExpandIcon<any>;
        loading: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: import("vue").PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>>;
        bordered: boolean;
        onExpand: (expanded: boolean, record: any) => void;
        pagination: false | TablePaginationConfig;
        dataSource: any[];
        rowKey: string | import("./interface").GetRowKey<any>;
        expandedRowKeys: import("../vc-table/interface").Key[];
        defaultExpandedRowKeys: import("../vc-table/interface").Key[];
        expandedRowRender: import("../vc-table/interface").ExpandedRowRender<any>;
        expandRowByClick: boolean;
        onExpandedRowsChange: (expandedKeys: import("../vc-table/interface").Key[]) => void;
        defaultExpandAllRows: boolean;
        showExpandColumn: boolean;
        expandedRowClassName: import("../vc-table/interface").RowClassName<any>;
        childrenColumnName: string;
        rowExpandable: (record: any) => boolean;
        transformCellText: import("../vc-table/interface").TransformCellText<any>;
        onResizeColumn: (w: number, col: import("./interface").ColumnType<any>) => void;
        customHeaderRow: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
        customRow: import("../vc-table/interface").GetComponentProps<any>;
        expandFixed: boolean | "left" | "right";
        showHeader: boolean;
        'onUpdate:expandedRowKeys': (expandedKeys: import("../vc-table/interface").Key[]) => void;
        sortDirections: import("./interface").SortOrder[];
        showSorterTooltip: boolean | Partial<import("vue").ExtractPropTypes<{
            title: import("vue-types").VueTypeValidableDef<any>;
            trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
            open: {
                type: BooleanConstructor;
                default: any;
            };
            visible: {
                type: BooleanConstructor;
                default: any;
            };
            placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
            color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
            transitionName: StringConstructor;
            overlayStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayClassName: StringConstructor;
            openClassName: StringConstructor;
            prefixCls: StringConstructor;
            mouseEnterDelay: NumberConstructor;
            mouseLeaveDelay: NumberConstructor;
            getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
            arrowPointAtCenter: {
                type: BooleanConstructor;
                default: any;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter?: boolean;
                }>;
                default: boolean | {
                    pointAtCenter?: boolean;
                };
            };
            autoAdjustOverflow: {
                type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                default: boolean | import("../tooltip").AdjustOverflow;
            };
            destroyTooltipOnHide: {
                type: BooleanConstructor;
                default: any;
            };
            align: {
                type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                default: import("../vc-trigger/interface").AlignType;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                default: import("../vc-trigger/interface").BuildInPlacements;
            };
            children: ArrayConstructor;
            onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
            onOpenChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
        }>>;
        rowSelection: import("./interface").TableRowSelection<any>;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        emptyText?: any;
        expandIcon?: import("../vc-table/interface").RenderExpandIconProps<any>;
        title?: any;
        footer?: any;
        summary?: any;
        expandedRowRender?: any;
        expandColumnTitle?: any;
        bodyCell?: (props: {
            text: any;
            value: any;
            record: Record<string, any>;
            index: number;
            column: import("./interface").ColumnType<any>;
        }) => void;
        headerCell?: (props: {
            title: any;
            column: import("./interface").ColumnType<any>;
        }) => void;
        customFilterIcon?: any;
        customFilterDropdown?: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: {
            type: import("vue").PropType<string>;
            default: string;
        };
        columns: {
            type: import("vue").PropType<import("./interface").ColumnsType<any>>;
            default: import("./interface").ColumnsType<any>;
        };
        rowKey: {
            type: import("vue").PropType<string | import("./interface").GetRowKey<any>>;
            default: string | import("./interface").GetRowKey<any>;
        };
        tableLayout: {
            type: import("vue").PropType<import("../vc-table/interface").TableLayout>;
            default: import("../vc-table/interface").TableLayout;
        };
        rowClassName: {
            type: import("vue").PropType<string | import("../vc-table/interface").RowClassName<any>>;
            default: string | import("../vc-table/interface").RowClassName<any>;
        };
        title: {
            type: import("vue").PropType<import("../vc-table/interface").PanelRender<any>>;
            default: import("../vc-table/interface").PanelRender<any>;
        };
        footer: {
            type: import("vue").PropType<import("../vc-table/interface").PanelRender<any>>;
            default: import("../vc-table/interface").PanelRender<any>;
        };
        id: {
            type: import("vue").PropType<string>;
            default: string;
        };
        showHeader: {
            type: BooleanConstructor;
            default: boolean;
        };
        components: {
            type: import("vue").PropType<import("../vc-table/interface").TableComponents<any>>;
            default: import("../vc-table/interface").TableComponents<any>;
        };
        customRow: {
            type: import("vue").PropType<import("../vc-table/interface").GetComponentProps<any>>;
            default: import("../vc-table/interface").GetComponentProps<any>;
        };
        customHeaderRow: {
            type: import("vue").PropType<import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>>;
            default: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
        };
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
            default: "rtl" | "ltr";
        };
        expandFixed: {
            type: import("vue").PropType<boolean | "left" | "right">;
            default: boolean | "left" | "right";
        };
        expandColumnWidth: NumberConstructor;
        expandedRowKeys: {
            type: import("vue").PropType<import("../vc-table/interface").Key[]>;
            default: import("../vc-table/interface").Key[];
        };
        defaultExpandedRowKeys: {
            type: import("vue").PropType<import("../vc-table/interface").Key[]>;
            default: import("../vc-table/interface").Key[];
        };
        expandedRowRender: {
            type: import("vue").PropType<import("../vc-table/interface").ExpandedRowRender<any>>;
            default: import("../vc-table/interface").ExpandedRowRender<any>;
        };
        expandRowByClick: {
            type: BooleanConstructor;
            default: boolean;
        };
        expandIcon: {
            type: import("vue").PropType<import("../vc-table/interface").RenderExpandIcon<any>>;
            default: import("../vc-table/interface").RenderExpandIcon<any>;
        };
        onExpand: {
            type: import("vue").PropType<(expanded: boolean, record: any) => void>;
            default: (expanded: boolean, record: any) => void;
        };
        onExpandedRowsChange: {
            type: import("vue").PropType<(expandedKeys: import("../vc-table/interface").Key[]) => void>;
            default: (expandedKeys: import("../vc-table/interface").Key[]) => void;
        };
        'onUpdate:expandedRowKeys': {
            type: import("vue").PropType<(expandedKeys: import("../vc-table/interface").Key[]) => void>;
            default: (expandedKeys: import("../vc-table/interface").Key[]) => void;
        };
        defaultExpandAllRows: {
            type: BooleanConstructor;
            default: boolean;
        };
        indentSize: NumberConstructor;
        expandIconColumnIndex: NumberConstructor;
        showExpandColumn: {
            type: BooleanConstructor;
            default: boolean;
        };
        expandedRowClassName: {
            type: import("vue").PropType<import("../vc-table/interface").RowClassName<any>>;
            default: import("../vc-table/interface").RowClassName<any>;
        };
        childrenColumnName: {
            type: import("vue").PropType<string>;
            default: string;
        };
        rowExpandable: {
            type: import("vue").PropType<(record: any) => boolean>;
            default: (record: any) => boolean;
        };
        sticky: {
            type: import("vue").PropType<boolean | import("../vc-table/interface").TableSticky>;
            default: boolean | import("../vc-table/interface").TableSticky;
        };
        dropdownPrefixCls: StringConstructor;
        dataSource: {
            type: import("vue").PropType<any[]>;
            default: any[];
        };
        pagination: {
            type: import("vue").PropType<false | TablePaginationConfig>;
            default: false | TablePaginationConfig;
        };
        loading: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: import("vue").PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                spinning: {
                    type: BooleanConstructor;
                    default: any;
                };
                size: import("vue").PropType<import("../spin/Spin").SpinSize>;
                wrapperClassName: StringConstructor;
                tip: import("vue-types").VueTypeValidableDef<any>;
                delay: NumberConstructor;
                indicator: import("vue-types").VueTypeValidableDef<any>;
            }>>;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        locale: {
            type: import("vue").PropType<import("./interface").TableLocale>;
            default: import("./interface").TableLocale;
        };
        onChange: {
            type: import("vue").PropType<(pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void>;
            default: (pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void;
        };
        onResizeColumn: {
            type: import("vue").PropType<(w: number, col: import("./interface").ColumnType<any>) => void>;
            default: (w: number, col: import("./interface").ColumnType<any>) => void;
        };
        rowSelection: {
            type: import("vue").PropType<import("./interface").TableRowSelection<any>>;
            default: import("./interface").TableRowSelection<any>;
        };
        getPopupContainer: {
            type: import("vue").PropType<import("./interface").GetPopupContainer>;
            default: import("./interface").GetPopupContainer;
        };
        scroll: {
            type: import("vue").PropType<{
                x?: string | number | true;
                y?: string | number;
            } & {
                scrollToFirstRowOnChange?: boolean;
            }>;
            default: {
                x?: string | number | true;
                y?: string | number;
            } & {
                scrollToFirstRowOnChange?: boolean;
            };
        };
        sortDirections: {
            type: import("vue").PropType<import("./interface").SortOrder[]>;
            default: import("./interface").SortOrder[];
        };
        showSorterTooltip: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                title: import("vue-types").VueTypeValidableDef<any>;
                trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
                open: {
                    type: BooleanConstructor;
                    default: any;
                };
                visible: {
                    type: BooleanConstructor;
                    default: any;
                };
                placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
                color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
                transitionName: StringConstructor;
                overlayStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayInnerStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayClassName: StringConstructor;
                openClassName: StringConstructor;
                prefixCls: StringConstructor;
                mouseEnterDelay: NumberConstructor;
                mouseLeaveDelay: NumberConstructor;
                getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
                arrowPointAtCenter: {
                    type: BooleanConstructor;
                    default: any;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter?: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter?: boolean;
                    };
                };
                autoAdjustOverflow: {
                    type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                    default: boolean | import("../tooltip").AdjustOverflow;
                };
                destroyTooltipOnHide: {
                    type: BooleanConstructor;
                    default: any;
                };
                align: {
                    type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                    default: import("../vc-trigger/interface").AlignType;
                };
                builtinPlacements: {
                    type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                    default: import("../vc-trigger/interface").BuildInPlacements;
                };
                children: ArrayConstructor;
                onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
                onOpenChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                title: import("vue-types").VueTypeValidableDef<any>;
                trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
                open: {
                    type: BooleanConstructor;
                    default: any;
                };
                visible: {
                    type: BooleanConstructor;
                    default: any;
                };
                placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
                color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
                transitionName: StringConstructor;
                overlayStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayInnerStyle: {
                    type: import("vue").PropType<import("vue").CSSProperties>;
                    default: import("vue").CSSProperties;
                };
                overlayClassName: StringConstructor;
                openClassName: StringConstructor;
                prefixCls: StringConstructor;
                mouseEnterDelay: NumberConstructor;
                mouseLeaveDelay: NumberConstructor;
                getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
                arrowPointAtCenter: {
                    type: BooleanConstructor;
                    default: any;
                };
                arrow: {
                    type: import("vue").PropType<boolean | {
                        pointAtCenter?: boolean;
                    }>;
                    default: boolean | {
                        pointAtCenter?: boolean;
                    };
                };
                autoAdjustOverflow: {
                    type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                    default: boolean | import("../tooltip").AdjustOverflow;
                };
                destroyTooltipOnHide: {
                    type: BooleanConstructor;
                    default: any;
                };
                align: {
                    type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                    default: import("../vc-trigger/interface").AlignType;
                };
                builtinPlacements: {
                    type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                    default: import("../vc-trigger/interface").BuildInPlacements;
                };
                children: ArrayConstructor;
                onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
                onOpenChange: import("vue").PropType<(vis: boolean) => void>;
                'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
            }>>;
        };
        transformCellText: {
            type: import("vue").PropType<import("../vc-table/interface").TransformCellText<any>>;
            default: import("../vc-table/interface").TransformCellText<any>;
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        scroll: {
            x?: string | number | true;
            y?: string | number;
        } & {
            scrollToFirstRowOnChange?: boolean;
        };
        size: import("../config-provider").SizeType;
        footer: import("../vc-table/interface").PanelRender<any>;
        title: import("../vc-table/interface").PanelRender<any>;
        onChange: (pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void;
        components: import("../vc-table/interface").TableComponents<any>;
        direction: "rtl" | "ltr";
        tableLayout: import("../vc-table/interface").TableLayout;
        columns: import("./interface").ColumnsType<any>;
        sticky: boolean | import("../vc-table/interface").TableSticky;
        prefixCls: string;
        id: string;
        getPopupContainer: import("./interface").GetPopupContainer;
        rowClassName: string | import("../vc-table/interface").RowClassName<any>;
        locale: import("./interface").TableLocale;
        expandIcon: import("../vc-table/interface").RenderExpandIcon<any>;
        loading: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: import("vue").PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>>;
        bordered: boolean;
        onExpand: (expanded: boolean, record: any) => void;
        pagination: false | TablePaginationConfig;
        dataSource: any[];
        rowKey: string | import("./interface").GetRowKey<any>;
        expandedRowKeys: import("../vc-table/interface").Key[];
        defaultExpandedRowKeys: import("../vc-table/interface").Key[];
        expandedRowRender: import("../vc-table/interface").ExpandedRowRender<any>;
        expandRowByClick: boolean;
        onExpandedRowsChange: (expandedKeys: import("../vc-table/interface").Key[]) => void;
        defaultExpandAllRows: boolean;
        showExpandColumn: boolean;
        expandedRowClassName: import("../vc-table/interface").RowClassName<any>;
        childrenColumnName: string;
        rowExpandable: (record: any) => boolean;
        transformCellText: import("../vc-table/interface").TransformCellText<any>;
        onResizeColumn: (w: number, col: import("./interface").ColumnType<any>) => void;
        customHeaderRow: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
        customRow: import("../vc-table/interface").GetComponentProps<any>;
        expandFixed: boolean | "left" | "right";
        showHeader: boolean;
        'onUpdate:expandedRowKeys': (expandedKeys: import("../vc-table/interface").Key[]) => void;
        sortDirections: import("./interface").SortOrder[];
        showSorterTooltip: boolean | Partial<import("vue").ExtractPropTypes<{
            title: import("vue-types").VueTypeValidableDef<any>;
            trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
            open: {
                type: BooleanConstructor;
                default: any;
            };
            visible: {
                type: BooleanConstructor;
                default: any;
            };
            placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
            color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
            transitionName: StringConstructor;
            overlayStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayClassName: StringConstructor;
            openClassName: StringConstructor;
            prefixCls: StringConstructor;
            mouseEnterDelay: NumberConstructor;
            mouseLeaveDelay: NumberConstructor;
            getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
            arrowPointAtCenter: {
                type: BooleanConstructor;
                default: any;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter?: boolean;
                }>;
                default: boolean | {
                    pointAtCenter?: boolean;
                };
            };
            autoAdjustOverflow: {
                type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                default: boolean | import("../tooltip").AdjustOverflow;
            };
            destroyTooltipOnHide: {
                type: BooleanConstructor;
                default: any;
            };
            align: {
                type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                default: import("../vc-trigger/interface").AlignType;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                default: import("../vc-trigger/interface").BuildInPlacements;
            };
            children: ArrayConstructor;
            onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
            onOpenChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
        }>>;
        rowSelection: import("./interface").TableRowSelection<any>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    columns: {
        type: import("vue").PropType<import("./interface").ColumnsType<any>>;
        default: import("./interface").ColumnsType<any>;
    };
    rowKey: {
        type: import("vue").PropType<string | import("./interface").GetRowKey<any>>;
        default: string | import("./interface").GetRowKey<any>;
    };
    tableLayout: {
        type: import("vue").PropType<import("../vc-table/interface").TableLayout>;
        default: import("../vc-table/interface").TableLayout;
    };
    rowClassName: {
        type: import("vue").PropType<string | import("../vc-table/interface").RowClassName<any>>;
        default: string | import("../vc-table/interface").RowClassName<any>;
    };
    title: {
        type: import("vue").PropType<import("../vc-table/interface").PanelRender<any>>;
        default: import("../vc-table/interface").PanelRender<any>;
    };
    footer: {
        type: import("vue").PropType<import("../vc-table/interface").PanelRender<any>>;
        default: import("../vc-table/interface").PanelRender<any>;
    };
    id: {
        type: import("vue").PropType<string>;
        default: string;
    };
    showHeader: {
        type: BooleanConstructor;
        default: boolean;
    };
    components: {
        type: import("vue").PropType<import("../vc-table/interface").TableComponents<any>>;
        default: import("../vc-table/interface").TableComponents<any>;
    };
    customRow: {
        type: import("vue").PropType<import("../vc-table/interface").GetComponentProps<any>>;
        default: import("../vc-table/interface").GetComponentProps<any>;
    };
    customHeaderRow: {
        type: import("vue").PropType<import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>>;
        default: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
    };
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
        default: "rtl" | "ltr";
    };
    expandFixed: {
        type: import("vue").PropType<boolean | "left" | "right">;
        default: boolean | "left" | "right";
    };
    expandColumnWidth: NumberConstructor;
    expandedRowKeys: {
        type: import("vue").PropType<import("../vc-table/interface").Key[]>;
        default: import("../vc-table/interface").Key[];
    };
    defaultExpandedRowKeys: {
        type: import("vue").PropType<import("../vc-table/interface").Key[]>;
        default: import("../vc-table/interface").Key[];
    };
    expandedRowRender: {
        type: import("vue").PropType<import("../vc-table/interface").ExpandedRowRender<any>>;
        default: import("../vc-table/interface").ExpandedRowRender<any>;
    };
    expandRowByClick: {
        type: BooleanConstructor;
        default: boolean;
    };
    expandIcon: {
        type: import("vue").PropType<import("../vc-table/interface").RenderExpandIcon<any>>;
        default: import("../vc-table/interface").RenderExpandIcon<any>;
    };
    onExpand: {
        type: import("vue").PropType<(expanded: boolean, record: any) => void>;
        default: (expanded: boolean, record: any) => void;
    };
    onExpandedRowsChange: {
        type: import("vue").PropType<(expandedKeys: import("../vc-table/interface").Key[]) => void>;
        default: (expandedKeys: import("../vc-table/interface").Key[]) => void;
    };
    'onUpdate:expandedRowKeys': {
        type: import("vue").PropType<(expandedKeys: import("../vc-table/interface").Key[]) => void>;
        default: (expandedKeys: import("../vc-table/interface").Key[]) => void;
    };
    defaultExpandAllRows: {
        type: BooleanConstructor;
        default: boolean;
    };
    indentSize: NumberConstructor;
    expandIconColumnIndex: NumberConstructor;
    showExpandColumn: {
        type: BooleanConstructor;
        default: boolean;
    };
    expandedRowClassName: {
        type: import("vue").PropType<import("../vc-table/interface").RowClassName<any>>;
        default: import("../vc-table/interface").RowClassName<any>;
    };
    childrenColumnName: {
        type: import("vue").PropType<string>;
        default: string;
    };
    rowExpandable: {
        type: import("vue").PropType<(record: any) => boolean>;
        default: (record: any) => boolean;
    };
    sticky: {
        type: import("vue").PropType<boolean | import("../vc-table/interface").TableSticky>;
        default: boolean | import("../vc-table/interface").TableSticky;
    };
    dropdownPrefixCls: StringConstructor;
    dataSource: {
        type: import("vue").PropType<any[]>;
        default: any[];
    };
    pagination: {
        type: import("vue").PropType<false | TablePaginationConfig>;
        default: false | TablePaginationConfig;
    };
    loading: {
        type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: import("vue").PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>>>;
        default: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            spinning: {
                type: BooleanConstructor;
                default: any;
            };
            size: import("vue").PropType<import("../spin/Spin").SpinSize>;
            wrapperClassName: StringConstructor;
            tip: import("vue-types").VueTypeValidableDef<any>;
            delay: NumberConstructor;
            indicator: import("vue-types").VueTypeValidableDef<any>;
        }>>;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    locale: {
        type: import("vue").PropType<import("./interface").TableLocale>;
        default: import("./interface").TableLocale;
    };
    onChange: {
        type: import("vue").PropType<(pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void>;
        default: (pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void;
    };
    onResizeColumn: {
        type: import("vue").PropType<(w: number, col: import("./interface").ColumnType<any>) => void>;
        default: (w: number, col: import("./interface").ColumnType<any>) => void;
    };
    rowSelection: {
        type: import("vue").PropType<import("./interface").TableRowSelection<any>>;
        default: import("./interface").TableRowSelection<any>;
    };
    getPopupContainer: {
        type: import("vue").PropType<import("./interface").GetPopupContainer>;
        default: import("./interface").GetPopupContainer;
    };
    scroll: {
        type: import("vue").PropType<{
            x?: string | number | true;
            y?: string | number;
        } & {
            scrollToFirstRowOnChange?: boolean;
        }>;
        default: {
            x?: string | number | true;
            y?: string | number;
        } & {
            scrollToFirstRowOnChange?: boolean;
        };
    };
    sortDirections: {
        type: import("vue").PropType<import("./interface").SortOrder[]>;
        default: import("./interface").SortOrder[];
    };
    showSorterTooltip: {
        type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
            title: import("vue-types").VueTypeValidableDef<any>;
            trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
            open: {
                type: BooleanConstructor;
                default: any;
            };
            visible: {
                type: BooleanConstructor;
                default: any;
            };
            placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
            color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
            transitionName: StringConstructor;
            overlayStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayClassName: StringConstructor;
            openClassName: StringConstructor;
            prefixCls: StringConstructor;
            mouseEnterDelay: NumberConstructor;
            mouseLeaveDelay: NumberConstructor;
            getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
            arrowPointAtCenter: {
                type: BooleanConstructor;
                default: any;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter?: boolean;
                }>;
                default: boolean | {
                    pointAtCenter?: boolean;
                };
            };
            autoAdjustOverflow: {
                type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                default: boolean | import("../tooltip").AdjustOverflow;
            };
            destroyTooltipOnHide: {
                type: BooleanConstructor;
                default: any;
            };
            align: {
                type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                default: import("../vc-trigger/interface").AlignType;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                default: import("../vc-trigger/interface").BuildInPlacements;
            };
            children: ArrayConstructor;
            onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
            onOpenChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
        }>>>;
        default: boolean | Partial<import("vue").ExtractPropTypes<{
            title: import("vue-types").VueTypeValidableDef<any>;
            trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
            open: {
                type: BooleanConstructor;
                default: any;
            };
            visible: {
                type: BooleanConstructor;
                default: any;
            };
            placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
            color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
            transitionName: StringConstructor;
            overlayStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<import("vue").CSSProperties>;
                default: import("vue").CSSProperties;
            };
            overlayClassName: StringConstructor;
            openClassName: StringConstructor;
            prefixCls: StringConstructor;
            mouseEnterDelay: NumberConstructor;
            mouseLeaveDelay: NumberConstructor;
            getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
            arrowPointAtCenter: {
                type: BooleanConstructor;
                default: any;
            };
            arrow: {
                type: import("vue").PropType<boolean | {
                    pointAtCenter?: boolean;
                }>;
                default: boolean | {
                    pointAtCenter?: boolean;
                };
            };
            autoAdjustOverflow: {
                type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
                default: boolean | import("../tooltip").AdjustOverflow;
            };
            destroyTooltipOnHide: {
                type: BooleanConstructor;
                default: any;
            };
            align: {
                type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
                default: import("../vc-trigger/interface").AlignType;
            };
            builtinPlacements: {
                type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
                default: import("../vc-trigger/interface").BuildInPlacements;
            };
            children: ArrayConstructor;
            onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
            onOpenChange: import("vue").PropType<(vis: boolean) => void>;
            'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
        }>>;
    };
    transformCellText: {
        type: import("vue").PropType<import("../vc-table/interface").TransformCellText<any>>;
        default: import("../vc-table/interface").TransformCellText<any>;
    };
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    scroll: {
        x?: string | number | true;
        y?: string | number;
    } & {
        scrollToFirstRowOnChange?: boolean;
    };
    size: import("../config-provider").SizeType;
    footer: import("../vc-table/interface").PanelRender<any>;
    title: import("../vc-table/interface").PanelRender<any>;
    onChange: (pagination: TablePaginationConfig, filters: Record<string, import("./interface").FilterValue>, sorter: import("./interface").SorterResult<any> | import("./interface").SorterResult<any>[], extra: import("./interface").TableCurrentDataSource<any>) => void;
    components: import("../vc-table/interface").TableComponents<any>;
    direction: "rtl" | "ltr";
    tableLayout: import("../vc-table/interface").TableLayout;
    columns: import("./interface").ColumnsType<any>;
    sticky: boolean | import("../vc-table/interface").TableSticky;
    prefixCls: string;
    id: string;
    getPopupContainer: import("./interface").GetPopupContainer;
    rowClassName: string | import("../vc-table/interface").RowClassName<any>;
    locale: import("./interface").TableLocale;
    expandIcon: import("../vc-table/interface").RenderExpandIcon<any>;
    loading: boolean | Partial<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        spinning: {
            type: BooleanConstructor;
            default: any;
        };
        size: import("vue").PropType<import("../spin/Spin").SpinSize>;
        wrapperClassName: StringConstructor;
        tip: import("vue-types").VueTypeValidableDef<any>;
        delay: NumberConstructor;
        indicator: import("vue-types").VueTypeValidableDef<any>;
    }>>;
    bordered: boolean;
    onExpand: (expanded: boolean, record: any) => void;
    pagination: false | TablePaginationConfig;
    dataSource: any[];
    rowKey: string | import("./interface").GetRowKey<any>;
    expandedRowKeys: import("../vc-table/interface").Key[];
    defaultExpandedRowKeys: import("../vc-table/interface").Key[];
    expandedRowRender: import("../vc-table/interface").ExpandedRowRender<any>;
    expandRowByClick: boolean;
    onExpandedRowsChange: (expandedKeys: import("../vc-table/interface").Key[]) => void;
    defaultExpandAllRows: boolean;
    showExpandColumn: boolean;
    expandedRowClassName: import("../vc-table/interface").RowClassName<any>;
    childrenColumnName: string;
    rowExpandable: (record: any) => boolean;
    transformCellText: import("../vc-table/interface").TransformCellText<any>;
    onResizeColumn: (w: number, col: import("./interface").ColumnType<any>) => void;
    customHeaderRow: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
    customRow: import("../vc-table/interface").GetComponentProps<any>;
    expandFixed: boolean | "left" | "right";
    showHeader: boolean;
    'onUpdate:expandedRowKeys': (expandedKeys: import("../vc-table/interface").Key[]) => void;
    sortDirections: import("./interface").SortOrder[];
    showSorterTooltip: boolean | Partial<import("vue").ExtractPropTypes<{
        title: import("vue-types").VueTypeValidableDef<any>;
        trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
        color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
        transitionName: StringConstructor;
        overlayStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        overlayInnerStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        overlayClassName: StringConstructor;
        openClassName: StringConstructor;
        prefixCls: StringConstructor;
        mouseEnterDelay: NumberConstructor;
        mouseLeaveDelay: NumberConstructor;
        getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
        arrowPointAtCenter: {
            type: BooleanConstructor;
            default: any;
        };
        arrow: {
            type: import("vue").PropType<boolean | {
                pointAtCenter?: boolean;
            }>;
            default: boolean | {
                pointAtCenter?: boolean;
            };
        };
        autoAdjustOverflow: {
            type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
            default: boolean | import("../tooltip").AdjustOverflow;
        };
        destroyTooltipOnHide: {
            type: BooleanConstructor;
            default: any;
        };
        align: {
            type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
            default: import("../vc-trigger/interface").AlignType;
        };
        builtinPlacements: {
            type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
            default: import("../vc-trigger/interface").BuildInPlacements;
        };
        children: ArrayConstructor;
        onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
        'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
        onOpenChange: import("vue").PropType<(vis: boolean) => void>;
        'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
    }>>;
    rowSelection: import("./interface").TableRowSelection<any>;
}, {}, string, import("../_util/type").CustomSlotsType<{
    emptyText?: any;
    expandIcon?: import("../vc-table/interface").RenderExpandIconProps<any>;
    title?: any;
    footer?: any;
    summary?: any;
    expandedRowRender?: any;
    expandColumnTitle?: any;
    bodyCell?: (props: {
        text: any;
        value: any;
        record: Record<string, any>;
        index: number;
        column: import("./interface").ColumnType<any>;
    }) => void;
    headerCell?: (props: {
        title: any;
        column: import("./interface").ColumnType<any>;
    }) => void;
    customFilterIcon?: any;
    customFilterDropdown?: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    SELECTION_ALL: "SELECT_ALL";
    SELECTION_INVERT: "SELECT_INVERT";
    SELECTION_NONE: "SELECT_NONE";
    SELECTION_COLUMN: {};
    EXPAND_COLUMN: {};
    Column: import("vue").DefineComponent<import("./Column").ColumnProps<unknown>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("./Column").ColumnProps<unknown>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    ColumnGroup: import("vue").DefineComponent<import("../vc-table/sugar/ColumnGroup").ColumnGroupProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("../vc-table/sugar/ColumnGroup").ColumnGroupProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Summary: {
        new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("../vc-table/Footer/Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import("../vc-table/Footer/Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, {}>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import("vue").ComponentOptionsBase<Readonly<import("../vc-table/Footer/Summary").SummaryProps> & Readonly<{}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
        Cell: import("vue").DefineComponent<{
            index?: any;
            align?: any;
            colSpan?: any;
            rowSpan?: any;
        }, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
            index?: any;
            align?: any;
            colSpan?: any;
            rowSpan?: any;
        }> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
        Row: import("vue").DefineComponent<{}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
        name: string;
    };
    install: (app: App) => App<any>;
};
export default _default;
