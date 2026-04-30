import type { ColumnType, ColumnsType, ColumnTitle, ColumnTitleProps, Key } from './interface';
export declare function getColumnKey<RecordType>(column: ColumnType<RecordType>, defaultKey: string): Key;
export declare function getColumnPos(index: number, pos?: string): string;
export declare function renderColumnTitle<RecordType>(title: ColumnTitle<RecordType>, props: ColumnTitleProps<RecordType>): import("../_util/type").VueNode | import("vue").VNodeArrayChildren;
export declare function convertChildrenToColumns<RecordType>(elements?: any[]): ColumnsType<RecordType>;
