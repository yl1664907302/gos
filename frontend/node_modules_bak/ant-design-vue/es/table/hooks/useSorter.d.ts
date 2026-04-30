import type { TransformColumns, ColumnsType, Key, ColumnType, SortOrder, ColumnTitleProps, SorterResult, TableLocale } from '../interface';
import type { TooltipProps } from '../../tooltip';
import type { Ref } from 'vue';
import type { DefaultRecordType } from '../../vc-table/interface';
export interface SortState<RecordType = DefaultRecordType> {
    column: ColumnType<RecordType>;
    key: Key;
    sortOrder: SortOrder | null;
    multiplePriority: number | false;
}
export declare function getSortData<RecordType>(data: readonly RecordType[], sortStates: SortState<RecordType>[], childrenColumnName: string): RecordType[];
interface SorterConfig<RecordType> {
    prefixCls: Ref<string>;
    mergedColumns: Ref<ColumnsType<RecordType>>;
    onSorterChange: (sorterResult: SorterResult<RecordType> | SorterResult<RecordType>[], sortStates: SortState<RecordType>[]) => void;
    sortDirections: Ref<SortOrder[]>;
    tableLocale?: Ref<TableLocale>;
    showSorterTooltip?: Ref<boolean | TooltipProps>;
}
export default function useFilterSorter<RecordType>({ prefixCls, mergedColumns, onSorterChange, sortDirections, tableLocale, showSorterTooltip, }: SorterConfig<RecordType>): [
    TransformColumns<RecordType>,
    Ref<SortState<RecordType>[]>,
    Ref<ColumnTitleProps<RecordType>>,
    Ref<SorterResult<RecordType> | SorterResult<RecordType>[]>
];
export {};
