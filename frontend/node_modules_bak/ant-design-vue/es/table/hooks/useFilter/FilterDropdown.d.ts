import type { ColumnType, ColumnFilterItem, Key, TableLocale, GetPopupContainer, FilterSearchType } from '../../interface';
import type { FilterState } from '.';
export type TreeColumnFilterItem = ColumnFilterItem;
export interface FilterDropdownProps<RecordType> {
    tablePrefixCls: string;
    prefixCls: string;
    dropdownPrefixCls: string;
    column: ColumnType<RecordType>;
    filterState?: FilterState<RecordType>;
    filterMultiple: boolean;
    filterMode?: 'menu' | 'tree';
    filterSearch?: FilterSearchType<ColumnFilterItem | TreeColumnFilterItem>;
    columnKey: Key;
    triggerFilter: (filterState: FilterState<RecordType>) => void;
    locale: TableLocale;
    getPopupContainer?: GetPopupContainer;
    filterResetToDefaultFilteredValue?: boolean;
}
declare const _default: import("vue").DefineComponent<FilterDropdownProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FilterDropdownProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
