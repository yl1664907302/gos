import type { ColumnsType, StickyOffsets, ColumnType, GetComponentProps, DefaultRecordType } from '../interface';
export interface HeaderProps<RecordType = DefaultRecordType> {
    columns: ColumnsType<RecordType>;
    flattenColumns: readonly ColumnType<RecordType>[];
    stickyOffsets: StickyOffsets;
    customHeaderRow: GetComponentProps<readonly ColumnType<RecordType>[]>;
}
declare const _default: import("vue").DefineComponent<HeaderProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<HeaderProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
