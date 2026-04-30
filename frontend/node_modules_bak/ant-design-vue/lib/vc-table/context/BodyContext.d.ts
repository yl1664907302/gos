import type { ColumnType, DefaultRecordType, ColumnsType, TableLayout, RenderExpandIcon, ExpandableType, RowClassName, TriggerEventHandler, ExpandedRowRender } from '../interface';
import type { InjectionKey } from 'vue';
export interface BodyContextProps<RecordType = DefaultRecordType> {
    rowClassName: string | RowClassName<RecordType>;
    expandedRowClassName: RowClassName<RecordType>;
    columns: ColumnsType<RecordType>;
    flattenColumns: readonly ColumnType<RecordType>[];
    tableLayout: TableLayout;
    indentSize: number;
    expandableType: ExpandableType;
    expandRowByClick: boolean;
    expandedRowRender: ExpandedRowRender<RecordType>;
    expandIcon: RenderExpandIcon<RecordType>;
    onTriggerExpand: TriggerEventHandler<RecordType>;
    expandIconColumnIndex: number;
}
export declare const BodyContextKey: InjectionKey<BodyContextProps>;
export declare const useProvideBody: (props: BodyContextProps) => void;
export declare const useInjectBody: () => BodyContextProps<any>;
