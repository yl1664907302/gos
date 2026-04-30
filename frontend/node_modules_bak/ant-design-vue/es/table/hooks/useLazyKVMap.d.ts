import type { Ref } from 'vue';
import type { Key, GetRowKey } from '../interface';
export default function useLazyKVMap<RecordType>(dataRef: Ref<readonly RecordType[]>, childrenColumnNameRef: Ref<string>, getRowKeyRef: Ref<GetRowKey<RecordType>>): ((key: Key) => RecordType)[];
