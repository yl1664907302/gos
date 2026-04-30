import type { Ref } from 'vue';
import type { TableRowSelection, Key, GetRowKey, TableLocale, SelectionItem, TransformColumns, ExpandType, GetPopupContainer } from '../interface';
export declare const SELECTION_COLUMN: {};
export declare const SELECTION_ALL: "SELECT_ALL";
export declare const SELECTION_INVERT: "SELECT_INVERT";
export declare const SELECTION_NONE: "SELECT_NONE";
interface UseSelectionConfig<RecordType> {
    prefixCls: Ref<string>;
    pageData: Ref<RecordType[]>;
    data: Ref<RecordType[]>;
    getRowKey: Ref<GetRowKey<RecordType>>;
    getRecordByKey: (key: Key) => RecordType;
    expandType: Ref<ExpandType>;
    childrenColumnName: Ref<string>;
    locale: Ref<TableLocale>;
    getPopupContainer?: Ref<GetPopupContainer>;
}
export type INTERNAL_SELECTION_ITEM = SelectionItem | typeof SELECTION_ALL | typeof SELECTION_INVERT | typeof SELECTION_NONE;
export default function useSelection<RecordType>(rowSelectionRef: Ref<TableRowSelection<RecordType> | undefined>, configRef: UseSelectionConfig<RecordType>): [TransformColumns<RecordType>, Ref<Set<Key>>];
export {};
