import type { ComputedRef, Ref } from 'vue';
import type { ColumnsType, ColumnType, FixedType, Key, GetRowKey, TriggerEventHandler, RenderExpandIcon } from '../interface';
/**
 * Parse `columns` & `children` into `columns`.
 */
declare function useColumns<RecordType>({ prefixCls, columns: baseColumns, expandable, expandedKeys, getRowKey, onTriggerExpand, expandIcon, rowExpandable, expandIconColumnIndex, direction, expandRowByClick, expandColumnWidth, expandFixed, }: {
    prefixCls?: Ref<string>;
    columns?: Ref<ColumnsType<RecordType>>;
    expandable: Ref<boolean>;
    expandedKeys: ComputedRef<Set<Key>>;
    getRowKey: Ref<GetRowKey<RecordType>>;
    onTriggerExpand: TriggerEventHandler<RecordType>;
    expandIcon?: Ref<RenderExpandIcon<RecordType>>;
    rowExpandable?: Ref<(record: RecordType) => boolean>;
    expandIconColumnIndex?: Ref<number>;
    direction?: Ref<'ltr' | 'rtl'>;
    expandRowByClick?: Ref<boolean>;
    expandColumnWidth?: Ref<number | string>;
    expandFixed?: Ref<FixedType>;
}, transformColumns: Ref<(columns: ColumnsType<RecordType>) => ColumnsType<RecordType>>): [ComputedRef<ColumnsType<RecordType>>, ComputedRef<readonly ColumnType<RecordType>[]>];
export default useColumns;
