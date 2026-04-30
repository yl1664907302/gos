import type { CustomizeComponent, GetComponentProps, Key, GetRowKey } from '../interface';
export interface BodyRowProps<RecordType> {
    record: RecordType;
    index: number;
    renderIndex: number;
    recordKey: Key;
    expandedKeys: Set<Key>;
    rowComponent: CustomizeComponent;
    cellComponent: CustomizeComponent;
    customRow: GetComponentProps<RecordType>;
    rowExpandable: (record: RecordType) => boolean;
    indent?: number;
    rowKey: Key;
    getRowKey: GetRowKey<RecordType>;
    childrenColumnName: string;
}
declare const _default: import("vue").DefineComponent<BodyRowProps<unknown>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<BodyRowProps<unknown>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
