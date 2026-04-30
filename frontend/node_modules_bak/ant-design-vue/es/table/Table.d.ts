import type { TableProps as RcTableProps } from '../vc-table/Table';
import type { SpinProps } from '../spin';
import type { TooltipProps } from '../tooltip';
import type { TableRowSelection, GetRowKey, ColumnType, ColumnsType, TableCurrentDataSource, SorterResult, GetPopupContainer, TablePaginationConfig, SortOrder, TableLocale, FilterValue } from './interface';
import type { SizeType } from '../config-provider';
import type { CSSProperties } from 'vue';
import type { DefaultRecordType, RenderExpandIconProps } from '../vc-table/interface';
import type { CustomSlotsType } from '../_util/type';
export type { ColumnsType, TablePaginationConfig };
export interface TableProps<RecordType = DefaultRecordType> extends Omit<RcTableProps<RecordType>, 'transformColumns' | 'internalHooks' | 'internalRefs' | 'data' | 'columns' | 'scroll' | 'emptyText' | 'canExpandable' | 'onUpdateInternalRefs'> {
    dropdownPrefixCls?: string;
    dataSource?: RcTableProps<RecordType>['data'];
    columns?: ColumnsType<RecordType>;
    pagination?: false | TablePaginationConfig;
    loading?: boolean | SpinProps;
    size?: SizeType;
    bordered?: boolean;
    locale?: TableLocale;
    onChange?: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: TableCurrentDataSource<RecordType>) => void;
    onResizeColumn?: (w: number, col: ColumnType) => void;
    rowSelection?: TableRowSelection<RecordType>;
    getPopupContainer?: GetPopupContainer;
    scroll?: RcTableProps<RecordType>['scroll'] & {
        scrollToFirstRowOnChange?: boolean;
    };
    sortDirections?: SortOrder[];
    showSorterTooltip?: boolean | TooltipProps;
}
export declare const tableProps: () => {
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    columns: {
        type: import("vue").PropType<ColumnsType<any>>;
        default: ColumnsType<any>;
    };
    rowKey: {
        type: import("vue").PropType<string | GetRowKey<any>>;
        default: string | GetRowKey<any>;
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
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
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
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    locale: {
        type: import("vue").PropType<TableLocale>;
        default: TableLocale;
    };
    onChange: {
        type: import("vue").PropType<(pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void>;
        default: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void;
    };
    onResizeColumn: {
        type: import("vue").PropType<(w: number, col: ColumnType) => void>;
        default: (w: number, col: ColumnType) => void;
    };
    rowSelection: {
        type: import("vue").PropType<TableRowSelection<any>>;
        default: TableRowSelection<any>;
    };
    getPopupContainer: {
        type: import("vue").PropType<GetPopupContainer>;
        default: GetPopupContainer;
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
        type: import("vue").PropType<SortOrder[]>;
        default: SortOrder[];
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
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
};
declare const Table: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    columns: {
        type: import("vue").PropType<ColumnsType<any>>;
        default: ColumnsType<any>;
    };
    rowKey: {
        type: import("vue").PropType<string | GetRowKey<any>>;
        default: string | GetRowKey<any>;
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
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
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
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    locale: {
        type: import("vue").PropType<TableLocale>;
        default: TableLocale;
    };
    onChange: {
        type: import("vue").PropType<(pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void>;
        default: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void;
    };
    onResizeColumn: {
        type: import("vue").PropType<(w: number, col: ColumnType) => void>;
        default: (w: number, col: ColumnType) => void;
    };
    rowSelection: {
        type: import("vue").PropType<TableRowSelection<any>>;
        default: TableRowSelection<any>;
    };
    getPopupContainer: {
        type: import("vue").PropType<GetPopupContainer>;
        default: GetPopupContainer;
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
        type: import("vue").PropType<SortOrder[]>;
        default: SortOrder[];
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
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
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
    columns: {
        type: import("vue").PropType<ColumnsType<any>>;
        default: ColumnsType<any>;
    };
    rowKey: {
        type: import("vue").PropType<string | GetRowKey<any>>;
        default: string | GetRowKey<any>;
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
    /** @deprecated Please use `EXPAND_COLUMN` in `columns` directly */
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
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    locale: {
        type: import("vue").PropType<TableLocale>;
        default: TableLocale;
    };
    onChange: {
        type: import("vue").PropType<(pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void>;
        default: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void;
    };
    onResizeColumn: {
        type: import("vue").PropType<(w: number, col: ColumnType) => void>;
        default: (w: number, col: ColumnType) => void;
    };
    rowSelection: {
        type: import("vue").PropType<TableRowSelection<any>>;
        default: TableRowSelection<any>;
    };
    getPopupContainer: {
        type: import("vue").PropType<GetPopupContainer>;
        default: GetPopupContainer;
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
        type: import("vue").PropType<SortOrder[]>;
        default: SortOrder[];
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
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
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
            };
            overlayInnerStyle: {
                type: import("vue").PropType<CSSProperties>;
                default: CSSProperties;
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
}>> & Readonly<{}>, {
    scroll: {
        x?: string | number | true;
        y?: string | number;
    } & {
        scrollToFirstRowOnChange?: boolean;
    };
    size: SizeType;
    footer: import("../vc-table/interface").PanelRender<any>;
    title: import("../vc-table/interface").PanelRender<any>;
    onChange: (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>, sorter: SorterResult | SorterResult[], extra: TableCurrentDataSource) => void;
    components: import("../vc-table/interface").TableComponents<any>;
    direction: "rtl" | "ltr";
    tableLayout: import("../vc-table/interface").TableLayout;
    columns: ColumnsType<any>;
    sticky: boolean | import("../vc-table/interface").TableSticky;
    prefixCls: string;
    id: string;
    getPopupContainer: GetPopupContainer;
    rowClassName: string | import("../vc-table/interface").RowClassName<any>;
    locale: TableLocale;
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
    rowKey: string | GetRowKey<any>;
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
    onResizeColumn: (w: number, col: ColumnType) => void;
    customHeaderRow: import("../vc-table/interface").GetComponentProps<import("../vc-table/interface").ColumnType<any>[]>;
    customRow: import("../vc-table/interface").GetComponentProps<any>;
    expandFixed: boolean | "left" | "right";
    showHeader: boolean;
    'onUpdate:expandedRowKeys': (expandedKeys: import("../vc-table/interface").Key[]) => void;
    sortDirections: SortOrder[];
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
            type: import("vue").PropType<CSSProperties>;
            default: CSSProperties;
        };
        overlayInnerStyle: {
            type: import("vue").PropType<CSSProperties>;
            default: CSSProperties;
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
    rowSelection: TableRowSelection<any>;
}, CustomSlotsType<{
    emptyText?: any;
    expandIcon?: RenderExpandIconProps<any>;
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
        column: ColumnType;
    }) => void;
    headerCell?: (props: {
        title: any;
        column: ColumnType;
    }) => void;
    customFilterIcon?: any;
    customFilterDropdown?: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Table;
