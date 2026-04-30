import type { GetRowKey, Key, GetComponentProps } from '../interface';
export interface BodyProps<RecordType> {
    data: RecordType[];
    getRowKey: GetRowKey<RecordType>;
    measureColumnWidth: boolean;
    expandedKeys: Set<Key>;
    customRow: GetComponentProps<RecordType>;
    rowExpandable: (record: RecordType) => boolean;
    childrenColumnName: string;
}
declare const _default: import("vue").DefineComponent<BodyProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BodyProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
