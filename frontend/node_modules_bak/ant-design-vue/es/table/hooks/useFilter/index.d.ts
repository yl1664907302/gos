import type { DefaultRecordType } from '../../../vc-table/interface';
import type { Ref } from 'vue';
import type { TransformColumns, ColumnsType, ColumnType, Key, TableLocale, FilterValue, FilterKey, GetPopupContainer, ColumnFilterItem } from '../../interface';
export interface FilterState<RecordType = DefaultRecordType> {
    column: ColumnType<RecordType>;
    key: Key;
    filteredKeys?: FilterKey;
    forceFiltered?: boolean;
}
export declare function flattenKeys(filters?: ColumnFilterItem[]): FilterValue;
export declare function getFilterData<RecordType>(data: RecordType[], filterStates: FilterState<RecordType>[]): RecordType[];
interface FilterConfig<RecordType> {
    prefixCls: Ref<string>;
    dropdownPrefixCls: Ref<string>;
    mergedColumns: Ref<ColumnsType<RecordType>>;
    locale: Ref<TableLocale>;
    onFilterChange: (filters: Record<string, FilterValue | null>, filterStates: FilterState<RecordType>[]) => void;
    getPopupContainer?: Ref<GetPopupContainer>;
}
declare function useFilter<RecordType>({ prefixCls, dropdownPrefixCls, mergedColumns: rawMergedColumns, locale, onFilterChange, getPopupContainer, }: FilterConfig<RecordType>): [
    TransformColumns<RecordType>,
    Ref<FilterState<RecordType>[]>,
    Ref<Record<string, FilterValue | null>>
];
export default useFilter;
